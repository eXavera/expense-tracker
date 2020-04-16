import Vue from 'vue';
import VueRouter from 'vue-router';

import AddExpense from './components/AddExpense';
import ListExpenses from './components/ListExpenses';
import NotFound from './components/NotFound';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Add',
        component: AddExpense
    },
    {
        path: '/list',
        name: 'List',
        component: ListExpenses
    },
    {
        path: '*',
        component: NotFound
    }
];

const router = new VueRouter({
    mode: 'history',
    routes,
    linkActiveClass: '',
    linkExactActiveClass: 'is-active'
});

export default router;
