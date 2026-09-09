import './assets/base.css';

import {createPinia} from 'pinia';
import {createApp} from 'vue';

import {useAuthStore} from './stores/auth.ts';
import router from './router';
import App from './App.vue';

const app = createApp(App);

app.use(createPinia());
app.use(router);

const authStore = useAuthStore();

authStore.restore();

app.mount('#app');
