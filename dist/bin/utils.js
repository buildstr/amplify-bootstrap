import { IAMClient, GetRoleCommand, SimulatePrincipalPolicyCommand, CreateRoleCommand, ListAttachedRolePoliciesCommand, AttachRolePolicyCommand, } from '@aws-sdk/client-iam';
import { AmplifyClient, CreateAppCommand, ListAppsCommand, Platform } from '@aws-sdk/client-amplify';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import * as yaml from 'js-yaml';
import { validateConfig } from '../types.js';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { execa } from 'execa';
import chalk from 'chalk';
const confirmAction = async (message) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(chalk.yellow(`${message} \n (yes/no):\n`), (answer) => {
            rl.close();
            if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });
};
export const getConfig = async () => {
    const projectDir = process.cwd();
    // get config
    const configYaml = fs.readFileSync(path.join(projectDir, 'config.yaml'), 'utf8');
    // convert to object
    const configObject = yaml.load(configYaml);
    const config = validateConfig(configObject);
    config.githubRepo = config.githubRepo.replace(/^https:\/\/github.com\//, '').replace(/\.git$/, '');
    const confirmedConfig = await confirmAction('Please confirm the configuration:\n' + JSON.stringify(config, null, 2));
    if (!confirmedConfig) {
        throw new Error('Configuration not confirmed by the user.');
    }
    return config;
};
export const gitActions = {
    promptForGitHubToken: () => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        return new Promise((resolve) => {
            rl.question(chalk.yellow('Please enter your GitHub Personal Access Token: '), (token) => {
                rl.close();
                token = token.trim();
                const tokenRegex = /^ghp_[A-Za-z0-9]{36}$/;
                const tokenRegex2 = /^github_pat_[A-Za-z0-9_]{74}$/;
                if (!tokenRegex.test(token) && !tokenRegex2.test(token)) {
                    console.error(`Invalid GitHub Personal Access Token format. ${tokenRegex}`);
                    process.exit(1);
                }
                resolve(token);
            });
        });
    },
    checkRepoAccess: async (repo) => {
        console.log(chalk.blue(`Checking access to repository: ${repo}`));
        const token = await gitActions.promptForGitHubToken();
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
            headers: {
                Authorization: `token ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch repository data: ${response.statusText}`);
        }
        const data = await response.json();
        const permissions = data.permissions;
        if (permissions.admin || permissions.push) {
            console.log(`You have read/write access to the repository: ${repo}`);
            return token;
        }
        throw new Error(`You do not have write access to the repository: ${repo}`);
    },
    checkAppRepoHasNoBranches: async (config, token) => {
        const response = await fetch(`https://api.github.com/repos/${config.githubRepo}/branches`, {
            headers: {
                Authorization: `token ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch repository branches: ${response.statusText}`);
        }
        const branches = await response.json();
        if (branches.length > 0) {
            throw new Error(`Repository ${config.githubRepo} already has branches please use a new repository`);
        }
    },
    createGitHubRepo: async (repoPath, token) => {
        const autRepoUrl = `https://${token}@github.com/${repoPath}.git`;
        // Initialize git repository from the .application directory
        try {
            await execa('git', ['init'], { stdio: 'inherit' });
            console.log(chalk.green('Initialized git repository'));
            await execa('git', ['add', 'README.md'], { stdio: 'inherit' });
            console.log(chalk.green('Added README.md to git repository'));
            await execa('git', ['commit', '-m', 'first commit from bootstrap'], {
                stdio: 'inherit',
            });
            await execa('git', ['branch', '-M', 'main'], { stdio: 'inherit' });
            console.log(chalk.green('Renamed default branch to main'));
            await execa('git', ['remote', 'add', 'origin', autRepoUrl], {
                stdio: 'inherit',
            });
            console.log(chalk.green('Added remote repository'));
            await execa('git', ['push', '-u', 'origin', 'main'], {
                stdio: 'inherit',
            });
            console.log(chalk.green('Pushed to remote repository'));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Failed to create GitHub repository: ${error.message}`);
            }
            else {
                console.error(`Failed to create GitHub repository: ${String(error)}`);
            }
        }
    },
    pushDirectoryToGithub: async (repoPath, token) => {
        // push to github using the token for authentication
        const autRepoUrl = `https://${token}@github.com/${repoPath}.git`;
        await execa('git', ['add', '.'], { stdio: 'inherit' });
        await execa('git', ['commit', '-m', 'initial commit of files'], { stdio: 'inherit' });
        await execa('git', ['push', autRepoUrl, 'main'], { stdio: 'inherit' });
        // set repository url in config
        await execa('git', ['config', 'remote.origin.url', `https://github.com/${repoPath}.git`], { stdio: 'inherit' });
        await execa('git', ['pull', '--set-upstream', 'origin', 'main'], { stdio: 'inherit' });
        console.log(chalk.green('Pushed directory to remote repository'));
    },
};
export const awsActions = {
    getTags: (config) => {
        const awsTags = [
            {
                Key: 'App_Name', // required
                Value: config.appName, // required
            },
            {
                // Tag
                Key: 'Repo', // required
                Value: config.githubRepo, // required
            },
            {
                Key: 'Generator', // required
                Value: 'App_Bootstrap', // required
            },
        ];
        return awsTags;
    },
    checkProfileAccess: async (config) => {
        process.env.AWS_PROFILE = config.awsProfile;
        const client = new STSClient({ region: config.awsRegion });
        const command = new GetCallerIdentityCommand({});
        console.log(chalk.blue(`Checking AWS profile: ${config.awsProfile} access`));
        const callerIdentity = await client.send(command);
        const baseArn = callerIdentity.Arn?.replace(/:assumed-role\/([^/]+)\/.*/, ':role/$1');
        if (!baseArn) {
            throw new Error('Could not find baseArn');
        }
        const actionNames = [
            'amplify:CreateApp',
            'amplify:DeleteApp',
            'amplify:ListApps',
            'amplify:StartDeployment',
            'amplify:StopDeployment',
            'iam:CreateRole',
            'iam:AttachRolePolicy',
        ];
        console.log(chalk.blue(`Checking Arn permissions for: ${baseArn}:`));
        console.log(chalk.blue(actionNames.map((action) => ` - ${action}`).join('\n')));
        const iamClient = new IAMClient({ region: config.awsRegion });
        const command2 = new SimulatePrincipalPolicyCommand({
            PolicySourceArn: baseArn,
            ActionNames: actionNames,
        });
        const res = await iamClient.send(command2);
        const notAllowed = res.EvaluationResults?.some((o) => o.EvalDecision !== 'allowed');
        if (notAllowed) {
            throw new Error('Insufficient permissions for role: ' + baseArn);
        }
    },
    checkAndCreateRole: async (config) => {
        process.env.AWS_PROFILE = config.awsProfile;
        const client = new IAMClient({ region: config.awsRegion });
        const policyArn = 'arn:aws:iam::aws:policy/AdministratorAccess-Amplify';
        let roleArn;
        try {
            const command = new GetRoleCommand({
                RoleName: config.amplifyRole.roleName,
            });
            const res = await client.send(command);
            roleArn = res.Role?.Arn;
            if (!roleArn) {
                throw new Error('Role not found');
            }
            console.log(chalk.green(`Found role: ${roleArn}`));
        }
        catch (e) {
            if (e instanceof Error && e.name === 'NoSuchEntityException') {
                if (!config.amplifyRole.createRole) {
                    throw new Error('Role does not exist and createRole is false');
                }
                const commandProps = {
                    RoleName: config.amplifyRole.roleName,
                    AssumeRolePolicyDocument: JSON.stringify({
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Principal: {
                                    Service: 'amplify.amazonaws.com',
                                },
                                Action: 'sts:AssumeRole',
                            },
                        ],
                    }),
                    Tags: awsActions.getTags(config),
                    Description: `Role for Amplify project ${config.appName} deployments`,
                };
                const confirmedRole = await confirmAction('Please confirm role creation: \n' + JSON.stringify(commandProps, null, 2));
                if (!confirmedRole) {
                    throw new Error('Role rejected by user.');
                }
                console.log(chalk.blue(`Creating role ${config.amplifyRole.roleName} for Amplify with config:\n ${JSON.stringify(commandProps, null, 2)}`));
                const res = await client.send(new CreateRoleCommand(commandProps));
                roleArn = res.Role?.Arn;
                if (!roleArn) {
                    throw new Error('Role not created');
                }
                console.log(chalk.green(`Role created: ${roleArn}`));
            }
            else {
                throw e;
            }
        }
        const command = new ListAttachedRolePoliciesCommand({
            RoleName: config.amplifyRole.roleName,
        });
        const response = await client.send(command);
        const isPolicyAttached = response.AttachedPolicies?.some((policy) => policy.PolicyArn === policyArn);
        if (!isPolicyAttached) {
            const commandProps = {
                RoleName: config.amplifyRole.roleName,
                PolicyArn: policyArn,
            };
            const confirmRoleAttachment = await confirmAction('Please confirm policy attachment to role: \n' + JSON.stringify(commandProps, null, 2));
            if (!confirmRoleAttachment) {
                throw new Error('Policy attachment rejected by user.');
            }
            console.log(chalk.blue(`Attaching policy ${policyArn} to role ${config.amplifyRole.roleName}`));
            await client.send(new AttachRolePolicyCommand(commandProps));
            console.log(chalk.green(`Policy ${policyArn} attached to role ${config.amplifyRole.roleName}`));
        }
        console.log(chalk.green(`Role ${config.amplifyRole.roleName} created successfully`));
        return roleArn;
    },
    createApp: async (config, token, amplifyRoleArn) => {
        process.env.AWS_PROFILE = config.awsProfile;
        const existingAppId = await awsActions.getAmplifyAppId(config);
        if (existingAppId) {
            throw Error(`Amplify project already exists: ${JSON.stringify({
                appName: config.appName,
                appId: existingAppId,
            })}`);
        }
        const client = new AmplifyClient({ region: config.awsRegion });
        const commandProps = {
            name: config.appName,
            iamServiceRoleArn: amplifyRoleArn,
            description: `Bootstrapped application for ${config.appName}`,
            repository: `https://github.com/${config.githubRepo}`,
            platform: Platform.WEB_COMPUTE,
            accessToken: token,
            enableAutoBranchCreation: true,
            autoBranchCreationPatterns: config.autoBranchCreation.patterns,
            autoBranchCreationConfig: {
                framework: 'Next.js - SSR',
                enableAutoBuild: config.autoBranchCreation.enableAutoBuild,
            },
            enableBranchAutoBuild: config.autoBranchCreation.enableAutoBuild,
            tags: Object.fromEntries(awsActions.getTags(config).map((tag) => [tag.Key, tag.Value])),
        };
        await client.send(new CreateAppCommand(commandProps));
        console.log(chalk.green('Amplify project created'));
    },
    getAmplifyAppId: async (config) => {
        process.env.AWS_PROFILE = config.awsProfile;
        const client = new AmplifyClient({ region: config.awsRegion });
        const res = await client.send(new ListAppsCommand({}));
        console.log(res);
        const thisApp = res.apps?.find((app) => app.name === config.appName);
        return thisApp?.appId;
    },
};
