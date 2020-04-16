function ExpensesRepo(dbManager) {
    async function useDb(fn) {
        const db = dbManager.open();
        try {
            return await fn(db);
        } finally {
            await db.closeAsync();
        }
    }

    async function addAsync(newExpense) {
        return useDb(async db => {
            const result = await db.execAsync('INSERT INTO Expense (amount, time, kindId) VALUES (?, ?, ?)', [
                newExpense.amount,
                Math.floor(newExpense.time.getTime() / 1000),
                newExpense.kindId
            ]);

            return {
                ...newExpense,
                id: result.lastID
            };
        });
    }

    async function getAsync({ kindId }) {
        return useDb(async db => {
            const items = await db.selectAsync(
                'SELECT id, amount, kindId, time FROM Expense WHERE kindId=? ORDER BY time DESC LIMIT 50',
                [kindId]
            );

            items.forEach(i => {
                i.time = new Date(i.time * 1000);
            });

            return items;
        });
    }

    return {
        addAsync,
        getAsync
    };
}

module.exports = ExpensesRepo;
