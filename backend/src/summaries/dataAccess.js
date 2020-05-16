const periodHandlers = {
    daily: {
        sqlFormat: '%Y-%m-%d',
        parse: function(sqlOutput) {
            const [yearString, monthString, dayString] = sqlOutput.split('-');
            return {
                year: Number(yearString),
                month: Number(monthString),
                day: Number(dayString)
            };
        }
    },
    monthly: {
        sqlFormat: '%Y-%m',
        parse: function(sqlOutput) {
            const [yearString, monthString] = sqlOutput.split('-');
            return {
                year: Number(yearString),
                month: Number(monthString)
            };
        }
    },
    anual: {
        sqlFormat: '%Y',
        parse: function(sqlOutput) {
            return {
                year: Number(sqlOutput)
            };
        }
    }
};

const SummariesDAO = function(knex) {
    const load = async function({ kindId, period }) {
        const periodHandler = periodHandlers[period];
        const groupBy = `strftime('${periodHandler.sqlFormat}', date(time, 'unixepoch'))`;

        const items = await knex('Expense')
            .select(knex.raw(`${groupBy} as period`))
            .sum({ amount: 'amount' })
            .where({
                kindId
            })
            .groupByRaw(groupBy)
            .orderBy('time', 'desc')
            .limit(50);

        return items.map(i => {
            return {
                period: periodHandler.parse(i.period),
                amount: i.amount
            };
        });
    };

    return {
        load
    };
};

module.exports = SummariesDAO;
