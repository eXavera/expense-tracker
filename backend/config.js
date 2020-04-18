const dotenv = require('dotenv');
var dotenvExpand = require('dotenv-expand');

dotenvExpand(dotenv.config());

const env = process.env;

module.exports = {
    staticFilesDir: env.STATIC_FILES_DIR,
    port: Number(env.PORT),
    sessionSecert: env.SESSION_SECRET,
    dbFileName: env.DB_FILE_NAME,
    debugDb: env.DB_DEBUG === '1',
    googleAuth: {
        clientID: env.GOOGLE_AUTH_CLIENT_ID,
        clientSecret: env.GOOGLE_AUTH_CLIENT_SECRET,
        scope: env.GOOGLE_AUTH_CLIENT_SCOPE,
        userId: env.GOOGLE_AUTH_CLIENT_USER_ID,
        callback: env.GOOGLE_AUTH_CLIENT_CALLBACK
    },
    logging: {
        minLevel: env.LOG_MIN_LEVEL,
        directory: env.LOG_MIN_DIR,
        maxFiles: env.LOG_MIN_MAX_FILES ? Number(env.LOG_MIN_MAX_FILES) : undefined
    }
};
