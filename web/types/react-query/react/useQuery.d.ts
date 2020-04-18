import { QueryConfig, QueryKey, QueryKeyWithoutArray, QueryKeyWithoutObject, QueryKeyWithoutObjectAndArray, QueryResult, TupleQueryFunction, TupleQueryKey } from '../core/types';
export interface UseQueryObjectConfig<TResult, TError, TKey extends TupleQueryKey> {
    queryKey: QueryKey;
    queryFn?: TupleQueryFunction<TResult, [TKey]>;
    config?: QueryConfig<TResult, TError>;
}
export declare function useQuery<TResult, TError, TKey extends QueryKeyWithoutObject>(queryKey: TKey, queryConfig?: QueryConfig<TResult, TError>): QueryResult<TResult, TError>;
export declare function useQuery<TResult, TError, TKey extends QueryKeyWithoutObjectAndArray>(queryKey: TKey, queryFn: TupleQueryFunction<TResult, [TKey]>, queryConfig?: QueryConfig<TResult, TError>): QueryResult<TResult, TError>;
export declare function useQuery<TResult, TError, TKey extends TupleQueryKey>(queryKey: TKey, queryFn: TupleQueryFunction<TResult, TKey>, queryConfig?: QueryConfig<TResult, TError>): QueryResult<TResult, TError>;
export declare function useQuery<TResult, TError, TKey extends QueryKeyWithoutArray>(config: UseQueryObjectConfig<TResult, TError, [TKey]>): QueryResult<TResult, TError>;
export declare function useQuery<TResult, TError, TKey extends TupleQueryKey>(config: UseQueryObjectConfig<TResult, TError, TKey>): QueryResult<TResult, TError>;
