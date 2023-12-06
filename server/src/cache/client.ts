import { createClient, RedisClientOptions } from "redis";
import { Token } from "typedi";

export const CACHE_TOKEN = new Token("s3_cache");

export function getCacheClient(config: RedisClientOptions) {
    return createClient(config);
}