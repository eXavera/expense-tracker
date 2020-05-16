const Joi = require('@hapi/joi');
const { esnureIsValid } = require('../validation');
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
    newExpense: Joi.object({
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
    }),
    getParams: Joi.object({
        kind: Joi.string()
            .strict(true)
            .required()
            .valid(...expenseKinds.map(k => k.code))
    })
};

module.exports = function(dataAccess) {
    return {
        addExpense: async function(newExpense) {
            esnureIsValid(validationRules.newExpense, newExpense);

            const addedEntity = await dataAccess.add(mapper.vmToEntity(newExpense));

            return mapper.entityToVm(addedEntity);
        },
        get: async function(params) {
            esnureIsValid(validationRules.getParams, params);

            const entitites = await dataAccess.load({
                kindId: mapper.kindCode.toId(params.kind)
            });

            return entitites.map(mapper.entityToVm);
        }
    };
};
