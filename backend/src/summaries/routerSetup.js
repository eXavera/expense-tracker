const errorHandler = require('../errorHandler');

module.exports = function(router, service) {
    router.get(
        '/summary/:period',
        errorHandler(async (req, resp) => {
            const result = await service.get({ period: req.params.period });
            resp.send(result);
        })
    );

    return router;
};
