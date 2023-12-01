import { Service } from "typedi";
import { BaseController } from "../app/base.controller";
import { RequestHandler, Router } from "express";
import AsyncHandler from "express-async-handler";
import { S3Service } from ".";
import { BucketParseSchema, PrefixParseSchema, RequiredKeySchema, DeleteFilesRequest, GetSignedUrlsForDLRequest } from "./types";
import { AppMiddleware } from "../app/middlewares";
import { AppErrorCode } from "../app/types";

@Service()
export class S3Controller extends BaseController {

    constructor(
        private readonly s3Service: S3Service,
        private readonly middlewares: AppMiddleware
    ) {
        super();
    }

    getBuckets: RequestHandler = async (req, res) => {
        const { accountId } = req.params;

        const result = await this.s3Service.listBuckets(accountId);

        if (!result.success) {
            return this.serverError(res, AppErrorCode.S3_SERVICE_ERROR);
        }

        return this.ok(res, result.data);

    }

    getChildren: RequestHandler = async (req, res) => {

        const { accountId } = req.params;
        const { key, bucket } = req.query;

        const bucketParse = await BucketParseSchema.safeParseAsync(bucket);

        if (!bucketParse.success) {
            return this.badRequest(res, AppErrorCode.INVALID_BUCKET);
        }

        const prefixParse = await PrefixParseSchema.safeParseAsync(key);

        if (!prefixParse.success) {
            return this.badRequest(res, AppErrorCode.INVALID_FOLDER);
        }

        const result = await this.s3Service.listDirectChildren(accountId, bucketParse.data, prefixParse.data || "");

        if (!result.success) {
            return this.serverError(res, AppErrorCode.S3_SERVICE_ERROR);
        }

        return this.ok(res, result.data);
    }

    getPresignedUrlsForUL: RequestHandler = async (req, res) => {
        const { accountId } = req.params;
        const { key, bucket } = req.query;

        const bucketParse = await BucketParseSchema.safeParseAsync(bucket);

        if (!bucketParse.success) {
            return this.badRequest(res, AppErrorCode.INVALID_BUCKET);
        }

        const keyParse = await RequiredKeySchema.safeParseAsync(key);

        if (!keyParse.success) {
            return this.badRequest(res, AppErrorCode.INVALID_FILE);
        }

        const result = await this.s3Service.getSignedUrlForDL(accountId, bucketParse.data, keyParse.data)

        if (!result.success) {
            return this.serverError(res, AppErrorCode.S3_SERVICE_ERROR);
        }

        return this.ok(res, { url: result.data });
    }

    getPresignedUrlsForDL: RequestHandler = async (req, res) => {
        const { accountId } = req.params;
        const { bucket } = req.query;

        const bucketParse = await BucketParseSchema.safeParseAsync(bucket);

        if (!bucketParse.success) {
            return this.badRequest(res, AppErrorCode.INVALID_BUCKET);
        }

        const bodyParse = await GetSignedUrlsForDLRequest.safeParseAsync(req.body);

        if (!bodyParse.success) {
            return this.badRequest(res, AppErrorCode.BAD_PRESIGNED_REQ);
        }

        const { files } = bodyParse.data;

        const signedUrlRequests = files.map(x => this.s3Service.getSignedUrlForDL(accountId, bucketParse.data, x.key));

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

        const { bucket, keys } = bodyParse.data;

        const result = await this.s3Service.deleteObjects(accountId, bucket, keys);

        if (!result.success) {
            return this.serverError(res, AppErrorCode.S3_SERVICE_ERROR);
        }

        return this.ok(res, { deleted: result.data });
    }

    routes() {
        const router = Router();

        router.use(this.middlewares.parseJwt.bind(this.middlewares));
        router.use(this.middlewares.includeUser.bind(this.middlewares));

        router.route("/:accountId/buckets")
            .get(this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.getBuckets.bind(this)))

        router.route("/:accountId/files")
            .get(this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.getChildren.bind(this)))
            .post(this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.deleteFiles.bind(this)));

        router.route("/:accountId/files/dl")
            .post(this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.getPresignedUrlsForDL.bind(this)));

        // router.route("/:accountId/files/ul")
        //     .post(this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.getPresignedUrlsForUL.bind(this)));


        return router;
    }

}