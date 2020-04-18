import { QueryConfig, QueryKey } from '../core/types';
export declare function useQueryArgs<TResult, TError, TOptions = undefined>(args: any[]): [QueryKey, QueryConfig<TResult, TError>, TOptions];
