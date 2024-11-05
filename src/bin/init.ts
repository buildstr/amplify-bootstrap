#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { packageJsonTemplate } from '../templates/init/packageTemplate.js';
import { appConfigTemplate } from '../templates/init/appConfigTemplate.js';
export function initProject(appName: string) {
    const projectDir = path.resolve(process.cwd(), appName);

    // Create package.json
    const packageJson = packageJsonTemplate(appName);
    fs.mkdirSync(projectDir, { recursive: true });
    fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(packageJson, null, 2));

    // Create config.yaml
    const configYaml = appConfigTemplate(appName);

    fs.writeFileSync(path.join(projectDir, 'config.yaml'), configYaml.trim());

    console.log(chalk.green('Project initialized successfully.'));
    console.log(chalk.yellow('Please review and update config.yaml as needed.'));
}
initProject(process.argv[2]);
