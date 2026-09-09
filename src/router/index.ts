import {createWebHistory, createRouter} from 'vue-router';

import {useAuthStore} from '@/stores/auth.ts';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'entries',
            component: () => import('../views/IndexView.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
        },
        {
            path: '/entries/new',
            name: 'newEntry',
            component: () => import('../views/TimeEntryView.vue'),
        },
        {
            path: '/entries/:id/edit',
            name: 'editEntry',
            component: () => import('../views/TimeEntryView.vue'),
            props: true,
        },
    ],
});

// eslint-disable-next-line unicorn/no-top-level-side-effects
router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (!authStore.isAuthenticated && to.name !== 'login') {
        return {name: 'login'};
    }

    if (authStore.isAuthenticated && to.name === 'login') {
        return {name: 'entries'};
    }
});

export default router;
