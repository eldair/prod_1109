/* eslint-disable unicorn/no-this-outside-of-class */
import {useRouter} from 'vue-router';
import {defineStore} from 'pinia';

export interface AuthState {
    organizationId: string;
    personId: string;
    token: string;
}

const STORAGE_KEY = 'productive-auth';

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: '',
        organizationId: '',
        personId: '',
    }),

    getters: {
        isAuthenticated: (state) => !!state.token && !!state.organizationId && !!state.personId,
    },

    actions: {
        restore() {
            const stored = localStorage.getItem(STORAGE_KEY);

            if (!stored) return;

            try {
                const data = JSON.parse(stored);

                this.token = data.token ?? '';
                this.organizationId = data.organizationId ?? '';
                this.personId = data.personId ?? '';
            } catch {
                this.logout();
            }
        },

        login(payload: AuthState) {
            this.token = payload.token;
            this.organizationId = payload.organizationId;
            this.personId = payload.personId;

            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        },

        logout() {
            this.token = '';
            this.organizationId = '';
            this.personId = '';

            localStorage.removeItem(STORAGE_KEY);

            const router = useRouter();

            if (router.currentRoute.value.path !== '/login') {
                void router.push('/login');
            }
        },
    },
});
