import { QueryConfig, QueryKey, QueryResultBase } from '../core/types';
export declare function useBaseQuery<TResult, TError>(queryKey: QueryKey, config?: QueryConfig<TResult, TError>): QueryResultBase<TResult, TError>;
