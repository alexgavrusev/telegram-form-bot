import { QueryResultBase, BaseQueryConfig } from '../core/types';
export declare function useUid(): number;
export declare function useGetLatest<T>(obj: T): () => T;
export declare function useMountedCallback<T extends Function>(callback: T): T;
export declare function useRerenderer(): () => void;
export declare function handleSuspense(config: BaseQueryConfig<any, any>, result: QueryResultBase<any, any>): void;
