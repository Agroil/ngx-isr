import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./ngx-isr.service";
export class HttpErrorsInterceptor {
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
HttpErrorsInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HttpErrorsInterceptor, deps: [{ token: i1.NgxIsrService }], target: i0.ɵɵFactoryTarget.Injectable });
HttpErrorsInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HttpErrorsInterceptor });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HttpErrorsInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.NgxIsrService }]; } });
export const HTTP_ERROR_PROVIDER_ISR = {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorsInterceptor,
    multi: true,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1lcnJvcnMuaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaXNyL3NyYy9saWIvaHR0cC1lcnJvcnMuaW50ZXJjZXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBWSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsaUJBQWlCLEVBQXdELE1BQU0sc0JBQXNCLENBQUM7QUFDL0csT0FBTyxFQUFFLFVBQVUsRUFBYyxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7OztBQUkxRCxNQUFNLE9BQU8scUJBQXFCO0lBRWhDLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQUcsQ0FBQztJQUVwRCxTQUFTLENBQUMsT0FBNkIsRUFBRSxJQUFpQjtRQUN4RCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUM5QixVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDZixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQyxPQUFPLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQzs7a0hBWFUscUJBQXFCO3NIQUFyQixxQkFBcUI7MkZBQXJCLHFCQUFxQjtrQkFEakMsVUFBVTs7QUFlWCxNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBYTtJQUMvQyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFFBQVEsRUFBRSxxQkFBcUI7SUFDL0IsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgUHJvdmlkZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEhUVFBfSU5URVJDRVBUT1JTLCBIdHRwRXZlbnQsIEh0dHBIYW5kbGVyLCBIdHRwSW50ZXJjZXB0b3IsIEh0dHBSZXF1ZXN0IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgT2JzZXJ2YWJsZSwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTmd4SXNyU2VydmljZSB9IGZyb20gJy4vbmd4LWlzci5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEh0dHBFcnJvcnNJbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBuZ3hJc3JTZXJ2aWNlOiBOZ3hJc3JTZXJ2aWNlKSB7fVxuXG4gIGludGVyY2VwdChyZXF1ZXN0OiBIdHRwUmVxdWVzdDx1bmtub3duPiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPEh0dHBFdmVudDx1bmtub3duPj4ge1xuICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXF1ZXN0KS5waXBlKFxuICAgICAgY2F0Y2hFcnJvcihlcnIgPT4ge1xuICAgICAgICB0aGlzLm5neElzclNlcnZpY2UuYWRkRXJyb3IoZXJyKTtcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoKCkgPT4gZXJyKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgSFRUUF9FUlJPUl9QUk9WSURFUl9JU1I6IFByb3ZpZGVyID0ge1xuICBwcm92aWRlOiBIVFRQX0lOVEVSQ0VQVE9SUyxcbiAgdXNlQ2xhc3M6IEh0dHBFcnJvcnNJbnRlcmNlcHRvcixcbiAgbXVsdGk6IHRydWUsXG59XG4iXX0=