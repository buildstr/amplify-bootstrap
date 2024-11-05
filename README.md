# Amplify Bootstrap Next.js

This is a tool to start a basic amplify application with a next.js frontend. 
it is using amplify Gen 2 which will include an amplify directory where you can define custom infrastrucutre.

## Getting Started

### Dependencies

- [Node.js](https://nodejs.org/en/download/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [SSO configured with AWS CLI and a named profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html)
- [Github Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with write access to your desired repository
- An Empty git hub repository, it should have the starter page telling you how to add to the repository
- ![alt text](./docs/images/empty-repo.png)


### Commands

- `npm install` - this will install the dependencies
- `npm link` - this will link the package to your global node_modules
- `abstrp-init example-app` - this creates a new project in the current directory, it will include a configuration file that you can edit to change the project name and other settings
- `abstrp-generate` - this will generate stuff, it will initialize a next.js app in the application directory with amplify and various custom files to get you started
- `abstrp-bootstrap` - this will bootstrap the amplify project, pushing your local changes to your github repository and connecting the branch for deployment in AWS Amplify

### Configuration


### Usage
At this point you will be able to go to the amplify console to see your application, find the deployment, and manage users and other settings.

