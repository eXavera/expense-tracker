const express = require('express');
const html5Fallback = require('express-history-api-fallback');

const config = require('../config');
const auth = require('./auth');
const log = require('./log');

const Expenses = require('./expenses');
const Summaries = require('./summaries');

function setup(app) {
    const apiEndpoint = '/api';

    app.disable('x-powered-by');

    app.use((req, _resp, next) => {
        log.info(`${req.method}: ${req.path}`);
        next();
    });

    auth.setup(app, {
        authPathPrefix: '/auth',
        apiPathPrefix: apiEndpoint,
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

    app.use(apiEndpoint, Expenses());
    app.use(apiEndpoint, Summaries());
    app.use(apiEndpoint, (req, resp) => {
        resp.status(404).send(); // don't use HTML5 history fallback for API
    });
    if (config.staticFilesDir) {
        app.use(html5Fallback('index.html', { root: config.staticFilesDir }));
    }
    app.use(function handleErrors(err, req, res, next) {
        log.error(err);

        if (res.headersSent) {
            return next(err);
        }

        return res.status(500).json(err);
    });
}

module.exports = {
    setup,
    port: config.port
};
