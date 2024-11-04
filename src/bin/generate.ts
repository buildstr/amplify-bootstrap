#!/usr/bin/env node
import { execa } from "execa";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from 'url';

import * as t from "../templates/index.js";
import { Config } from "../types.js";
import { getConfig } from "./utils.js";
async function generateApp() {
    const config: Config = await getConfig();
    const projectDir = process.cwd();

    try {
        // Initialize Next.js app if not already present
        if (!fs.existsSync("./application")) {
            console.log(chalk.blue("Setting up Next.js application..."));
            const appDir = path.join(projectDir, "application");
            const scriptFileDir = path.dirname(fileURLToPath(import.meta.url));
            
            try {
                await execa(
                    "npx",
                    [
                        "create-next-app@14.2.16",
                        "application",
                        "--typescript",
                        "--app",
                        "--use-npm",
                        "--src-dir",
                        "--eslint",
                        "--no-experimental-app",
                        "--no-git",
                        "--no-install",
                        "--no-turbo",
                        "--import-alias",
                        "@/*",
                        "--tailwind",
                    ],
                    { stdio: "inherit" }
                );
                // change to the application directory
                process.chdir(appDir);

                console.log(chalk.blue("installing dependencies..."));
                await execa("npm", [
                    "install",
                    "next-auth@4.24.8",
                    "@aws-sdk/client-cognito-identity-provider@3.679.0",
                    "@nextui-org/react@2.4.8",
                    "framer-motion@11.11.11",
                ]);

                console.log(chalk.blue("setting up amplify in application..."));
                await execa("npm", ["create", "amplify@1.0.6", "--yes"], {
                    stdio: "inherit",
                });

                console.log(chalk.blue("Adding custom files..."));

                const appFiles = [
                    {
                        name: "amplify.yml",
                        content: t.amplifyYml(config),
                    },
                    {
                        name: "src/app/lib/auth-options.ts",
                        content: t.authOptions(config),
                    },
                    {
                        name: "amplify/backend.ts",
                        content: t.backend(config),
                    },
                    {
                        name: "amplify/custom-stack/cdk-stack.ts",
                        content: t.cdkStack(config),
                    },
                    {
                        name: "src/app/api/auth/cognito/route.ts",
                        content: t.cognito(config),
                    },
                    {
                        name: "src/app/api/fetch-test/[id]/route.ts",
                        content: t.fetchTestRoute(config),
                    },
                    {
                        name: ".env",
                        content: t.env(config),
                    },
                    {
                        name: "src/app/components/footer.tsx",
                        content: t.footer(config),
                    },
                    {
                        name: "src/app/components/header.tsx",
                        content: t.header(config),
                    },
                    {
                        name: "src/app/page.tsx",
                        content: t.homePage(config),
                    },
                    {
                        name: "src/app/layout.tsx",
                        content: t.layout(config),
                    },
                    {
                        name: "src/app/login/page.tsx",
                        content: t.login(config),
                    },
                    {
                        name: "src/app/components/logo.tsx",
                        content: t.logo(config),
                    },
                    {
                        name: "src/middleware.ts",
                        content: t.middleware(config),
                    },
                    {
                        name: "src/app/api/auth/[...nextauth]/route.ts",
                        content: t.nextAuth(config),
                    },
                    {
                        name: "src/app/providers.tsx",
                        content: t.providers(config),
                    },
                    {
                        name: "tailwind.config.ts",
                        content: t.tailwindConfig(config),
                    },
                    {
                        name: ".eslintrc.json",
                        content: t.eslintrcJson(config),
                    },
                    {
                        name: "src/app/lib/types.ts",
                        content: t.types(config),
                    },
                    {
                        name: "src/app/components/fetch-card.tsx",
                        content: t.fetchCard(config),
                    },
                    {
                        name: "src/app/components/user-card.tsx",
                        content: t.userCard(config),
                    },
                    {
                        name: "public/image/default-avatar.png",
                        content: path.join(scriptFileDir, "../templates/application/public/images/default-avatar.png"),
                        type: 'file'
                    }
                ];
                for (const file of appFiles) {
                    console.log(chalk.grey("--> --> Adding file:", file.name));
                    fs.mkdirSync(path.join(appDir, path.dirname(file.name)), {
                        recursive: true,
                    });

                    if (file.type === 'file') {
                        fs.copyFileSync(
                            file.content,
                            path.join(appDir, file.name)
                        );
                        continue;
                    }
                    fs.writeFileSync(
                        path.join(appDir, file.name),
                        file.content
                    );
                }
                process.chdir(projectDir);
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log(
                chalk.yellow(
                    "Next.js application dir already exists. to re-generate, delete the application directory and run the App Generation script again."
                )
            );
        }

        console.log(chalk.green("App Generation completed successfully."));
    } catch (error: any) {
        console.error(chalk.red("App Generation failed:", error.message));
        process.exit(1);
    }
}

generateApp();
