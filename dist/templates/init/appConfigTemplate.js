export const appConfigTemplate = (appName) => {
    return `appName: ${appName}
awsProfile: < Use the AWS SSO Login config with a named profile >
awsRegion: us-east-1
amplifyRole:
  roleName: amplify-deployment-role
  createRole: true
backend:
  useDynamoTable: false
githubRepo: 
route53:
  domainName: ${appName}.com
autoBranchCreation:
  patterns:
    - main
    - dev
  enableAutoBuild: true`;
};
// githubRepo: dsover/test-amplify-2
