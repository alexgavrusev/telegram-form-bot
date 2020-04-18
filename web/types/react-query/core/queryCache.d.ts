import { Updater } from './utils';
import { Query } from './query';
import { QueryConfig, QueryKey, QueryKeyWithoutObject, ReactQueryConfig, QueryKeyWithoutArray, QueryKeyWithoutObjectAndArray, TupleQueryFunction, TupleQueryKey } from './types';
interface QueryCacheConfig {
    frozen?: boolean;
    defaultConfig?: ReactQueryConfig;
}
interface ClearOptions {
    notify?: boolean;
}
interface PrefetchQueryOptions {
    force?: boolean;
    throwOnError?: boolean;
}
interface InvalidateQueriesOptions extends QueryPredicateOptions {
    refetchActive?: boolean;
    refetchInactive?: boolean;
    throwOnError?: boolean;
}
interface QueryPredicateOptions {
    exact?: boolean;
}
declare type QueryPredicate = QueryKey | QueryPredicateFn | true;
declare type QueryPredicateFn = (query: Query<unknown, unknown>) => boolean;
export interface PrefetchQueryObjectConfig<TResult, TError, TKey extends TupleQueryKey> {
    queryKey: QueryKey;
    queryFn?: TupleQueryFunction<TResult, TKey>;
    config?: QueryConfig<TResult, TError>;
    options?: PrefetchQueryOptions;
}
interface QueryHashMap {
    [hash: string]: Query<any, any>;
}
declare type QueryCacheListener = (cache: QueryCache, query?: Query<unknown, unknown>) => void;
export declare class QueryCache {
    queries: QueryHashMap;
    isFetching: number;
    private config;
    private configRef;
    private globalListeners;
    constructor(config?: QueryCacheConfig);
    private notifyGlobalListeners;
    getDefaultConfig(): ReactQueryConfig<unknown, unknown>;
    subscribe(listener: QueryCacheListener): () => void;
    clear(options?: ClearOptions): void;
    getQueries<TResult = unknown, TError = unknown>(predicate: QueryPredicate, options?: QueryPredicateOptions): Query<TResult, TError>[];
    getQuery<TResult, TError = unknown>(predicate: QueryPredicate): Query<TResult, TError> | undefined;
    getQueryData<TResult>(predicate: QueryPredicate): TResult | undefined;
    removeQueries(predicate: QueryPredicate, options?: QueryPredicateOptions): void;
    cancelQueries(predicate: QueryPredicate, options?: QueryPredicateOptions): void;
    invalidateQueries(predicate: QueryPredicate, options?: InvalidateQueriesOptions): Promise<void>;
    resetErrorBoundaries(): void;
    buildQuery<TResult, TError = unknown>(userQueryKey: QueryKey, queryConfig?: QueryConfig<TResult, TError>): Query<TResult, TError>;
    prefetchQuery<TResult, TError, TKey extends QueryKeyWithoutObject>(queryKey: TKey, options?: PrefetchQueryOptions): Promise<TResult | undefined>;
    prefetchQuery<TResult, TError, TKey extends QueryKeyWithoutObject>(queryKey: TKey, config: QueryConfig<TResult, TError>, options?: PrefetchQueryOptions): Promise<TResult | undefined>;
    prefetchQuery<TResult, TError, TKey extends QueryKeyWithoutObjectAndArray>(queryKey: TKey, queryFn: TupleQueryFunction<TResult, [TKey]>, options?: PrefetchQueryOptions): Promise<TResult | undefined>;
    prefetchQuery<TResult, TError, TKey extends TupleQueryKey>(queryKey: TKey, queryFn: TupleQueryFunction<TResult, TKey>, options?: PrefetchQueryOptions): Promise<TResult | undefined>;
    prefetchQuery<TResult, TError, TKey extends QueryKeyWithoutObjectAndArray>(queryKey: TKey, queryFn: TupleQueryFunction<TResult, [TKey]>, queryConfig: QueryConfig<TResult, TError>, options?: PrefetchQueryOptions): Promise<TResult | undefined>;
    prefetchQuery<TResult, TError, TKey extends TupleQueryKey>(queryKey: TKey, queryFn: TupleQueryFunction<TResult, TKey>, queryConfig: QueryConfig<TResult, TError>, options?: PrefetchQueryOptions): Promise<TResult | undefined>;
    prefetchQuery<TResult, TError, TKey extends QueryKeyWithoutArray>(config: PrefetchQueryObjectConfig<TResult, TError, [TKey]>): Promise<TResult | undefined>;
    prefetchQuery<TResult, TError, TKey extends TupleQueryKey>(config: PrefetchQueryObjectConfig<TResult, TError, TKey>): Promise<TResult | undefined>;
    setQueryData<TResult, TError = unknown>(queryKey: QueryKey, updater: Updater<TResult | undefined, TResult>, config?: QueryConfig<TResult, TError>): void;
}
declare const defaultQueryCache: QueryCache;
export { defaultQueryCache as queryCache };
export declare const queryCaches: QueryCache[];
export declare function makeQueryCache(config?: QueryCacheConfig): QueryCache;
