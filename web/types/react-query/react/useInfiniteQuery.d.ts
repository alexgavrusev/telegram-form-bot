import { InfiniteQueryConfig, InfiniteQueryResult, QueryKey, QueryKeyWithoutArray, QueryKeyWithoutObject, QueryKeyWithoutObjectAndArray, TupleQueryFunction, TupleQueryKey } from '../core/types';
export interface UseInfiniteQueryObjectConfig<TResult, TError, TKey extends TupleQueryKey> {
    queryKey: QueryKey;
    queryFn?: TupleQueryFunction<TResult, TKey>;
    config?: InfiniteQueryConfig<TResult, TError>;
}
export declare function useInfiniteQuery<TResult, TError, TKey extends QueryKeyWithoutObject>(queryKey: TKey, queryConfig?: InfiniteQueryConfig<TResult, TError>): InfiniteQueryResult<TResult, TError>;
export declare function useInfiniteQuery<TResult, TError, TKey extends QueryKeyWithoutObjectAndArray>(queryKey: TKey, queryFn: TupleQueryFunction<TResult, [TKey]>, queryConfig?: InfiniteQueryConfig<TResult, TError>): InfiniteQueryResult<TResult, TError>;
export declare function useInfiniteQuery<TResult, TError, TKey extends TupleQueryKey>(queryKey: TKey, queryFn: TupleQueryFunction<TResult, TKey>, queryConfig?: InfiniteQueryConfig<TResult, TError>): InfiniteQueryResult<TResult, TError>;
export declare function useInfiniteQuery<TResult, TError, TKey extends QueryKeyWithoutArray>(config: UseInfiniteQueryObjectConfig<TResult, TError, [TKey]>): InfiniteQueryResult<TResult, TError>;
export declare function useInfiniteQuery<TResult, TError, TKey extends TupleQueryKey>(config: UseInfiniteQueryObjectConfig<TResult, TError, TKey>): InfiniteQueryResult<TResult, TError>;
