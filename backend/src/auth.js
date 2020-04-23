const ensureLogin = require('connect-ensure-login');
const cookieSession = require('cookie-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const log = require('./log');
const config = require('../config');

function setupGoogleAuth(callbackPath) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: config.googleAuth.clientID,
                clientSecret: config.googleAuth.clientSecret,
                callbackURL: `http://${config.googleAuth.callback}${callbackPath}`,
                scope: config.googleAuth.scope
            },
            function verifyUser(_accessToken, _refreshToken, profile, cb) {
                if (profile.id === config.googleAuth.userId) {
                    log.info(`authenticated google user ${profile.displayName}`);
                    return cb(null, { id: profile.id, name: profile.displayName });
                } else {
                    log.error(`refused unknown google user ${profile.displayName}`);
                    return cb('Unknown user');
                }
            }
        )
    );
    passport.serializeUser((user, cb) => cb(null, user));
    passport.deserializeUser((obj, cb) => cb(null, obj));
}

function setup(app, { authPathPrefix, apiPathPrefix, loginFailureRedirect, loginSuccessRedirect, isAnonymousReq }) {
    function skipAuth(req) {
        return isAnonymousReq(req) || req.path.startsWith(authPathPrefix) || req.path === loginFailureRedirect;
    }

    function isApiReq({ path }) {
        return path.startsWith(apiPathPrefix);
    }

    const loginPath = authPathPrefix + '/login';
    const callbackPath = authPathPrefix + '/google/callback';

    setupGoogleAuth(callbackPath);

    app.use(
        cookieSession({
            secret: config.sessionSecert,
            name: 'appSession',
            signed: true,
            httpOnly: true
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(function verifyRequest(req, resp, next) {
        if (skipAuth(req)) {
            next();
        } else {
            log.trace('auth required');

            if (isApiReq(req) && !req.isAuthenticated()) {
                //log.error('unauthorized API request');
                resp.status(401).send('Unathorized');
                return;
            }

            ensureLogin.ensureLoggedIn({ redirectTo: loginPath })(req, resp, next);
        }
    });

    app.get(loginPath, passport.authenticate('google'));
    app.get(authPathPrefix + '/google', passport.authenticate('google', { scope: ['main'] }));
    app.get(
        callbackPath,
        passport.authenticate('google', {
            successRedirect: loginSuccessRedirect,
            failureRedirect: loginFailureRedirect
        })
    );
}

module.exports = {
    setup
};
