const log = require('./log');

module.exports = function(middleaware) {
    return function(req, res, next) {
        middleaware(req, res, next).catch(function(error) {
            if (error.validationError) {
                log.error('valiadation erorr: ' + JSON.stringify(error.validationError));
                res.status(400);
                res.send(error.validationError);
            } else {
                next(error);
            }
        });
    };
};
