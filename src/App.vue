<template>
    <header v-if="authStore.isAuthenticated" class="border-b border-slate-200 bg-white shadow-sm">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
            <RouterLink to="/" class="text-xl font-bold text-slate-900 transition hover:text-blue-600">
                Productive
            </RouterLink>
            <button
                type="button"
                class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
                @click="logout"
            >
                Log out
            </button>
        </div>
    </header>

    <main class="min-h-screen bg-slate-50 p-4 sm:p-8">
        <RouterView />
    </main>
</template>

<script setup lang="ts">
import {RouterLink, RouterView, useRouter} from 'vue-router';

import {useAuthStore} from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

function logout() {
    authStore.logout();
    void router.push({name: 'login'});
}
</script>
