const express = require('express');
const html5Fallback = require('express-history-api-fallback');
const compression = require('compression');
const { ValidationError } = require('express-validation');

const config = require('../config');
const auth = require('./auth');
const log = require('./log');

const expenses = require('./expenses/builder');

function setup(app) {
    app.use((req, _resp, next) => {
        log.trace(`${req.method}: ${req.path}`);
        next();
    });

    app.use(compression());

    auth.setup(app, {
        authPathPrefix: '/auth',
        apiPathPrefix: '/api',
        loginSuccessRedirect: '/',
        loginFailureRedirect: '/sorry.html',
        isAnonymousReq: ({ path }) => {
            return path.endsWith('.ico');
        }
    });
    app.use(express.json());

    if (config.staticFilesDir) {
        log.trace(`serving static files from ${config.staticFilesDir}`);
        app.use('/', express.static(config.staticFilesDir));
    }

    app.use('/api', expenses());
    if (config.staticFilesDir) {
        app.use(html5Fallback('index.html', { root: config.staticFilesDir }));
    }
    app.use(function handleErrors(err, req, res, next) {
        log.error(err);

        if (res.headersSent) {
            return next(err);
        }

        if (err instanceof ValidationError) {
            return res.status(err.statusCode).json(err);
        }

        return res.status(500).json(err);
    });
}

module.exports = {
    setup,
    port: config.port
};
