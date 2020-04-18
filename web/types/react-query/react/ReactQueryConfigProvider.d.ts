import React from 'react';
import { ReactQueryConfig } from '../core/types';
export declare function useConfigContext(): ReactQueryConfig<unknown, unknown>;
export interface ReactQueryProviderConfig extends ReactQueryConfig {
}
export interface ReactQueryConfigProviderProps {
    config: ReactQueryProviderConfig;
}
export declare const ReactQueryConfigProvider: React.FC<ReactQueryConfigProviderProps>;
