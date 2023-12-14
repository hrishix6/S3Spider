import { Inject, Service } from 'typedi';
import { ICache } from '../cache/types';
import { CACHE_TOKEN } from '../cache/client';
import { ConfigService } from '../config/config.service';
import { S3Service } from '.';
import { Disc, S3GetObjectsResult } from './types';

const CACHE_EXPIRY_SECONDS_BUCKETS = 3600;
const CACHE_EXPIRY_SECONDS_CHILDREN = 120;

@Service()
export class S3CacheProxy {
  @Inject(CACHE_TOKEN)
  private readonly s3cache: ICache;

  constructor(
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service
  ) {}

  async listBuckets(accountId: string, ignoreCache: boolean) {
    const cacheEnabled = this.configService.get<boolean>('cache_enabled');
    if (!cacheEnabled) {
      return this.s3Service.listBuckets(accountId);
    }

    let success: boolean;
    let data: Disc[];
    let error: unknown;
    let cached: boolean = false;

    const listBucketsCacheKey = `s3/${accountId}/buckets`;

    console.log(`key: ${listBucketsCacheKey}`);

    if (!ignoreCache) {
      const results = await this.s3cache.get(listBucketsCacheKey);
      if (results) {
        console.log('hit');
        success = true;
        data = JSON.parse(results) as Disc[];
        error = null;
        cached = true;
        return { success, data, error, cached };
      }
    }

    const s3Result = await this.s3Service.listBuckets(accountId);
    if (s3Result.success) {
      await this.s3cache.set(
        listBucketsCacheKey,
        JSON.stringify(s3Result.data),
        {
          EX: CACHE_EXPIRY_SECONDS_BUCKETS,
        }
      );
    }
    return s3Result;
  }

  async listDirectChildren(
    accountId: string,
    region: string,
    bucket: string,
    prefix: string = '',
    ignoreCache: boolean,
    ignoreFiles: boolean,
    lastFileKey?: string
  ) {
    const cacheEnabled = this.configService.get<boolean>('cache_enabled');
    if (!cacheEnabled) {
      return this.s3Service.listDirectChildren(
        accountId,
        region,
        bucket,
        prefix,
        ignoreFiles,
        lastFileKey
      );
    }

    let success: boolean;
    let error: unknown;
    let cached: boolean = false;

    let listbucketChildrenCacheKey = `s3/${accountId}/buckets/${bucket}?prefix=${prefix}&region=${region}`;
    if (ignoreFiles) {
      listbucketChildrenCacheKey += '&nofiles';
    }

    if (lastFileKey) {
      listbucketChildrenCacheKey += `&lastkey=${lastFileKey}`;
    }

    if (!ignoreCache) {
      const results = await this.s3cache.get(listbucketChildrenCacheKey);
      if (results) {
        console.log('hit');
        success = true;
        const data = JSON.parse(results) as S3GetObjectsResult;
        error = null;
        cached = true;
        return { success, data, error, cached };
      }
    }

    const s3Result = await this.s3Service.listDirectChildren(
      accountId,
      region,
      bucket,
      prefix,
      ignoreFiles,
      lastFileKey
    );
    if (s3Result.success) {
      await this.s3cache.set(
        listbucketChildrenCacheKey,
        JSON.stringify(s3Result.data),
        {
          EX: CACHE_EXPIRY_SECONDS_CHILDREN,
        }
      );
    }
    return s3Result;
  }
}
