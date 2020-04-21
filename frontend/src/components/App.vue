<template>
    <section id="app" class="section">
        <div class="container">
            <ErrorBox :content="errorMessage" @dismiss="clearError"></ErrorBox>
            <div class="tabs">
                <ul>
                    <router-link :to="{ name: 'Add' }" tag="li"><a>Add</a></router-link>
                    <router-link :to="{ name: 'List' }" tag="li"><a>List</a></router-link>
                </ul>
            </div>
            <router-view></router-view>
        </div>
    </section>
</template>

<script>
import ErrorBox from './ErrorBox';
import notificationService from '../services/notificationService';

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
        setError: function(msg) {
            this.errorMessage = msg;
        },
        clearError: function() {
            this.errorMessage = '';
        }
    },
    created: function() {
        notificationService.setView({
            setError: this.setError.bind(this),
            clearError: this.clearError.bind(this)
        });
    }
};
</script>
