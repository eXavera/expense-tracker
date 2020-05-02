<template>
    <div class="buttons">
        <button
            type="button"
            class="button"
            :key="period.id"
            v-for="period in periods"
            :class="{ 'is-primary': period.isSelected }"
            @click.prevent="selectPeriod(period, $event)"
        >
            {{ period.title }}
        </button>
    </div>
</template>

<script>
import periods from '../../../../backend/src/summaries/periods';

export default {
    data: function() {
        return {
            periods: periods.map(period => {
                return { ...period, isSelected: false };
            })
        };
    },
    methods: {
        selectPeriod: function(selectedPeriod) {
            this.periods.forEach(period => {
                period.isSelected = period === selectedPeriod;
            });

            this.$emit('selected', selectedPeriod.code);
        }
    },
    created: function() {
        this.selectPeriod(this.periods[1]);
    }
};
</script>
