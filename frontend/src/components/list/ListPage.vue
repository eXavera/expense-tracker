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
import KindSelector from '../common/KindSelector';
import expensesService from '../../services/expensesService';

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
    methods: {
        selectKind: function(kindCode) {
            this.selectedKindCode = kindCode;

            this.reload();
        },
        reload: async function() {
            this.expenses = await expensesService.getByKind(this.selectedKindCode);
        }
    }
};
</script>
