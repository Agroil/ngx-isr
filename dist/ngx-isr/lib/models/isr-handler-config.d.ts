import { Provider } from '@angular/core';
import { CacheHandler } from "./cache-handler";
export interface ISRHandlerConfig {
    cache?: CacheHandler;
    indexHtml: string;
    invalidateSecretToken: string;
    enableLogging?: boolean;
    skipCachingOnHttpError?: boolean;
}
export interface ServeFromCacheConfig {
    providers?: Provider[];
}
export interface InvalidateConfig {
    providers?: Provider[];
}
export interface RenderConfig {
    providers?: Provider[];
}
