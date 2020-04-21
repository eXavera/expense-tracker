const Router = require('express').Router;
const { validate, Joi } = require('express-validation');
const log = require('../log');
const expenseKinds = require('../expense-kinds');

const mapper = (function() {
    const idToCodeMap = {};
    expenseKinds.forEach(kind => {
        idToCodeMap[kind.id] = kind.code;
    });

    const kindCode = {
        toId: code => expenseKinds.find(k => k.code === code).id
    };

    const vmToEntity = viewModel => {
        return {
            amount: viewModel.amount,
            kindId: kindCode.toId(viewModel.kind),
            time: new Date(viewModel.time)
        };
    };

    const entityToVm = entity => {
        return {
            id: entity.id,
            amount: entity.amount,
            kind: idToCodeMap[entity.kindId],
            time: entity.time
        };
    };

    return {
        vmToEntity,
        entityToVm,
        kindCode
    };
})();

const validationRules = {
    add: {
        body: Joi.object({
            amount: Joi.number()
                .strict(true)
                .required()
                .integer()
                .greater(0)
                .less(99999),
            kind: Joi.string()
                .strict(true)
                .required()
                .valid(...expenseKinds.map(k => k.code)),
            time: Joi.string()
                .required()
                .isoDate()
        })
    },
    get: {
        params: Joi.object({
            kind: Joi.string()
                .strict(true)
                .required()
                .valid(...expenseKinds.map(k => k.code))
        })
    }
};

function hanleErrors(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(function(error) {
            next(error);
        });
    };
}

function ExpenseCtrl(expensesRepo) {
    const router = Router();

    router.post(
        '/expense',
        validate(validationRules.add, { keyByField: true }),
        hanleErrors(async (req, resp) => {
            const addedEntity = await expensesRepo.addAsync(mapper.vmToEntity(req.body));
            log.info('added expense with ID=' + addedEntity.id);

            resp.status(201);
            resp.send(mapper.entityToVm(addedEntity));
        })
    );

    router.get(
        '/expense/:kind',
        validate(validationRules.get, { keyByField: true }),
        hanleErrors(async (req, resp) => {
            const entitites = await expensesRepo.getAsync({
                kindId: mapper.kindCode.toId(req.params.kind)
            });
            log.info(`returning ${entitites.length} expense records`);

            resp.send(entitites.map(mapper.entityToVm));
        })
    );

    return router;
}

module.exports = ExpenseCtrl;
