import { CacheHandler, } from './models';
import { InMemoryCacheHandler } from './cache-handlers';
import { renderUrl } from './utils/render-url';
import { getISROptions } from './utils/get-isr-options';
import { CacheRegeneration } from './cache-regeneration';
export class ISRHandler {
    constructor(config) {
        this.showLogs = false;
        if (!config) {
            throw new Error('Provide ISRHandlerConfig!');
        }
        this.isrConfig = config;
        this.showLogs = config?.enableLogging ?? false;
        // if skipCachingOnHttpError is not provided it will default to true
        this.isrConfig.skipCachingOnHttpError = config?.skipCachingOnHttpError !== false;
        if (config.cache && config.cache instanceof CacheHandler) {
            this.cache = config.cache;
        }
        else {
            this.cache = new InMemoryCacheHandler();
        }
        this.cacheRegeneration = new CacheRegeneration(this.cache, config.indexHtml);
    }
    async invalidate(req, res, config) {
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
            if (!(await this.cache.has(urlToInvalidate))) {
                res.json({
                    status: 'error',
                    message: "The url you provided doesn't exist in cache!",
                });
            }
            try {
                // re-render the page again
                const html = await renderUrl({
                    req,
                    res,
                    url: urlToInvalidate,
                    indexHtml: this.isrConfig.indexHtml,
                    providers: config?.providers,
                });
                // get revalidate data in order to set it to cache data
                const { revalidate, errors } = getISROptions(html);
                // if there are errors when rendering the site we throw an error
                if (errors?.length && this.isrConfig.skipCachingOnHttpError) {
                    throw new Error('The new rendered page had errors: \n' + JSON.stringify(errors));
                }
                // add the regenerated page to cache
                await this.cache.add(req.url, html, { revalidate });
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
    }
    async serveFromCache(req, res, next, config) {
        try {
            const cacheData = await this.cache.get(req.url);
            const { html, options, createdAt } = cacheData;
            // const lastCacheDateDiff = (Date.now() - createdAt) / 1000; // in seconds
            if (options.revalidate && options.revalidate > 0) {
                await this.cacheRegeneration.regenerate(req, res, cacheData, this.showLogs, config?.providers);
            }
            // Cache exists. Send it.
            this.showLogs && console.log('Page was retrieved from cache: ', req.url);
            res.send(html);
        }
        catch (error) {
            // Cache does not exist. Serve user using SSR
            next();
        }
    }
    async render(req, res, next, config) {
        const renderUrlConfig = {
            req,
            res,
            url: req.url,
            indexHtml: this.isrConfig.indexHtml,
            providers: config?.providers
        };
        renderUrl(renderUrlConfig).then(async (html) => {
            const { revalidate, errors } = getISROptions(html);
            // if we have any http errors when rendering the site, and we have skipCachingOnHttpError enabled
            // we don't want to cache it, and, we will fall back to client side rendering
            if (errors?.length && this.isrConfig.skipCachingOnHttpError) {
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
            await this.cache.add(req.url, html, { revalidate });
            res.send(html);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNyLWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaXNyL3NyYy9saWIvaXNyLWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFlBQVksR0FLYixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsU0FBUyxFQUFtQixNQUFNLG9CQUFvQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUV6RCxNQUFNLE9BQU8sVUFBVTtJQU9yQixZQUFZLE1BQXlCO1FBRmxCLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFHM0MsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztTQUM5QztRQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxFQUFFLGFBQWEsSUFBSSxLQUFLLENBQUM7UUFFL0Msb0VBQW9FO1FBQ3BFLElBQUksQ0FBQyxTQUFTLENBQUMsc0JBQXNCLEdBQUcsTUFBTSxFQUFFLHNCQUFzQixLQUFLLEtBQUssQ0FBQztRQUVqRixJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLEtBQUssWUFBWSxZQUFZLEVBQUU7WUFDeEQsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQzNCO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztTQUN6QztRQUVELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixDQUM1QyxJQUFJLENBQUMsS0FB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QUFnRztZQUVoRyxJQUFJLFVBQVUsS0FBSyxJQUFJLElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRSxFQUFFLHNEQUFzRDtnQkFDM0csR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDZixPQUFPO2FBQ1I7WUFFRCxnRkFBZ0Y7WUFDaEYsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDcEQsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQixDQUFDLENBQ0YsQ0FBQztJQUVKLENBQUM7Q0FDRjtBQUVELE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBUSxFQUFFLEVBQUU7SUFDL0IsT0FBTztRQUNMLFdBQVcsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUk7UUFDeEMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxJQUFJO1FBQ3JELHlDQUF5QztLQUMxQyxDQUFDO0FBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2FjaGVIYW5kbGVyLFxuICBJbnZhbGlkYXRlQ29uZmlnLFxuICBJU1JIYW5kbGVyQ29uZmlnLFxuICBSZW5kZXJDb25maWcsXG4gIFNlcnZlRnJvbUNhY2hlQ29uZmlnLFxufSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBJbk1lbW9yeUNhY2hlSGFuZGxlciB9IGZyb20gJy4vY2FjaGUtaGFuZGxlcnMnO1xuaW1wb3J0IHsgcmVuZGVyVXJsLCBSZW5kZXJVcmxDb25maWcgfSBmcm9tICcuL3V0aWxzL3JlbmRlci11cmwnO1xuaW1wb3J0IHsgZ2V0SVNST3B0aW9ucyB9IGZyb20gJy4vdXRpbHMvZ2V0LWlzci1vcHRpb25zJztcbmltcG9ydCB7IENhY2hlUmVnZW5lcmF0aW9uIH0gZnJvbSAnLi9jYWNoZS1yZWdlbmVyYXRpb24nO1xuXG5leHBvcnQgY2xhc3MgSVNSSGFuZGxlciB7XG4gIHByb3RlY3RlZCBjYWNoZSE6IENhY2hlSGFuZGxlcjtcbiAgcHJvdGVjdGVkIGNhY2hlUmVnZW5lcmF0aW9uITogQ2FjaGVSZWdlbmVyYXRpb247XG5cbiAgcHJvdGVjdGVkIGlzckNvbmZpZzogSVNSSGFuZGxlckNvbmZpZztcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHNob3dMb2dzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnPzogSVNSSGFuZGxlckNvbmZpZykge1xuICAgIGlmICghY29uZmlnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb3ZpZGUgSVNSSGFuZGxlckNvbmZpZyEnKTtcbiAgICB9XG5cbiAgICB0aGlzLmlzckNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLnNob3dMb2dzID0gY29uZmlnPy5lbmFibGVMb2dnaW5nID8/IGZhbHNlO1xuXG4gICAgLy8gaWYgc2tpcENhY2hpbmdPbkh0dHBFcnJvciBpcyBub3QgcHJvdmlkZWQgaXQgd2lsbCBkZWZhdWx0IHRvIHRydWVcbiAgICB0aGlzLmlzckNvbmZpZy5za2lwQ2FjaGluZ09uSHR0cEVycm9yID0gY29uZmlnPy5za2lwQ2FjaGluZ09uSHR0cEVycm9yICE9PSBmYWxzZTtcblxuICAgIGlmIChjb25maWcuY2FjaGUgJiYgY29uZmlnLmNhY2hlIGluc3RhbmNlb2YgQ2FjaGVIYW5kbGVyKSB7XG4gICAgICB0aGlzLmNhY2hlID0gY29uZmlnLmNhY2hlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNhY2hlID0gbmV3IEluTWVtb3J5Q2FjaGVIYW5kbGVyKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jYWNoZVJlZ2VuZXJhdGlvbiA9IG5ldyBDYWNoZVJlZ2VuZXJhdGlvbihcbiAgICAgIHRoaXMuY2FjaGUsXG4gICAgICBjb25maWcuaW5kZXhIdG1sXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIGludmFsaWRhdGUoXG4gICAgcmVxOiBhbnksXG4gICAgcmVzOiBhbnksXG4gICAgY29uZmlnPzogSW52YWxpZGF0ZUNvbmZpZ1xuICApOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHsgc2VjcmV0VG9rZW4sIHVybFRvSW52YWxpZGF0ZSB9ID0gZXh0cmFjdERhdGEocmVxKTtcblxuICAgIGlmIChzZWNyZXRUb2tlbiAhPT0gdGhpcy5pc3JDb25maWcuaW52YWxpZGF0ZVNlY3JldFRva2VuKSB7XG4gICAgICByZXMuanNvbih7IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogJ1lvdXIgc2VjcmV0IHRva2VuIGlzIHdyb25nISEhJyB9KTtcbiAgICB9XG5cbiAgICBpZiAoIXVybFRvSW52YWxpZGF0ZSkge1xuICAgICAgcmVzLmpzb24oe1xuICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6ICdQbGVhc2UgYWRkIGB1cmxUb0ludmFsaWRhdGVgIHF1ZXJ5IHBhcmFtIGluIHlvdXIgdXJsJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh1cmxUb0ludmFsaWRhdGUpIHtcbiAgICAgIGlmICghKGF3YWl0IHRoaXMuY2FjaGUuaGFzKHVybFRvSW52YWxpZGF0ZSkpKSB7XG4gICAgICAgIHJlcy5qc29uKHtcbiAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogXCJUaGUgdXJsIHlvdSBwcm92aWRlZCBkb2Vzbid0IGV4aXN0IGluIGNhY2hlIVwiLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gcmUtcmVuZGVyIHRoZSBwYWdlIGFnYWluXG4gICAgICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJVcmwoe1xuICAgICAgICAgIHJlcSxcbiAgICAgICAgICByZXMsXG4gICAgICAgICAgdXJsOiB1cmxUb0ludmFsaWRhdGUsXG4gICAgICAgICAgaW5kZXhIdG1sOiB0aGlzLmlzckNvbmZpZy5pbmRleEh0bWwsXG4gICAgICAgICAgcHJvdmlkZXJzOiBjb25maWc/LnByb3ZpZGVycyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZ2V0IHJldmFsaWRhdGUgZGF0YSBpbiBvcmRlciB0byBzZXQgaXQgdG8gY2FjaGUgZGF0YVxuICAgICAgICBjb25zdCB7IHJldmFsaWRhdGUsIGVycm9ycyB9ID0gZ2V0SVNST3B0aW9ucyhodG1sKTtcblxuICAgICAgICAvLyBpZiB0aGVyZSBhcmUgZXJyb3JzIHdoZW4gcmVuZGVyaW5nIHRoZSBzaXRlIHdlIHRocm93IGFuIGVycm9yXG4gICAgICAgIGlmIChlcnJvcnM/Lmxlbmd0aCAmJiB0aGlzLmlzckNvbmZpZy5za2lwQ2FjaGluZ09uSHR0cEVycm9yKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgbmV3IHJlbmRlcmVkIHBhZ2UgaGFkIGVycm9yczogXFxuJyArIEpTT04uc3RyaW5naWZ5KGVycm9ycykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHRoZSByZWdlbmVyYXRlZCBwYWdlIHRvIGNhY2hlXG4gICAgICAgIGF3YWl0IHRoaXMuY2FjaGUuYWRkKHJlcS51cmwsIGh0bWwsIHsgcmV2YWxpZGF0ZSB9KTtcblxuICAgICAgICB0aGlzLnNob3dMb2dzICYmXG4gICAgICAgIGNvbnNvbGUubG9nKGBVcmw6ICR7IHVybFRvSW52YWxpZGF0ZSB9IHdhcyByZWdlbmVyYXRlZCFgKTtcblxuICAgICAgICByZXMuanNvbih7XG4gICAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgICAgbWVzc2FnZTogYFVybDogJHsgdXJsVG9JbnZhbGlkYXRlIH0gd2FzIHJlZ2VuZXJhdGVkIWAsXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJlcy5qc29uKHtcbiAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogJ0Vycm9yIHdoaWxlIHJlZ2VuZXJhdGluZyB1cmwhIScsXG4gICAgICAgICAgZXJyXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNlcnZlRnJvbUNhY2hlKFxuICAgIHJlcTogYW55LFxuICAgIHJlczogYW55LFxuICAgIG5leHQ6IGFueSxcbiAgICBjb25maWc/OiBTZXJ2ZUZyb21DYWNoZUNvbmZpZ1xuICApOiBQcm9taXNlPGFueT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjYWNoZURhdGEgPSBhd2FpdCB0aGlzLmNhY2hlLmdldChyZXEudXJsKTtcbiAgICAgIGNvbnN0IHsgaHRtbCwgb3B0aW9ucywgY3JlYXRlZEF0IH0gPSBjYWNoZURhdGE7XG5cbiAgICAgIC8vIGNvbnN0IGxhc3RDYWNoZURhdGVEaWZmID0gKERhdGUubm93KCkgLSBjcmVhdGVkQXQpIC8gMTAwMDsgLy8gaW4gc2Vjb25kc1xuICAgICAgaWYgKG9wdGlvbnMucmV2YWxpZGF0ZSAmJiBvcHRpb25zLnJldmFsaWRhdGUgPiAwKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuY2FjaGVSZWdlbmVyYXRpb24ucmVnZW5lcmF0ZShcbiAgICAgICAgICByZXEsXG4gICAgICAgICAgcmVzLFxuICAgICAgICAgIGNhY2hlRGF0YSxcbiAgICAgICAgICB0aGlzLnNob3dMb2dzLFxuICAgICAgICAgIGNvbmZpZz8ucHJvdmlkZXJzXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8vIENhY2hlIGV4aXN0cy4gU2VuZCBpdC5cbiAgICAgIHRoaXMuc2hvd0xvZ3MgJiYgY29uc29sZS5sb2coJ1BhZ2Ugd2FzIHJldHJpZXZlZCBmcm9tIGNhY2hlOiAnLCByZXEudXJsKTtcbiAgICAgIHJlcy5zZW5kKGh0bWwpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBDYWNoZSBkb2VzIG5vdCBleGlzdC4gU2VydmUgdXNlciB1c2luZyBTU1JcbiAgICAgIG5leHQoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyByZW5kZXIocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnksIGNvbmZpZz86IFJlbmRlckNvbmZpZyk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3QgcmVuZGVyVXJsQ29uZmlnOiBSZW5kZXJVcmxDb25maWcgPSB7XG4gICAgICByZXEsXG4gICAgICByZXMsXG4gICAgICB1cmw6IHJlcS51cmwsXG4gICAgICBpbmRleEh0bWw6IHRoaXMuaXNyQ29uZmlnLmluZGV4SHRtbCxcbiAgICAgIHByb3ZpZGVyczogY29uZmlnPy5wcm92aWRlcnNcbiAgICB9O1xuXG4gICAgcmVuZGVyVXJsKHJlbmRlclVybENvbmZpZykudGhlbihcbiAgICAgIGFzeW5jIChodG1sKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgcmV2YWxpZGF0ZSwgZXJyb3JzIH0gPSBnZXRJU1JPcHRpb25zKGh0bWwpO1xuXG4gICAgICAgIC8vIGlmIHdlIGhhdmUgYW55IGh0dHAgZXJyb3JzIHdoZW4gcmVuZGVyaW5nIHRoZSBzaXRlLCBhbmQgd2UgaGF2ZSBza2lwQ2FjaGluZ09uSHR0cEVycm9yIGVuYWJsZWRcbiAgICAgICAgLy8gd2UgZG9uJ3Qgd2FudCB0byBjYWNoZSBpdCwgYW5kLCB3ZSB3aWxsIGZhbGwgYmFjayB0byBjbGllbnQgc2lkZSByZW5kZXJpbmdcbiAgICAgICAgaWYgKGVycm9ycz8ubGVuZ3RoICYmIHRoaXMuaXNyQ29uZmlnLnNraXBDYWNoaW5nT25IdHRwRXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dMb2dzICYmIGNvbnNvbGUubG9nKCdIdHRwIGVycm9yczogXFxuJywgZXJyb3JzKTtcbiAgICAgICAgICByZXMuc2VuZChodG1sKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiByZXZhbGlkYXRlIGlzIG51bGwgd2Ugd29uJ3QgY2FjaGUgaXRcbiAgICAgICAgLy8gaWYgcmV2YWxpZGF0ZSBpcyAwLCB3ZSB3aWxsIG5ldmVyIGNsZWFyIHRoZSBjYWNoZSBhdXRvbWF0aWNhbGx5XG4gICAgICAgIC8vIGlmIHJldmFsaWRhdGUgaXMgeCwgd2Ugd2lsbCBjbGVhciBjYWNoZSBldmVyeSB4IHNlY29uZHMgKGFmdGVyIHRoZSBsYXN0IHJlcXVlc3QpIGZvciB0aGF0IHVybFxuXG4gICAgICAgIGlmIChyZXZhbGlkYXRlID09PSBudWxsIHx8IHJldmFsaWRhdGUgPT09IHVuZGVmaW5lZCkgeyAvLyBkb24ndCBkbyAhcmV2YWxpZGF0ZSBiZWNhdXNlIGl0IHdpbGwgYWxzbyBjYXRjaCBcIjBcIlxuICAgICAgICAgIHJlcy5zZW5kKGh0bWwpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENhY2hlIHRoZSByZW5kZXJlZCBgaHRtbGAgZm9yIHRoaXMgcmVxdWVzdCB1cmwgdG8gdXNlIGZvciBzdWJzZXF1ZW50IHJlcXVlc3RzXG4gICAgICAgIGF3YWl0IHRoaXMuY2FjaGUuYWRkKHJlcS51cmwsIGh0bWwsIHsgcmV2YWxpZGF0ZSB9KTtcbiAgICAgICAgcmVzLnNlbmQoaHRtbCk7XG4gICAgICB9XG4gICAgKTtcblxuICB9XG59XG5cbmNvbnN0IGV4dHJhY3REYXRhID0gKHJlcTogYW55KSA9PiB7XG4gIHJldHVybiB7XG4gICAgc2VjcmV0VG9rZW46IHJlcS5xdWVyeVsnc2VjcmV0J10gfHwgbnVsbCxcbiAgICB1cmxUb0ludmFsaWRhdGU6IHJlcS5xdWVyeVsndXJsVG9JbnZhbGlkYXRlJ10gfHwgbnVsbCxcbiAgICAvLyB1cmxzVG9JbnZhbGlkYXRlOiByZXEuYm9keS51cmxzIHx8IFtdLFxuICB9O1xufTtcbiJdfQ==