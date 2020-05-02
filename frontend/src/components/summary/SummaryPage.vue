<template>
    <div>
        <PeriodSelector @selected="selectPeriod"></PeriodSelector>
        <table class="table is-striped">
            <thead>
                <th>Date</th>
                <th v-for="kind in expenseKinds" :key="kind.id">{{ kind.title }}</th>
            </thead>
            <tbody>
                <tr v-for="itm in summary" :key="itm.period">
                    <td>{{ itm.period }}</td>
                    <td v-for="kind in expenseKinds" :key="kind.id">{{ itm[kind.code] }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import expenseKinds from '../../../../backend/src/expense-kinds';
import PeriodSelector from './PeriodSelector';
import summaryService from '../../services/summaryService';

export default {
    components: {
        PeriodSelector
    },
    data: function() {
        return {
            expenseKinds,
            selectedPeriodCode: '',
            summary: []
        };
    },
    methods: {
        selectPeriod: function(periodCode) {
            this.selectedPeriodCode = periodCode;

            this.reload();
        },
        reload: async function() {
            this.summary = await summaryService.getByPeriod(this.selectedPeriodCode);
        }
    }
};
</script>
