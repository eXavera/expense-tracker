<template>
    <div>
        <KindSelector @selected="selectKind"></KindSelector>
        <table class="table is-striped">
            <thead>
                <th>Date</th>
                <th>Time</th>
                <th>Amount</th>
            </thead>
            <tbody>
                <tr v-for="exp in expenses" :key="exp.id">
                    <td>{{ exp.date }}</td>
                    <td>{{ exp.time }}</td>
                    <td>{{ exp.amount }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import KindSelector from './KindSelector';

const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'CZK'
});
const dateFormatter = new Intl.DateTimeFormat(undefined);
const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric'
});

function formatDate(dateTimeString) {
    return dateFormatter.format(new Date(dateTimeString));
}

function formatTime(dateTimeString) {
    return timeFormatter.format(new Date(dateTimeString));
}

function formatAmount(amount) {
    return currencyFormatter.format(amount);
}

export default {
    components: {
        KindSelector
    },
    data: function() {
        return {
            selectedKindCode: '',
            expenses: []
        };
    },
    props: ['messageBox'],
    methods: {
        selectKind: function(kindCode) {
            this.selectedKindCode = kindCode;

            this.reload();
        },
        reload: async function() {
            try {
                const resp = await fetch('api/expense/' + this.selectedKindCode);
                if (resp.status === 200) {
                    this.expenses = (await resp.json()).map(i => ({
                        date: formatDate(i.time),
                        time: formatTime(i.time),
                        amount: formatAmount(i.amount)
                    }));
                } else {
                    this.messageBox.displayError(`Server responded with ${resp.status} ${resp.statusText}`);
                }
            } catch (err) {
                this.messageBox.displayError(err);
            }
        }
    }
};
</script>
