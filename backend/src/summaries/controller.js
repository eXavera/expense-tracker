const Router = require('express').Router;
const { validate, Joi } = require('express-validation');
const log = require('../log');
const expenseKinds = require('../expense-kinds');
const periods = require('./periods');

const validationRules = {
    params: Joi.object({
        period: Joi.string()
            .strict(true)
            .required()
            .valid(...periods.map(k => k.code))
    })
};

function hanleErrors(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(function(error) {
            next(error);
        });
    };
}

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

function SummariesCtrl(summariesRepo) {
    const router = Router();

    router.get(
        '/summary/:period',
        validate(validationRules, { keyByField: true }),
        hanleErrors(async (req, resp) => {
            const summaries = await Promise.all(
                expenseKinds.map(async kind => {
                    const res = await summariesRepo.getAsync({
                        kindId: kind.id,
                        period: req.params.period
                    });

                    return {
                        kind: kind.code,
                        summary: res
                    };
                })
            );

            const result = merge(summaries);

            log.info(`returning summary with ${result.length} items`);

            resp.send(result);
        })
    );

    return router;
}

module.exports = SummariesCtrl;
