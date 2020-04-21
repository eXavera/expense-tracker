import restApi from './restApi';
import notification from './notificationService';
import format from './format';

export default {
    create: async function({ amount, kindCode }) {
        notification.error.clear();

        try {
            await restApi.expense.post({
                amount,
                kindCode,
                time: new Date()
            });

            return true;
        } catch (err) {
            notification.error.display(err);
        }

        return false;
    },
    getByKind: async function(kindCode) {
        notification.error.clear();

        try {
            const resp = await restApi.expense.get(kindCode);
            return resp.map(i => ({
                date: format.toDateString(i.time),
                time: format.toTimeString(i.time),
                amount: format.toPriceString(i.amount)
            }));
        } catch (err) {
            notification.error.display(err);
        }

        return [];
    }
};
