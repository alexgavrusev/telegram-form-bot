import { QueryConfig, QueryStatus, QueryKey } from './types';
export declare type DataUpdateFunction<TInput, TOutput> = (input: TInput) => TOutput;
export declare type Updater<TInput, TOutput> = TOutput | DataUpdateFunction<TInput, TOutput>;
declare type ConsoleFunction = (...args: any[]) => void;
export interface ConsoleObject {
    log: ConsoleFunction;
    warn: ConsoleFunction;
    error: ConsoleFunction;
}
export declare const uid: () => number;
export declare const cancelledError: {};
export declare const globalStateListeners: never[];
export declare const isServer: boolean;
export declare function noop(): void;
export declare function identity<T>(d: T): T;
export declare let Console: ConsoleObject;
export declare function setConsole(c: ConsoleObject): void;
export declare function functionalUpdate<TInput, TOutput>(updater: Updater<TInput, TOutput>, input: TInput): TOutput;
export declare function stableStringify(value: any): string;
export declare function isObject(a: unknown): boolean;
export declare function deepIncludes(a: any, b: any): boolean;
export declare function isDocumentVisible(): boolean;
export declare function isOnline(): boolean;
export declare function getQueryArgs<TResult, TError, TOptions = undefined>(args: any[]): [QueryKey, QueryConfig<TResult, TError>, TOptions];
export declare function deepEqual(a: any, b: any): boolean;
export declare function shallowEqual(a: any, b: any): boolean;
export declare function getStatusProps<T extends QueryStatus>(status: T): {
    status: T;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    isIdle: boolean;
};
export {};
