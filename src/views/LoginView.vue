<template>
    <form
        class="mx-auto mt-20 w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
        @submit.prevent="submit"
    >
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-slate-900">Productive Time Tracker</h1>

            <p class="mt-2 text-sm text-slate-500">Sign in using your Productive API token and organization ID.</p>
        </div>

        <div class="space-y-5">
            <div>
                <label for="organization-id" class="mb-2 block text-sm font-medium text-slate-700">
                    Organization ID
                </label>

                <input
                    id="organization-id"
                    v-model="organizationId"
                    type="number"
                    inputmode="numeric"
                    class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="12345"
                    @input="onOrganizationIdInput"
                />
            </div>

            <div>
                <label for="token" class="mb-2 block text-sm font-medium text-slate-700"> API Token </label>

                <input
                    id="token"
                    v-model="token"
                    type="password"
                    class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Paste your API token"
                />
            </div>

            <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {{ error }}
            </div>

            <button
                :disabled="loading"
                type="submit"
                class="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import {ref} from 'vue';

import {useAuthStore} from '@/stores/auth';
import {authenticate} from '@/api/auth';

const router = useRouter();
const authStore = useAuthStore();

const token = ref('');
const organizationId = ref('');

const loading = ref(false);
const error = ref('');

// Ensures only numeric characters remain in input
function onOrganizationIdInput(event: Event) {
    const input = event.target as HTMLInputElement;
    organizationId.value = input.value.replaceAll(/\D/g, '');
}

async function submit() {
    error.value = '';

    if (!token.value || !organizationId.value) {
        error.value = 'All fields are required.';
        return;
    }

    if (!/^\d+$/.test(organizationId.value)) {
        error.value = 'Organization ID must contain numbers only.';
        return;
    }

    loading.value = true;

    try {
        // Fetch organization membership matching current organization ID
        const membership = await authenticate(token.value, organizationId.value);

        if (!membership) {
            throw new Error('Organization membership not found or invalid response.');
        }

        const personId = membership.relationships?.person?.data?.id;

        if (!personId) {
            throw new Error('Could not resolve user Person ID from organization membership.');
        }

        authStore.login({
            token: token.value,
            organizationId: organizationId.value,
            personId,
        });

        void router.push('/');
    } catch (error_) {
        error.value = error_ instanceof Error ? error_.message : 'Login failed.';
    } finally {
        loading.value = false;
    }
}
</script>
