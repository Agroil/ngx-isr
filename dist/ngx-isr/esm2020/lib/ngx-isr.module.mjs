import { NgModule } from '@angular/core';
import { NgxIsrService } from './ngx-isr.service';
import { HTTP_ERROR_PROVIDER_ISR } from './http-errors.interceptor';
import { BEFORE_APP_SERIALIZED } from '@angular/platform-server';
import { addIsrDataBeforeSerialized } from './utils/add-isr-data-before-serialized';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "./ngx-isr.service";
export class NgxIsrModule {
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
NgxIsrModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: NgxIsrModule, deps: [{ token: i1.NgxIsrService }], target: i0.ɵɵFactoryTarget.NgModule });
NgxIsrModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: NgxIsrModule });
NgxIsrModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: NgxIsrModule, providers: [NgxIsrService] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: NgxIsrModule, decorators: [{
            type: NgModule,
            args: [{ providers: [NgxIsrService] }]
        }], ctorParameters: function () { return [{ type: i1.NgxIsrService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWlzci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtaXNyL3NyYy9saWIvbmd4LWlzci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2xELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBRzNDLE1BQU0sT0FBTyxZQUFZO0lBQ3ZCLFlBQW9CLFVBQXlCO1FBQXpCLGVBQVUsR0FBVixVQUFVLENBQWU7SUFBRyxDQUFDO0lBRWpELE1BQU0sQ0FBQyxPQUFPO1FBQ1osT0FBTztZQUNMLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFNBQVMsRUFBRTtnQkFDVCxhQUFhO2dCQUNiLHVCQUF1QjtnQkFDdkI7b0JBQ0UsT0FBTyxFQUFFLHFCQUFxQjtvQkFDOUIsVUFBVSxFQUFFLDBCQUEwQjtvQkFDdEMsS0FBSyxFQUFFLElBQUk7b0JBQ1gsSUFBSSxFQUFFLENBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBRTtpQkFDbEM7YUFDRjtTQUNGLENBQUE7SUFDSCxDQUFDOzt5R0FqQlUsWUFBWTswR0FBWixZQUFZOzBHQUFaLFlBQVksYUFERixDQUFFLGFBQWEsQ0FBRTsyRkFDM0IsWUFBWTtrQkFEeEIsUUFBUTttQkFBQyxFQUFFLFNBQVMsRUFBRSxDQUFFLGFBQWEsQ0FBRSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5neElzclNlcnZpY2UgfSBmcm9tICcuL25neC1pc3Iuc2VydmljZSc7XG5pbXBvcnQgeyBIVFRQX0VSUk9SX1BST1ZJREVSX0lTUiB9IGZyb20gJy4vaHR0cC1lcnJvcnMuaW50ZXJjZXB0b3InO1xuaW1wb3J0IHsgQkVGT1JFX0FQUF9TRVJJQUxJWkVEIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tc2VydmVyJztcbmltcG9ydCB7IGFkZElzckRhdGFCZWZvcmVTZXJpYWxpemVkIH0gZnJvbSAnLi91dGlscy9hZGQtaXNyLWRhdGEtYmVmb3JlLXNlcmlhbGl6ZWQnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5ATmdNb2R1bGUoeyBwcm92aWRlcnM6IFsgTmd4SXNyU2VydmljZSBdIH0pXG5leHBvcnQgY2xhc3MgTmd4SXNyTW9kdWxlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpc3JTZXJ2aWNlOiBOZ3hJc3JTZXJ2aWNlKSB7fVxuXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Tmd4SXNyTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBOZ3hJc3JNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgTmd4SXNyU2VydmljZSxcbiAgICAgICAgSFRUUF9FUlJPUl9QUk9WSURFUl9JU1IsXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBCRUZPUkVfQVBQX1NFUklBTElaRUQsXG4gICAgICAgICAgdXNlRmFjdG9yeTogYWRkSXNyRGF0YUJlZm9yZVNlcmlhbGl6ZWQsXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgICAgZGVwczogWyBOZ3hJc3JTZXJ2aWNlLCBET0NVTUVOVCBdXG4gICAgICAgIH0sXG4gICAgICBdXG4gICAgfVxuICB9XG5cbn1cbiJdfQ==