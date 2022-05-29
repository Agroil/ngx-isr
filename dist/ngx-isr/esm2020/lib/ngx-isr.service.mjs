import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import { ChildActivationEnd } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const initialState = {
    revalidate: null,
    errors: []
};
export class NgxIsrService {
    constructor(platformId, doc, router) {
        this.platformId = platformId;
        this.doc = doc;
        this.router = router;
        this.state = new BehaviorSubject(initialState);
        this.setRevalidate = (revalidate) => {
            this.state.next({ ...this.getState(), revalidate });
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
            if (data?.['revalidate'] !== undefined) {
                this.setRevalidate(data['revalidate']);
            }
        });
    }
    addError(err) {
        const currentErrors = this.getState().errors;
        this.state.next({ ...this.getState(), errors: [...currentErrors, err] });
    }
}
NgxIsrService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: NgxIsrService, deps: [{ token: PLATFORM_ID }, { token: DOCUMENT }, { token: i1.Router }], target: i0.ɵɵFactoryTarget.Injectable });
NgxIsrService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: NgxIsrService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: NgxIsrService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.Router }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWlzci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWlzci9zcmMvbGliL25neC1pc3Iuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzdELE9BQU8sRUFBRSxrQkFBa0IsRUFBVSxNQUFNLGlCQUFpQixDQUFDO0FBQzdELE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7OztBQVF2QyxNQUFNLFlBQVksR0FBZ0I7SUFDaEMsVUFBVSxFQUFFLElBQUk7SUFDaEIsTUFBTSxFQUFFLEVBQUU7Q0FDWCxDQUFBO0FBR0QsTUFBTSxPQUFPLGFBQWE7SUFReEIsWUFDK0IsVUFBa0IsRUFDckIsR0FBYSxFQUMvQixNQUFjO1FBRk8sZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUNyQixRQUFHLEdBQUgsR0FBRyxDQUFVO1FBQy9CLFdBQU0sR0FBTixNQUFNLENBQVE7UUFUZCxVQUFLLEdBQUcsSUFBSSxlQUFlLENBQWMsWUFBWSxDQUFDLENBQUM7UUF5Q2pFLGtCQUFhLEdBQUcsQ0FBQyxVQUF5QixFQUFRLEVBQUU7WUFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQTtRQWhDQyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNyQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBWkQsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBWUQsUUFBUTtRQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTthQUNmLElBQUksQ0FDSCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsWUFBWSxrQkFBa0IsQ0FBQyxFQUM5QyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNaLElBQUksUUFBUSxHQUFJLEtBQTRCLENBQUMsUUFBUSxDQUFDO1lBQ3RELE9BQU8sUUFBUSxDQUFDLFVBQVUsS0FBSyxJQUFJLEVBQUU7Z0JBQ25DLFFBQVEsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO2FBQ2hDO1lBQ0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxFQUNGLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FDUjthQUNBLFNBQVMsQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFO1lBQ3ZCLElBQUksSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUN0QyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2FBQ3hDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsUUFBUSxDQUFDLEdBQXNCO1FBQzdCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBRSxHQUFHLGFBQWEsRUFBRSxHQUFHLENBQUUsRUFBRSxDQUFDLENBQUM7SUFDN0UsQ0FBQzs7MEdBekNVLGFBQWEsa0JBU2QsV0FBVyxhQUNYLFFBQVE7OEdBVlAsYUFBYSxjQURBLE1BQU07MkZBQ25CLGFBQWE7a0JBRHpCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzBEQVVXLE1BQU07MEJBQTlDLE1BQU07MkJBQUMsV0FBVzs4QkFDWSxRQUFROzBCQUF0QyxNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIFBMQVRGT1JNX0lEIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCwgaXNQbGF0Zm9ybVNlcnZlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDaGlsZEFjdGl2YXRpb25FbmQsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBmaWx0ZXIsIG1hcCwgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSHR0cEVycm9yUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmd4SXNyU3RhdGUge1xuICByZXZhbGlkYXRlOiBudW1iZXIgfCBudWxsO1xuICBlcnJvcnM6IEVycm9yW107XG59XG5cbmNvbnN0IGluaXRpYWxTdGF0ZTogTmd4SXNyU3RhdGUgPSB7XG4gIHJldmFsaWRhdGU6IG51bGwsXG4gIGVycm9yczogW11cbn1cblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBOZ3hJc3JTZXJ2aWNlIHtcblxuICBwcm90ZWN0ZWQgc3RhdGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PE5neElzclN0YXRlPihpbml0aWFsU3RhdGUpO1xuXG4gIGdldFN0YXRlKCk6IE5neElzclN0YXRlIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5nZXRWYWx1ZSgpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBPYmplY3QsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2M6IERvY3VtZW50LFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJcbiAgKSB7XG4gICAgaWYgKGlzUGxhdGZvcm1TZXJ2ZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgdGhpcy5hY3RpdmF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGFjdGl2YXRlKCk6IHZvaWQge1xuICAgIHRoaXMucm91dGVyLmV2ZW50c1xuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoZSkgPT4gZSBpbnN0YW5jZW9mIENoaWxkQWN0aXZhdGlvbkVuZCksXG4gICAgICAgIG1hcCgoZXZlbnQpID0+IHtcbiAgICAgICAgICBsZXQgc25hcHNob3QgPSAoZXZlbnQgYXMgQ2hpbGRBY3RpdmF0aW9uRW5kKS5zbmFwc2hvdDtcbiAgICAgICAgICB3aGlsZSAoc25hcHNob3QuZmlyc3RDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgc25hcHNob3QgPSBzbmFwc2hvdC5maXJzdENoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc25hcHNob3QuZGF0YTtcbiAgICAgICAgfSksXG4gICAgICAgIHRha2UoMSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICBpZiAoZGF0YT8uWydyZXZhbGlkYXRlJ10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMuc2V0UmV2YWxpZGF0ZShkYXRhWydyZXZhbGlkYXRlJ10pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIGFkZEVycm9yKGVycjogSHR0cEVycm9yUmVzcG9uc2UpOiB2b2lkIHtcbiAgICBjb25zdCBjdXJyZW50RXJyb3JzID0gdGhpcy5nZXRTdGF0ZSgpLmVycm9ycztcbiAgICB0aGlzLnN0YXRlLm5leHQoeyAuLi50aGlzLmdldFN0YXRlKCksIGVycm9yczogWyAuLi5jdXJyZW50RXJyb3JzLCBlcnIgXSB9KTtcbiAgfVxuXG4gIHNldFJldmFsaWRhdGUgPSAocmV2YWxpZGF0ZTogbnVtYmVyIHwgbnVsbCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuc3RhdGUubmV4dCh7IC4uLnRoaXMuZ2V0U3RhdGUoKSwgcmV2YWxpZGF0ZSB9KTtcbiAgfVxuXG59XG4iXX0=