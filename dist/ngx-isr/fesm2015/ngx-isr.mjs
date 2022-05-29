import * as i0 from '@angular/core';
import { PLATFORM_ID, Injectable, Inject, NgModule } from '@angular/core';
import { isPlatformServer, DOCUMENT, APP_BASE_HREF } from '@angular/common';
import * as i1 from '@angular/router';
import { ChildActivationEnd } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { __awaiter } from 'tslib';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BEFORE_APP_SERIALIZED } from '@angular/platform-server';

const initialState = {
    revalidate: null,
    errors: []
};
class NgxIsrService {
    constructor(platformId, doc, router) {
        this.platformId = platformId;
        this.doc = doc;
        this.router = router;
        this.state = new BehaviorSubject(initialState);
        this.setRevalidate = (revalidate) => {
            this.state.next(Object.assign(Object.assign({}, this.getState()), { revalidate }));
        };
        if (isPlatformServer(this.platformId)) {
            this.activate();
        }
    }
    getState() {
        return this.state.getValue();
    }
    activate() {
        this.router.events
            .pipe(filter((e) => e instanceof ChildActivationEnd), map((event) => {
            let snapshot = event.snapshot;
            while (snapshot.firstChild !== null) {
                snapshot = snapshot.firstChild;
            }
            return snapshot.data;
        }), take(1))
            .subscribe((data) => {
            if ((data === null || data === void 0 ? void 0 : data['revalidate']) !== undefined) {
                this.setRevalidate(data['revalidate']);
            }
        });
    }
    addError(err) {
        const currentErrors = this.getState().errors;
        this.state.next(Object.assign(Object.assign({}, this.getState()), { errors: [...currentErrors, err] }));
    }
}
NgxIsrService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: NgxIsrService, deps: [{ token: PLATFORM_ID }, { token: DOCUMENT }, { token: i1.Router }], target: i0.ɵɵFactoryTarget.Injectable });
NgxIsrService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: NgxIsrService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: NgxIsrService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () {
        return [{ type: Object, decorators: [{
                        type: Inject,
                        args: [PLATFORM_ID]
                    }] }, { type: Document, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }, { type: i1.Router }];
    } });

class CacheHandler {
}

class InMemoryCacheHandler {
    constructor() {
        this.cache = new Map();
    }
    add(url, html, options = { revalidate: null }) {
        const htmlWithMsg = html + cacheMsg(options.revalidate);
        return new Promise((resolve, reject) => {
            const cacheData = {
                html: htmlWithMsg,
                options,
                createdAt: Date.now()
            };
            this.cache.set(url, cacheData);
            resolve();
        });
    }
    get(url) {
        return new Promise((resolve, reject) => {
            if (this.cache.has(url)) {
                resolve(this.cache.get(url));
            }
            reject('This url does not exist in cache!');
        });
    }
    getAll() {
        return new Promise((resolve, reject) => {
            resolve(Array.from(this.cache.keys()));
        });
    }
    has(url) {
        return new Promise((resolve, reject) => {
            resolve(this.cache.has(url));
        });
    }
    delete(url) {
        return new Promise((resolve, reject) => {
            resolve(this.cache.delete(url));
        });
    }
}
const cacheMsg = (revalidateTime) => {
    const time = new Date().toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '');
    let msg = '<!-- ';
    msg += `\n🚀 NgxISR: Served from cache! \n⌛ Last updated: ${time}. `;
    if (revalidateTime) {
        msg += `\n⏭️ Next refresh is after ${revalidateTime} seconds. `;
    }
    msg += ' \n-->';
    return msg;
};

// export * from './filesystem-cache-handler';

// helper method that generates html of an url
const renderUrl = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { req, res, url, indexHtml, providers } = options;
    // we need to override url of req with the one we have in parameters
    req.url = url;
    req.originalUrl = url;
    return new Promise((resolve, reject) => {
        res.render(indexHtml, {
            req,
            providers: providers !== null && providers !== void 0 ? providers : [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
        }, (err, html) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                reject(err);
            }
            resolve(html);
        }));
    });
});

// this script tag will be included in the page if one of the routes on the page
// has `revalidate` key in its route data
const isrScriptTag = '<script id="isr-state" type="application/json">';
function getISROptions(html) {
    const indexOfScriptTag = html === null || html === void 0 ? void 0 : html.indexOf(isrScriptTag);
    // check if script tag is not included
    if (!html || indexOfScriptTag === -1) {
        return { revalidate: null, errors: [] };
    }
    const isrScript = html.substring(indexOfScriptTag); // start from script till the end of html file
    const indexOfCloseScriptTag = isrScript.indexOf("</script>"); // first occurrence of closing script tag
    const val = isrScript
        .substring(0, indexOfCloseScriptTag) // remove close script tag
        .replace(isrScriptTag, ""); // remove start script tag
    return JSON.parse(val);
}

class CacheRegeneration {
    constructor(cache, indexHtml) {
        this.cache = cache;
        this.indexHtml = indexHtml;
        this.urlsOnHold = []; // urls that have regeneration loading
    }
    regenerate(req, res, cacheData, showLogs = false, providers) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url } = req;
            if (this.urlsOnHold.includes(url)) {
                showLogs && console.log('Another regeneration is on-going...');
                return;
            }
            const { options } = cacheData;
            const { revalidate } = options;
            showLogs &&
                console.log(`The url: ${url} will be regenerated after ${revalidate} s.`);
            this.urlsOnHold.push(url);
            setTimeout(() => {
                // re-render the page again
                renderUrl({ req, res, url, indexHtml: this.indexHtml, providers }).then((html) => {
                    const { errors } = getISROptions(html);
                    if (errors === null || errors === void 0 ? void 0 : errors.length) {
                        showLogs && console.error('💥 ERROR: Url: ' + url + ' was not regenerated!', errors);
                        return;
                    }
                    // add the regenerated page to cache
                    this.cache.add(req.url, html, { revalidate }).then(() => {
                        // remove url from urlsOnHold
                        this.urlsOnHold = this.urlsOnHold.filter((x) => x !== url);
                        showLogs && console.log('Url: ' + url + ' was regenerated!');
                    });
                });
            }, revalidate * 1000); // revalidate value is in seconds, so we convert it in milliseconds
        });
    }
}

class ISRHandler {
    constructor(config) {
        var _a;
        this.showLogs = false;
        if (!config) {
            throw new Error('Provide ISRHandlerConfig!');
        }
        this.isrConfig = config;
        this.showLogs = (_a = config === null || config === void 0 ? void 0 : config.enableLogging) !== null && _a !== void 0 ? _a : false;
        // if skipCachingOnHttpError is not provided it will default to true
        this.isrConfig.skipCachingOnHttpError = (config === null || config === void 0 ? void 0 : config.skipCachingOnHttpError) !== false;
        if (config.cache && config.cache instanceof CacheHandler) {
            this.cache = config.cache;
        }
        else {
            this.cache = new InMemoryCacheHandler();
        }
        this.cacheRegeneration = new CacheRegeneration(this.cache, config.indexHtml);
    }
    invalidate(req, res, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const { secretToken, urlToInvalidate } = extractData(req);
            if (secretToken !== this.isrConfig.invalidateSecretToken) {
                res.json({ status: 'error', message: 'Your secret token is wrong!!!' });
            }
            if (!urlToInvalidate) {
                res.json({
                    status: 'error',
                    message: 'Please add `urlToInvalidate` query param in your url',
                });
            }
            if (urlToInvalidate) {
                if (!(yield this.cache.has(urlToInvalidate))) {
                    res.json({
                        status: 'error',
                        message: "The url you provided doesn't exist in cache!",
                    });
                }
                try {
                    // re-render the page again
                    const html = yield renderUrl({
                        req,
                        res,
                        url: urlToInvalidate,
                        indexHtml: this.isrConfig.indexHtml,
                        providers: config === null || config === void 0 ? void 0 : config.providers,
                    });
                    // get revalidate data in order to set it to cache data
                    const { revalidate, errors } = getISROptions(html);
                    // if there are errors when rendering the site we throw an error
                    if ((errors === null || errors === void 0 ? void 0 : errors.length) && this.isrConfig.skipCachingOnHttpError) {
                        throw new Error('The new rendered page had errors: \n' + JSON.stringify(errors));
                    }
                    // add the regenerated page to cache
                    yield this.cache.add(req.url, html, { revalidate });
                    this.showLogs &&
                        console.log(`Url: ${urlToInvalidate} was regenerated!`);
                    res.json({
                        status: 'success',
                        message: `Url: ${urlToInvalidate} was regenerated!`,
                    });
                }
                catch (err) {
                    res.json({
                        status: 'error',
                        message: 'Error while regenerating url!!',
                        err
                    });
                }
            }
        });
    }
    serveFromCache(req, res, next, config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cacheData = yield this.cache.get(req.url);
                const { html, options, createdAt } = cacheData;
                // const lastCacheDateDiff = (Date.now() - createdAt) / 1000; // in seconds
                if (options.revalidate && options.revalidate > 0) {
                    yield this.cacheRegeneration.regenerate(req, res, cacheData, this.showLogs, config === null || config === void 0 ? void 0 : config.providers);
                }
                // Cache exists. Send it.
                this.showLogs && console.log('Page was retrieved from cache: ', req.url);
                res.send(html);
            }
            catch (error) {
                // Cache does not exist. Serve user using SSR
                next();
            }
        });
    }
    render(req, res, next, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const renderUrlConfig = {
                req,
                res,
                url: req.url,
                indexHtml: this.isrConfig.indexHtml,
                providers: config === null || config === void 0 ? void 0 : config.providers
            };
            renderUrl(renderUrlConfig).then((html) => __awaiter(this, void 0, void 0, function* () {
                const { revalidate, errors } = getISROptions(html);
                // if we have any http errors when rendering the site, and we have skipCachingOnHttpError enabled
                // we don't want to cache it, and, we will fall back to client side rendering
                if ((errors === null || errors === void 0 ? void 0 : errors.length) && this.isrConfig.skipCachingOnHttpError) {
                    this.showLogs && console.log('Http errors: \n', errors);
                    res.send(html);
                    return;
                }
                // if revalidate is null we won't cache it
                // if revalidate is 0, we will never clear the cache automatically
                // if revalidate is x, we will clear cache every x seconds (after the last request) for that url
                if (revalidate === null || revalidate === undefined) { // don't do !revalidate because it will also catch "0"
                    res.send(html);
                    return;
                }
                // Cache the rendered `html` for this request url to use for subsequent requests
                yield this.cache.add(req.url, html, { revalidate });
                res.send(html);
            }));
        });
    }
}
const extractData = (req) => {
    return {
        secretToken: req.query['secret'] || null,
        urlToInvalidate: req.query['urlToInvalidate'] || null,
        // urlsToInvalidate: req.body.urls || [],
    };
};

class HttpErrorsInterceptor {
    constructor(ngxIsrService) {
        this.ngxIsrService = ngxIsrService;
    }
    intercept(request, next) {
        return next.handle(request).pipe(catchError(err => {
            this.ngxIsrService.addError(err);
            return throwError(() => err);
        }));
    }
}
HttpErrorsInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HttpErrorsInterceptor, deps: [{ token: NgxIsrService }], target: i0.ɵɵFactoryTarget.Injectable });
HttpErrorsInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HttpErrorsInterceptor });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HttpErrorsInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: NgxIsrService }]; } });
const HTTP_ERROR_PROVIDER_ISR = {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorsInterceptor,
    multi: true,
};

function addIsrDataBeforeSerialized(isrService, doc) {
    return () => addISRDataToBody(doc, isrService.getState());
}
// append script with revalidate and errors data for the current route
function addISRDataToBody(doc, { revalidate, errors }) {
    return new Promise(resolve => {
        const script = doc.createElement('script');
        script.id = 'isr-state';
        script.setAttribute('type', 'application/json');
        script.textContent = JSON.stringify({ revalidate, errors });
        doc.body.appendChild(script);
        resolve();
    });
}

class NgxIsrModule {
    constructor(isrService) {
        this.isrService = isrService;
    }
    static forRoot() {
        return {
            ngModule: NgxIsrModule,
            providers: [
                NgxIsrService,
                HTTP_ERROR_PROVIDER_ISR,
                {
                    provide: BEFORE_APP_SERIALIZED,
                    useFactory: addIsrDataBeforeSerialized,
                    multi: true,
                    deps: [NgxIsrService, DOCUMENT]
                },
            ]
        };
    }
}
NgxIsrModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: NgxIsrModule, deps: [{ token: NgxIsrService }], target: i0.ɵɵFactoryTarget.NgModule });
NgxIsrModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: NgxIsrModule });
NgxIsrModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: NgxIsrModule, providers: [NgxIsrService] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: NgxIsrModule, decorators: [{
            type: NgModule,
            args: [{ providers: [NgxIsrService] }]
        }], ctorParameters: function () { return [{ type: NgxIsrService }]; } });

/*
 * Public API Surface of ngx-isr
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CacheHandler, ISRHandler, InMemoryCacheHandler, NgxIsrModule, NgxIsrService };
//# sourceMappingURL=ngx-isr.mjs.map
