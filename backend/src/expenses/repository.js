const ExpensesRepo = function(knex) {
    const addAsync = async function(newExpense) {
        const result = await knex('Expense').insert({
            amount: newExpense.amount,
            time: Math.floor(newExpense.time.getTime() / 1000),
            kindId: newExpense.kindId
        });

        return {
            ...newExpense,
            id: result[0]
        };
    };

    const getAsync = async function({ kindId }) {
        const items = await knex('Expense')
            .select('id', 'amount', 'kindId', 'time')
            .where({
                kindId
            })
            .orderBy('time', 'desc')
            .limit(50);

        items.forEach(i => {
            i.time = new Date(i.time * 1000);
        });

        return items;
    };

    return {
        addAsync,
        getAsync
    };
};

module.exports = ExpensesRepo;
