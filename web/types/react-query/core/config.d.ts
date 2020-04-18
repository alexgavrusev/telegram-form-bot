import { QueryKeySerializerFunction, ReactQueryConfig } from './types';
export interface ReactQueryConfigRef {
    current: ReactQueryConfig;
}
export declare const defaultQueryKeySerializerFn: QueryKeySerializerFunction;
export declare const DEFAULT_CONFIG: ReactQueryConfig;
export declare const defaultConfigRef: ReactQueryConfigRef;
