<template>
    <div>
        <form @submit.prevent="submit" ref="form" omSubmit="return false;">
            <div class="field">
                <label class="label">Price</label>
                <div class="control">
                    <input
                        class="input"
                        type="number"
                        required
                        min="1"
                        max="99999"
                        v-model.number="amount"
                        ref="amount"
                    />
                </div>
            </div>
            <div class="field is-grouped-multiline">
                <KindSelector @selected="selectedKind"></KindSelector>
            </div>
            <div class="field">
                <div class="control">
                    <button
                        class="button is-primary is-fullwidth"
                        :class="{ 'is-loading': isSubmitting }"
                        :disabled="isSubmitting"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </form>
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
            amount: '',
            selectedKindCode: '',
            isSubmitting: false
        };
    },
    methods: {
        selectedKind: function(kindCode) {
            this.selectedKindCode = kindCode;
        },
        submit: async function() {
            if (!this.$refs.form.reportValidity()) {
                return;
            }

            this.isSubmitting = true;

            const succeeded = await expensesService.create({
                amount: this.amount,
                kindCode: this.selectedKindCode
            });

            if (succeeded) {
                this.amount = '';
                this.focusAmount();
            }

            this.isSubmitting = false;
        },
        focusAmount: function() {
            this.$refs.amount.focus();
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            this.focusAmount();
        });
    },
    beforeRouteLeave: function(to, from, next) {
        if (this.amount) {
            const wantsLeave = window.confirm('You have unsaved changes. Do you really want to leave?');
            if (wantsLeave) {
                next();
            } else {
                next(false);
            }
        } else {
            next();
        }
    }
};
</script>
