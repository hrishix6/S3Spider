import { SetOptions } from "redis";

export interface ICache {
    set: (key: string, value: string, options?: SetOptions) => Promise<void>;
    get: (key: string) => Promise<string | null>
}