module.exports = {
    apps: [
        {
            name: 'evolution-service',
            script: 'dist/main.js',
            interpreter: 'node',
            env: {
                GAME_START_CP_KEY: 1,
                APP_ENV: 'staging'
            }
        },
        {
            name: 'pp-service',
            script: 'dist/main.js',
            interpreter: 'node',
            env: {
                GAME_START_CP_KEY: 7,
                APP_ENV: 'staging'
            }
        },
        {
            name: 'bng-service',
            script: 'dist/main.js',
            interpreter: 'node',
            env: {
                GAME_START_CP_KEY: 9,
                APP_ENV: 'staging'
            }
        }
    ]
};
