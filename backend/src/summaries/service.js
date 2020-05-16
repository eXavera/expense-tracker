const Joi = require('@hapi/joi');
const { esnureIsValid } = require('../validation');
const expenseKinds = require('../expense-kinds');
const periods = require('./periods');

function comparePeriods(p1, p2) {
    let result = p1.year - p2.year;
    if (result === 0 && Number.isInteger(p1.month)) {
        result = p1.month - p2.month;
        if (result === 0 && Number.isInteger(p1.day)) {
            result = p1.day - p2.day;
        }
    }

    return result;
}

function findNewestPeriod(summaries) {
    const candidates = summaries.map(s => s.summary[0]).filter(s => !!s);
    let newestPeriod = undefined;
    candidates.forEach(candidate => {
        if (!newestPeriod || comparePeriods(newestPeriod, candidate.period) < 0) {
            newestPeriod = candidate.period;
        }
    });

    return newestPeriod;
}

function popNewestSummaryIfMatchingPeriod(kindSummary, periodToMatch) {
    const newestSummary = kindSummary[0];
    if (newestSummary && comparePeriods(newestSummary.period, periodToMatch) === 0) {
        return kindSummary.shift();
    }

    return undefined;
}

function merge(summaries) {
    const mergedSummary = [];
    let newestPeriod;

    while ((newestPeriod = findNewestPeriod(summaries))) {
        const periodSummary = {
            period: newestPeriod
        };

        summaries.forEach(sr => {
            const macthingSummary = popNewestSummaryIfMatchingPeriod(sr.summary, newestPeriod);
            periodSummary[sr.kind] = macthingSummary ? macthingSummary.amount : 0;
        });

        mergedSummary.push(periodSummary);
    }

    return mergedSummary;
}

const validationRules = {
    getParams: Joi.object({
        period: Joi.string()
            .strict(true)
            .required()
            .valid(...periods.map(k => k.code))
    })
};

module.exports = function(dataAccess) {
    return {
        get: async function(params) {
            esnureIsValid(validationRules.getParams, params);

            const summaries = await Promise.all(
                expenseKinds.map(async kind => {
                    const res = await dataAccess.load({
                        kindId: kind.id,
                        period: params.period
                    });

                    return {
                        kind: kind.code,
                        summary: res
                    };
                })
            );

            return merge(summaries);
        }
    };
};
