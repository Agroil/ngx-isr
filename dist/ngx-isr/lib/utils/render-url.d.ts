import { Provider } from '@angular/core';
export interface RenderUrlConfig {
    req: any;
    res: any;
    url: string;
    indexHtml: string;
    providers?: Provider[];
}
export declare const renderUrl: (options: RenderUrlConfig) => Promise<string>;
