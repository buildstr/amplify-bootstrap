import { nextAuth } from "./application/src/app/api/auth/[...nextauth]/route.js";
import { cognito } from "./application/src/app/api/auth/cognito/route.js";
import { fetchTestRoute } from "./application/src/app/api/fetch-test/[id]/route.js";
import { footer } from "./application/src/app/components/footer.js";
import { header } from "./application/src/app/components/header.js";
import { logo } from "./application/src/app/components/logo.js";
import { fetchCard } from "./application/src/app/components/fetch-card.js";
import { userCard } from "./application/src/app/components/user-card.js";
import { amplifyYml } from "./application/amplify-yml.js";
import { authOptions } from "./application/src/app/lib/auth-options.js";
import { backend } from "./application/amplify/backend.js";
import { cdkStack } from "./application/amplify/custom-stack/cdk-stack.js";
import { env } from "./application/env.js";
import { homePage } from "./application/src/app/home-page.js";
import { login } from "./application/src/app/login/page.js";
import { middleware } from "./application/src/middleware.js";
import { types } from "./application/src/app/lib/types.js";
import { layout } from "./application/src/app/layout.js";
import { providers } from "./application/src/app/providers.js";
import { eslintrcJson } from "./application/eslintrc.json.js";
import { tailwindConfig } from "./application/tailwind.config.js";

export {
    amplifyYml,
    authOptions,
    backend,
    cdkStack,
    cognito,
    fetchTestRoute,
    env,
    eslintrcJson,
    fetchCard,
    footer,
    header,
    homePage,
    layout,
    login,
    logo,
    middleware,
    nextAuth,
    providers,
    tailwindConfig,
    types,
    userCard,
};