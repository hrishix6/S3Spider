import { Container } from "typedi";
import { S3Client } from "@aws-sdk/client-s3"
import { AwsAccount, AwsAccountsListSchema } from "./types";
import { formatZodErrors } from "../app/utils";

export function getClient(account_id: string) {
    return Container.get(account_id) as S3Client;
}

function registerClient(account: AwsAccount) {
    const { id, client_id, client_region, client_secret } = account;
    Container.set(id, new S3Client({
        credentials: { accessKeyId: client_id, secretAccessKey: client_secret },
        region: client_region,
        apiVersion: "2006-03-01"
    }));
}

export function initClients(accountIds: string[]) {
    const config: Partial<AwsAccount>[] = [];

    if (!accountIds.length) {
        throw new Error("No aws accounts configured, please setup accounts in db and credentials as shown in sample.env");
    }

    for (const account of accountIds) {
        const item: Partial<AwsAccount> = {
            id: account,
            client_id: process.env[`AWS_CLIENT_ID_${account}`],
            client_secret: process.env[`AWS_CLIENT_SECRET_${account}`],
            client_region: process.env[`AWS_CLIENT_REGION_${account}`]
        };

        config.push(item);
    }

    //validate config. 
    const validation = AwsAccountsListSchema.safeParse(config);

    if (!validation.success) {
        throw new Error(`invalid aws account config: ${JSON.stringify(formatZodErrors(validation.error), null, 2)}`);
    }

    for (const account of validation.data) {
        registerClient(account);
    }

}