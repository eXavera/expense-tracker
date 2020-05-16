const errorHandler = require('../errorHandler');

module.exports = function(router, service) {
    router.post(
        '/expense',
        errorHandler(async (req, resp) => {
            const result = await service.addExpense(req.body);

            resp.status(201);
            resp.send(result);
        })
    );

    router.get(
        '/expense/:kind',
        errorHandler(async (req, resp) => {
            const result = await service.get({ kind: req.params.kind });
            resp.send(result);
        })
    );

    return router;
};
