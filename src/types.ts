import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter.js";
import { isRight } from "fp-ts/lib/Either.js";

export const ConfigSchema = t.type({
    awsProfile: t.string,
    appName: t.string,
    awsRegion: t.string,
    amplifyRole: t.type({
        roleName: t.string,
        createRole: t.boolean,
    }),
    backend: t.type({
        useDynamoTable: t.boolean,
    }),
    githubRepo: t.string,
    route53: t.type({
        domainName: t.string,
    }),
    autoBranchCreation: t.type({
        patterns: t.array(t.string),
        enableAutoBuild: t.boolean,
    })
});

export type Config = t.TypeOf<typeof ConfigSchema>;
export const validateConfig = (config: unknown): Config => {
    const result = ConfigSchema.decode(config);
    if (isRight(result)) {
        return result.right;
    } else {
        const missingConfigs = PathReporter.report(result).map((o) => o.split("/")[1]);
        throw new Error(
            `Invalid configuration file check:\n${JSON.stringify(
                missingConfigs,
                null,
                2
            )}`
        );
    }
};

interface AmplifyApp {
    appId: string;
    appArn: string;
    name: string;
    tags: Record<string, string>;
    description: string;
    repository: string;
    platform: string;
    createTime: string;
    updateTime: string;
    iamServiceRoleArn: string;
    defaultDomain: string;
    enableBranchAutoBuild: boolean;
    enableBranchAutoDeletion: boolean;
    enableBasicAuth: boolean;
    customRules: any[];
    customHeaders: string;
    enableAutoBranchCreation: boolean;
    repositoryCloneMethod: string;
}

export interface AmplifyAppsResponse {
    apps: AmplifyApp[];
}

