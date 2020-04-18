import { Query, QueryState, Action } from './query';
import { BaseQueryConfig } from './types';
export declare type OnStateUpdateFunction<TResult, TError> = (state: QueryState<TResult, TError>) => void;
export declare class QueryInstance<TResult, TError> {
    id: number;
    config: BaseQueryConfig<TResult, TError>;
    private query;
    private refetchIntervalId?;
    private stateUpdateListener?;
    constructor(query: Query<TResult, TError>, onStateUpdate?: OnStateUpdateFunction<TResult, TError>);
    clearInterval(): void;
    updateConfig(config: BaseQueryConfig<TResult, TError>): void;
    run(): Promise<void>;
    unsubscribe(preventGC?: boolean): void;
    onStateUpdate(state: QueryState<TResult, TError>, action: Action<TResult, TError>): void;
}
