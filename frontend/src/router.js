import Vue from 'vue';
import VueRouter from 'vue-router';

import AddPage from './components/add/AddPage';
import ListPage from './components/list/ListPage';
import NotFoundPage from './components/NotFoundPage';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Add',
        component: AddPage
    },
    {
        path: '/list',
        name: 'List',
        component: ListPage
    },
    {
        path: '*',
        component: NotFoundPage
    }
];

const router = new VueRouter({
    mode: 'history',
    routes,
    linkActiveClass: '',
    linkExactActiveClass: 'is-active'
});

export default router;
