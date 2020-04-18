import { Updater } from './utils';
import { QueryInstance, OnStateUpdateFunction } from './queryInstance';
import { ArrayQueryKey, IsFetchingMoreValue, QueryConfig, QueryStatus } from './types';
import { QueryCache } from './queryCache';
interface QueryInitConfig<TResult, TError> {
    queryCache: QueryCache;
    queryKey: ArrayQueryKey;
    queryHash: string;
    config: QueryConfig<TResult, TError>;
    notifyGlobalListeners: (query: Query<TResult, TError>) => void;
}
export interface QueryState<TResult, TError> {
    canFetchMore?: boolean;
    data?: TResult;
    error: TError | null;
    failureCount: number;
    isError: boolean;
    isFetched: boolean;
    isFetching: boolean;
    isFetchingMore?: IsFetchingMoreValue;
    isIdle: boolean;
    isLoading: boolean;
    isStale: boolean;
    isSuccess: boolean;
    status: QueryStatus;
    throwInErrorBoundary?: boolean;
    updatedAt: number;
}
interface FetchOptions {
    fetchMore?: FetchMoreOptions;
}
export interface FetchMoreOptions {
    fetchMoreVariable?: unknown;
    previous: boolean;
}
export declare enum ActionType {
    Failed = "Failed",
    MarkStale = "MarkStale",
    Fetch = "Fetch",
    Success = "Success",
    Error = "Error",
    SetState = "SetState"
}
interface FailedAction {
    type: ActionType.Failed;
}
interface MarkStaleAction {
    type: ActionType.MarkStale;
}
interface FetchAction {
    type: ActionType.Fetch;
}
interface SuccessAction<TResult> {
    type: ActionType.Success;
    updater: Updater<TResult | undefined, TResult>;
    isStale: boolean;
}
interface ErrorAction<TError> {
    type: ActionType.Error;
    cancelled: boolean;
    error: TError;
}
interface SetStateAction<TResult, TError> {
    type: ActionType.SetState;
    updater: Updater<QueryState<TResult, TError>, QueryState<TResult, TError>>;
}
export declare type Action<TResult, TError> = ErrorAction<TError> | FailedAction | FetchAction | MarkStaleAction | SetStateAction<TResult, TError> | SuccessAction<TResult>;
export declare class Query<TResult, TError> {
    queryCache: QueryCache;
    queryKey: ArrayQueryKey;
    queryHash: string;
    config: QueryConfig<TResult, TError>;
    instances: QueryInstance<TResult, TError>[];
    state: QueryState<TResult, TError>;
    shouldContinueRetryOnFocus?: boolean;
    promise?: Promise<TResult | undefined>;
    private fetchMoreVariable?;
    private pageVariables?;
    private cacheTimeout?;
    private retryTimeout?;
    private staleTimeout?;
    private cancelPromises?;
    private cancelled?;
    private notifyGlobalListeners;
    constructor(init: QueryInitConfig<TResult, TError>);
    private dispatch;
    scheduleStaleTimeout(): void;
    invalidate(): void;
    scheduleGarbageCollection(): void;
    refetch(): Promise<void>;
    heal(): void;
    cancel(): void;
    clearIntervals(): void;
    private clearStaleTimeout;
    private clearCacheTimeout;
    private clearRetryTimeout;
    private setState;
    setData(updater: Updater<TResult | undefined, TResult>): void;
    clear(): void;
    subscribe(onStateUpdate?: OnStateUpdateFunction<TResult, TError>): QueryInstance<TResult, TError>;
    private tryFetchData;
    fetch(options?: FetchOptions): Promise<TResult | undefined>;
    fetchMore(fetchMoreVariable?: unknown, options?: FetchMoreOptions): Promise<TResult | undefined>;
}
export declare function queryReducer<TResult, TError>(state: QueryState<TResult, TError>, action: Action<TResult, TError>): QueryState<TResult, TError>;
export {};
