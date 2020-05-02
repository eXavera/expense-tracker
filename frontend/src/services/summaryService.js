import restApi from './restApi';
import notification from './notificationService';
import format from './format';

const periodFormatters = {
    daily: function(period) {
        return format.toDateString(new Date(period.year, period.month - 1, period.day));
    },
    monthly: function(period) {
        return format.toYearMonthString(new Date(period.year, period.month - 1, 1));
    },
    anual: function(period) {
        return period.year;
    }
};

const formatSummary = function(periodCode, { period, ...amounts }) {
    Object.keys(amounts).forEach(kind => (amounts[kind] = format.toPriceString(amounts[kind])));

    return {
        period: periodFormatters[periodCode](period),
        ...amounts
    };
};

export default {
    getByPeriod: async function(periodCode) {
        notification.error.clear();

        try {
            const summaries = await restApi.summary.get(periodCode);

            return summaries.map(s => formatSummary(periodCode, s));
        } catch (err) {
            notification.error.display(err);
        }

        return [];
    }
};
