import { Container } from "typedi";
import { S3Client } from "@aws-sdk/client-s3"
import { AwsAccount, AwsAccountsListSchema } from "./types";
import { formatZodErrors } from "../app/utils";

export function getClientId(account_id: string, region: string) {
    return `${account_id}_${region}`;
}

export function getClient(account_id: string, region: string) {
    return Container.get(getClientId(account_id, region)) as S3Client;
}

export function getDefaultClientId(accountId: string) {
    return `${accountId}_default`;
}

export function getDefaultClient(accountId: string) {
    return Container.get(getDefaultClientId(accountId)) as S3Client;
}

function registerClients(account: AwsAccount) {
    const { id, client_id, client_regions, client_secret } = account;
    let defaultClient: S3Client;
    let client: S3Client;
    client_regions.forEach((region, index) => {
        client = new S3Client({
            credentials: { accessKeyId: client_id, secretAccessKey: client_secret },
            region: region,
            apiVersion: "2006-03-01"
        });
        if (index == 0) {
            defaultClient = client;
        }
        Container.set(getClientId(id, region), client);
    });

    Container.set(getDefaultClientId(id), defaultClient!);
}

export function initClients(accountIds: string[]) {
    const config: any[] = [];

    if (!accountIds.length) {
        throw new Error("No aws accounts configured, please setup accounts in db and credentials as shown in sample.env");
    }

    let regions: string | undefined;
    let client_regions: string[] = [];
    for (const account of accountIds) {
        regions = process.env[`AWS_CLIENT_REGION_${account}`];
        if (regions) {
            client_regions = regions.split(",");
        }

        const item = {
            id: account,
            client_id: process.env[`AWS_CLIENT_ID_${account}`],
            client_secret: process.env[`AWS_CLIENT_SECRET_${account}`],
            client_regions
        };

        config.push(item);
    }

    //validate config. 
    const validation = AwsAccountsListSchema.safeParse(config);

    if (!validation.success) {
        throw new Error(`invalid aws account config: ${JSON.stringify(formatZodErrors(validation.error), null, 2)}`);
    }

    for (const account of validation.data) {
        registerClients(account);
    }

}