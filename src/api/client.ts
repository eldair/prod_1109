import axios, {AxiosError} from 'axios';

import {useAuthStore} from '@/stores/auth';

export const api = axios.create({
    baseURL: 'https://api.productive.io/api/v2',
});

// eslint-disable-next-line unicorn/no-top-level-side-effects
api.interceptors.request.use((config) => {
    const authStore = useAuthStore();

    if (authStore.token && authStore.organizationId) {
        config.headers['X-Auth-Token'] = authStore.token;
        config.headers['X-Organization-Id'] = authStore.organizationId;
    }

    return config;
});

// eslint-disable-next-line unicorn/no-top-level-side-effects
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            const authStore = useAuthStore();
            authStore.logout();
        }

        return Promise.reject(error);
    },
);
