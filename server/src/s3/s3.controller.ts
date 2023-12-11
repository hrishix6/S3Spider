import { Service } from "typedi";
import { BaseController } from "../app/base.controller";
import { RequestHandler, Router } from "express";
import AsyncHandler from "express-async-handler";
import { S3Service } from ".";
import { BucketParseSchema, PrefixParseSchema, RequiredKeySchema, DeleteFilesRequest, GetSignedUrlsForDLRequest, FileRenameOrCopyRequest, IngoreCacheKeySchema, RegionParseSchema, CreateFolderRequest } from "./types";
import { AppMiddleware } from "../app/middlewares";
import { AppErrorCode } from "../app/types";
import { S3CacheProxy } from "./s3.cache.service";

@Service()
export class S3Controller extends BaseController {

    constructor(
        private readonly s3CacheProxy: S3CacheProxy,
        private readonly s3Service: S3Service,
        private readonly middlewares: AppMiddleware
    ) {
        super();
    }

    getBuckets: RequestHandler = async (req, res) => {
        const { accountId } = req.params;
        const { nocache } = req.query;
        const ingoreCacheParse = await IngoreCacheKeySchema.safeParseAsync(nocache);

        const shouldIngoreCache = ingoreCacheParse.success;

        const result = await this.s3CacheProxy.listBuckets(accountId, shouldIngoreCache);

        if (!result.success) {
            return this.serverError(res, AppErrorCode.S3_SERVICE_ERROR);
        }

        return this.ok(res, result.data);

    }

    getChildren: RequestHandler = async (req, res) => {

        const { accountId } = req.params;
        const { key, bucket, nocache, region } = req.query;

        const regionParse = await RegionParseSchema.safeParseAsync(region);

        if (!regionParse.success) {
            return this.badRequest(res, AppErrorCode.BAD_REGION);
        }

        const bucketParse = await BucketParseSchema.safeParseAsync(bucket);
        const ingoreCacheParse = await IngoreCacheKeySchema.safeParseAsync(nocache);

        if (!bucketParse.success) {
            return this.badRequest(res, AppErrorCode.INVALID_BUCKET);
        }

        const prefixParse = await PrefixParseSchema.safeParseAsync(key);

        if (!prefixParse.success) {
            return this.badRequest(res, AppErrorCode.INVALID_FOLDER);
        }

        const shouldIngoreCache = ingoreCacheParse.success;

        const result = await this.s3CacheProxy.listDirectChildren(accountId, regionParse.data, bucketParse.data, prefixParse.data || "", shouldIngoreCache);
        if (!result.success) {
            return this.serverError(res, AppErrorCode.S3_SERVICE_ERROR);
        }

        return this.ok(res, result.data);
    }

    getPresignedUrlsForUL: RequestHandler = async (req, res) => {
        const { accountId } = req.params;
        const { bucket, region, key } = req.query;

        const regionParse = await RegionParseSchema.safeParseAsync(region);

        if (!regionParse.success) {
            return this.badRequest(res, AppErrorCode.BAD_REGION);
        }
        const bucketParse = await BucketParseSchema.safeParseAsync(bucket);

        if (!bucketParse.success) {
            return this.badRequest(res, AppErrorCode.INVALID_BUCKET);
        }

        const keyParse = await RequiredKeySchema.safeParseAsync(key);

        if (!keyParse.success) {
            return this.badRequest(res, AppErrorCode.INVALID_FILE);
        }

        const result = await this.s3Service.getSignedUrlForUL(accountId, regionParse.data, bucketParse.data, keyParse.data)

        if (!result.success) {
            return this.serverError(res, AppErrorCode.S3_SERVICE_ERROR);
        }

        return this.ok(res, { url: result.data });
    }

    getPresignedUrlsForDL: RequestHandler = async (req, res) => {
        const { accountId } = req.params;
        const { bucket, region } = req.query;

        const regionParse = await RegionParseSchema.safeParseAsync(region);

        if (!regionParse.success) {
            return this.badRequest(res, AppErrorCode.BAD_REGION);
        }

        const bucketParse = await BucketParseSchema.safeParseAsync(bucket);

        if (!bucketParse.success) {
            return this.badRequest(res, AppErrorCode.INVALID_BUCKET);
        }

        const bodyParse = await GetSignedUrlsForDLRequest.safeParseAsync(req.body);

        if (!bodyParse.success) {
            return this.badRequest(res, AppErrorCode.BAD_PRESIGNED_REQ);
        }

        const { files } = bodyParse.data;

        const signedUrlRequests = files.map(x => this.s3Service.getSignedUrlForDL(accountId, regionParse.data, bucketParse.data, x.key, x.name));

        const results = await Promise.all(signedUrlRequests);

        const data = results.map((x, i) => ({
            ...files[i],
            url: x.data
        }));

        return this.ok(res, data);

    }

    deleteFiles: RequestHandler = async (req, res) => {

        const { accountId } = req.params;

        const { body } = req;

        const bodyParse = await DeleteFilesRequest.safeParseAsync(body);

        if (!bodyParse.success) {
            return this.badRequest(res, AppErrorCode.BAD_DELETION_REQ);
        }

        const { bucket, keys, region } = bodyParse.data;

        const result = await this.s3Service.deleteObjects(accountId, region, bucket, keys);

        if (!result.success) {
            return this.serverError(res, AppErrorCode.S3_SERVICE_ERROR);
        }

        return this.ok(res, { deleted: result.data });
    }

    renameFile: RequestHandler = async (req, res) => {

        const { accountId } = req.params;

        const { body } = req;

        const { bucket, region } = req.query;

        const regionParse = await RegionParseSchema.safeParseAsync(region);

        if (!regionParse.success) {
            return this.badRequest(res, AppErrorCode.BAD_REGION);
        }

        const bucketParse = await BucketParseSchema.safeParseAsync(bucket);

        if (!bucketParse.success) {
            return this.badRequest(res, AppErrorCode.INVALID_BUCKET);
        }

        const bodyParse = await FileRenameOrCopyRequest.safeParseAsync(body);

        if (!bodyParse.success) {
            return this.badRequest(res, AppErrorCode.BAD_RENAME_REQ);
        }

        const { new_name, key } = bodyParse.data;

        const result = await this.s3Service.renameObject(accountId, regionParse.data, bucketParse.data, key, new_name);

        if (!result.success) {
            return this.serverError(res, AppErrorCode.S3_SERVICE_ERROR);
        }

        return this.noContent(res);

    }

    copyFile: RequestHandler = async (req, res) => {
        const { accountId } = req.params;

        const { body } = req;

        const { bucket, region } = req.query;

        const regionParse = await RegionParseSchema.safeParseAsync(region);

        if (!regionParse.success) {
            return this.badRequest(res, AppErrorCode.BAD_REGION);
        }

        const bucketParse = await BucketParseSchema.safeParseAsync(bucket);

        if (!bucketParse.success) {
            return this.badRequest(res, AppErrorCode.INVALID_BUCKET);
        }

        const bodyParse = await FileRenameOrCopyRequest.safeParseAsync(body);

        if (!bodyParse.success) {
            return this.badRequest(res, AppErrorCode.BAD_COPY_REQ);
        }

        const { new_name, key } = bodyParse.data;

        const result = await this.s3Service.copyObject(accountId, regionParse.data, bucketParse.data, key, new_name);

        if (!result.success) {
            return this.serverError(res, AppErrorCode.S3_SERVICE_ERROR);
        }

        return this.noContent(res);
    }

    createFolder: RequestHandler = async (req, res) => {
        const { accountId } = req.params;
        const { bucket, region } = req.query;

        const { body } = req;

        const regionParse = await RegionParseSchema.safeParseAsync(region);

        if (!regionParse.success) {
            return this.badRequest(res, AppErrorCode.BAD_REGION);
        }

        const bucketParse = await BucketParseSchema.safeParseAsync(bucket);

        if (!bucketParse.success) {
            return this.badRequest(res, AppErrorCode.INVALID_BUCKET);
        }

        const bodyParse = await CreateFolderRequest.safeParseAsync(body);

        if (!bodyParse.success) {
            return this.badRequest(res, AppErrorCode.BAD_FOLDER_CREATE_REQ);
        }

        const { key, name } = bodyParse.data;

        const result = await this.s3Service.createFolder(accountId, regionParse.data, bucketParse.data, `${key || ""}${name}/`);

        if (!result.success) {
            return this.serverError(res, AppErrorCode.S3_SERVICE_ERROR);
        }

        return this.noContent(res);
    }

    deleteFolder: RequestHandler = async (req, res) => {

        const { accountId } = req.params;
        const { key, bucket, region } = req.query;

        const regionParse = await RegionParseSchema.safeParseAsync(region);

        if (!regionParse.success) {
            return this.badRequest(res, AppErrorCode.BAD_REGION);
        }

        const bucketParse = await BucketParseSchema.safeParseAsync(bucket);

        if (!bucketParse.success) {
            return this.badRequest(res, AppErrorCode.INVALID_BUCKET);
        }

        const prefixParse = await RequiredKeySchema.safeParseAsync(key);

        if (!prefixParse.success) {
            return this.badRequest(res, AppErrorCode.INVALID_FOLDER);
        }

        const result = await this.s3Service.deleteFolder(accountId, regionParse.data, bucketParse.data, prefixParse.data);

        if (!result) {
            return this.serverError(res, AppErrorCode.S3_SERVICE_ERROR);
        }

        return this.noContent(res);
    }

    routes() {
        const router = Router();

        router.use(this.middlewares.parseJwt.bind(this.middlewares));
        router.use(this.middlewares.includeUser.bind(this.middlewares));

        router.route("/:accountId/buckets")
            .get(this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.getBuckets.bind(this)))

        router.route("/:accountId/files")
            .get(this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.getChildren.bind(this)))//get
            .put(this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.renameFile.bind(this))) //rename
            .post(this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.copyFile.bind(this)));//copy

        router.route("/:accountId/folders")
            .post(this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.createFolder.bind(this)))//create folder
            .delete(this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.deleteFolder.bind(this))); //delete folder

        router.post("/:accountId/files/rm", this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.deleteFiles.bind(this)));

        router.route("/:accountId/files/dl")
            .post(this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.getPresignedUrlsForDL.bind(this))); //download

        // router.route("/:accountId/files/ul")
        //     .post(this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.getPresignedUrlsForUL.bind(this)));


        return router;
    }

}