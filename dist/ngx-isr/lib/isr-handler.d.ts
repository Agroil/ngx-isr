import { CacheHandler, InvalidateConfig, ISRHandlerConfig, RenderConfig, ServeFromCacheConfig } from './models';
import { CacheRegeneration } from './cache-regeneration';
export declare class ISRHandler {
    protected cache: CacheHandler;
    protected cacheRegeneration: CacheRegeneration;
    protected isrConfig: ISRHandlerConfig;
    protected readonly showLogs: boolean;
    constructor(config?: ISRHandlerConfig);
    invalidate(req: any, res: any, config?: InvalidateConfig): Promise<any>;
    serveFromCache(req: any, res: any, next: any, config?: ServeFromCacheConfig): Promise<any>;
    render(req: any, res: any, next: any, config?: RenderConfig): Promise<any>;
}
