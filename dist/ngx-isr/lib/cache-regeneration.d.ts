import { Provider } from '@angular/core';
import { CacheData, CacheHandler } from './models';
export declare class CacheRegeneration {
    cache: CacheHandler;
    indexHtml: string;
    private urlsOnHold;
    constructor(cache: CacheHandler, indexHtml: string);
    regenerate(req: any, res: any, cacheData: CacheData, showLogs?: boolean, providers?: Provider[]): Promise<void>;
}
