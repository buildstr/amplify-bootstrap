export const packageJsonTemplate = (appName) => {
    return {
        name: appName,
        version: '1.0.0',
        type: 'module',
        scripts: {
            'app:bootstrap': 'node ../dist/scripts/bootstrap.js',
            'app:generate': 'node ../dist/scripts/generate.js',
        },
        dependencies: {},
        devDependencies: {
            'create-amplify': '1.0.6',
            'create-next-app': '15.0.0',
        },
    };
};
