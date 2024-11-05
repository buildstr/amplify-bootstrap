#!/usr/bin/env node
import fs from 'fs';
import { Config } from '../types';
import { getConfig, gitActions, awsActions } from './utils.js';
import chalk from 'chalk';

async function bootstrap() {
    try {
        const config: Config = await getConfig();
        await awsActions.getAmplifyAppId(config);
        if (!fs.existsSync('./application')) {
            throw new Error('Next.js application not found. Please run `npm run app:generate` script first.');
        }
        await awsActions.checkProfileAccess(config);
        const githubToken = await gitActions.checkRepoAccess(config.githubRepo);
        await gitActions.checkAppRepoHasNoBranches(config, githubToken);
        console.log(chalk.green('AWS and GitHub access verified.'));

        process.chdir('./application');
        await gitActions.createGitHubRepo(config.githubRepo, githubToken);
        const amplifyRoleArn: string = await awsActions.checkAndCreateRole(config);
        await awsActions.createApp(config, githubToken, amplifyRoleArn);
        await gitActions.pushDirectoryToGithub(config.githubRepo, githubToken);
        console.log(chalk.green('Bootstrap complete.'));
    } catch (error) {
        console.error(chalk.red(error));
    }
}

bootstrap();
