<template>
    <section id="app" class="section">
        <div class="container">
            <ErrorBox :content="errorMessage" @dismiss="dismissError"></ErrorBox>
            <div class="tabs">
                <ul>
                    <router-link :to="{ name: 'Add' }" tag="li"><a>Add</a></router-link>
                    <router-link :to="{ name: 'List' }" tag="li"><a>List</a></router-link>
                </ul>
            </div>
            <router-view :messageBox="messageBox"></router-view>
        </div>
    </section>
</template>

<script>
import ErrorBox from './components/ErrorBox';

export default {
    name: 'App',
    components: {
        ErrorBox
    },
    data: function() {
        return {
            messageBox: null,
            errorMessage: ''
        };
    },
    methods: {
        displayError: function(msg) {
            this.errorMessage = msg;
        },
        dismissError: function() {
            this.errorMessage = '';
        }
    },
    created: function() {
        this.messageBox = {
            displayError: this.displayError.bind(this),
            clear: this.dismissError.bind(this)
        };
    }
};
</script>
