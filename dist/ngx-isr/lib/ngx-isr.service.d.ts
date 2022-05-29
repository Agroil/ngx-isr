import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import * as i0 from "@angular/core";
export interface NgxIsrState {
    revalidate: number | null;
    errors: Error[];
}
export declare class NgxIsrService {
    private platformId;
    private doc;
    private router;
    protected state: BehaviorSubject<NgxIsrState>;
    getState(): NgxIsrState;
    constructor(platformId: Object, doc: Document, router: Router);
    activate(): void;
    addError(err: HttpErrorResponse): void;
    setRevalidate: (revalidate: number | null) => void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxIsrService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgxIsrService>;
}
