const ExpensesDAO = function(knex) {
    const add = async function(newExpense) {
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

    const load = async function({ kindId }) {
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
        add,
        load
    };
};

module.exports = ExpensesDAO;
