import { PaginatedQueryConfig, PaginatedQueryResult, QueryKey, QueryKeyWithoutArray, QueryKeyWithoutObject, QueryKeyWithoutObjectAndArray, TupleQueryFunction, TupleQueryKey } from '../core/types';
export interface UsePaginatedQueryObjectConfig<TResult, TError, TKey extends TupleQueryKey> {
    queryKey: QueryKey;
    queryFn?: TupleQueryFunction<TResult, TKey>;
    config?: PaginatedQueryConfig<TResult, TError>;
}
export declare function usePaginatedQuery<TResult, TError, TKey extends QueryKeyWithoutObject>(queryKey: TKey, queryConfig?: PaginatedQueryConfig<TResult, TError>): PaginatedQueryResult<TResult, TError>;
export declare function usePaginatedQuery<TResult, TError, TKey extends QueryKeyWithoutObjectAndArray>(queryKey: TKey, queryFn: TupleQueryFunction<TResult, [TKey]>, queryConfig?: PaginatedQueryConfig<TResult, TError>): PaginatedQueryResult<TResult, TError>;
export declare function usePaginatedQuery<TResult, TError, TKey extends TupleQueryKey>(queryKey: TKey, queryFn: TupleQueryFunction<TResult, TKey>, queryConfig?: PaginatedQueryConfig<TResult, TError>): PaginatedQueryResult<TResult, TError>;
export declare function usePaginatedQuery<TResult, TError, TKey extends QueryKeyWithoutArray>(config: UsePaginatedQueryObjectConfig<TResult, TError, [TKey]>): PaginatedQueryResult<TResult, TError>;
export declare function usePaginatedQuery<TResult, TError, TKey extends TupleQueryKey>(config: UsePaginatedQueryObjectConfig<TResult, TError, TKey>): PaginatedQueryResult<TResult, TError>;
