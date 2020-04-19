<template>
    <div class="buttons">
        <button
            type="button"
            class="button"
            :key="kind.id"
            v-for="kind in kinds"
            :class="{ 'is-primary': kind.isSelected }"
            @click.prevent="selectKind(kind, $event)"
        >
            {{ kind.title }}
        </button>
    </div>
</template>

<script>
import expenseKinds from '../../../../backend/src/expense-kinds';

export default {
    data: function() {
        return {
            kinds: expenseKinds.map(kind => {
                return { ...kind, isSelected: false };
            })
        };
    },
    methods: {
        selectKind: function(selectedKind) {
            this.kinds.forEach(kind => {
                kind.isSelected = kind === selectedKind;
            });

            this.$emit('selected', selectedKind.code);
        }
    },
    created: function() {
        this.selectKind(this.kinds[0]);
    }
};
</script>
