export const backend = (props) => {
    return `import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
${props.backend?.useDynamoTable ? "" : "// "}import { data } from "./data/resource";
import { ModifyAuthStack } from "./custom-stack/cdk-stack";
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
    auth,
    ${props.backend?.useDynamoTable ? "" : "// "}data,
});
const userPoolId = backend.auth.resources.userPool.userPoolId
const customNotifications = new ModifyAuthStack(
    backend.createStack("ModifyAuthStack"),
    "ModifyAuthStack",
    { 
      userPoolId: userPoolId
    }
); 
backend.addOutput({
  custom:{
    userPoolClientId: customNotifications.userPoolClient.attrClientId,
    token: customNotifications.userPoolClient.attrClientSecret
  }
})`;
};
export default backend;
