const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'CZK'
});
const dateFormatter = new Intl.DateTimeFormat(undefined);
const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric'
});

const toDate = input => (typeof input === 'string' ? new Date(input) : input);

export default {
    toDateString: input => dateFormatter.format(toDate(input)),
    toTimeString: input => timeFormatter.format(toDate(input)),
    toPriceString: num => currencyFormatter.format(num)
};
