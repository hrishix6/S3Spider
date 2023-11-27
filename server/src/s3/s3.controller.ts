import { Service } from "typedi";
import { BaseController } from "../app/base.controller";
import { RequestHandler, Router } from "express";
import AsyncHandler from "express-async-handler";
import { S3Service } from ".";
import { BucketParseSchema, PrefixParseSchema, RequiredKeySchema, DeleteFilesRequest } from "./types";
import { formatZodErrors } from "../app/utils";
import { AppMiddleware } from "../app/middlewares";

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
            return this.serverError(res);
        }

        return this.ok(res, result.data);

    }

    getChildren: RequestHandler = async (req, res) => {

        const { accountId } = req.params;
        const { key, bucket } = req.query;

        const bucketParse = await BucketParseSchema.safeParseAsync(bucket);

        if (!bucketParse.success) {
            return this.badRequest(res, "invalid bucket");
        }

        const prefixParse = await PrefixParseSchema.safeParseAsync(key);

        if (!prefixParse.success) {
            return this.badRequest(res, "invalid prefix");
        }

        const result = await this.s3Service.listDirectChildren(accountId, bucketParse.data, prefixParse.data || "");

        if (!result.success) {
            return this.serverError(res);
        }

        return this.ok(res, result.data);
    }

    getPresignedUrlForDL: RequestHandler = async (req, res) => {
        const { accountId } = req.params;
        const { key, bucket } = req.query;

        const bucketParse = await BucketParseSchema.safeParseAsync(bucket);

        if (!bucketParse.success) {
            return this.badRequest(res, "invalid bucket");
        }

        const keyParse = await RequiredKeySchema.safeParseAsync(key);

        if (!keyParse.success) {
            return this.badRequest(res, "invalid key");
        }

        const result = await this.s3Service.getSignedUrlForDL(accountId, bucketParse.data, keyParse.data)

        if (!result.success) {
            return this.serverError(res);
        }

        return this.ok(res, { url: result.data });

    }

    getPresignedUrlForUL: RequestHandler = async (req, res) => {
        const { accountId } = req.params;
        const { key, bucket } = req.query;

        const bucketParse = await BucketParseSchema.safeParseAsync(bucket);

        if (!bucketParse.success) {
            return this.badRequest(res, "invalid bucket");
        }

        const keyParse = await RequiredKeySchema.safeParseAsync(key);

        if (!keyParse.success) {
            return this.badRequest(res, "invalid key");
        }

        const result = await this.s3Service.getSignedUrlForUL(accountId, bucketParse.data, keyParse.data)

        if (!result.success) {
            return this.serverError(res);
        }

        return this.ok(res, { url: result.data });
    }

    deleteFiles: RequestHandler = async (req, res) => {

        const { accountId } = req.params;

        const { body } = req;

        const bodyParse = await DeleteFilesRequest.safeParseAsync(body);

        if (!bodyParse.success) {
            return this.badRequest(res, formatZodErrors(bodyParse.error));
        }

        const { bucket, keys } = bodyParse.data;

        const result = await this.s3Service.deleteObjects(accountId, bucket, keys);

        if (!result.success) {
            return this.serverError(res);
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
            .get(this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.getPresignedUrlForDL.bind(this)));

        router.route("/:accountId/files/ul")
            .get(this.middlewares.awsAccountGuard.bind(this.middlewares), AsyncHandler(this.getPresignedUrlForUL.bind(this)));


        return router;
    }

}