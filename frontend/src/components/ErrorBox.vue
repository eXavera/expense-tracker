<template>
    <div class="notification is-danger" :class="{ 'is-hidden': isHidden }">
        <button class="delete" @click="$emit('dismiss')"></button>
        {{ content }}
    </div>
</template>

<script>
export default {
    props: {
        content: String
    },
    computed: {
        isHidden: function() {
            return !this.content;
        }
    }
};
</script>
