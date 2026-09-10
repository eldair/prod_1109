<template>
    <div class="min-h-screen bg-slate-50 p-4 sm:p-8">
        <div class="mx-auto max-w-2xl space-y-6">
            <header>
                <h1 class="text-2xl font-bold text-slate-900">Create Time Entry</h1>
                <p class="mt-1 text-sm text-slate-500">Log the time you spent on a task.</p>
            </header>
            <div
                v-if="loading"
                class="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm"
            >
                Loading services...
            </div>
            <p
                v-else-if="loadError"
                class="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm"
            >
                {{ loadError }}
            </p>
            <time-entry-form
                v-else
                ref="formRef"
                :entry="{date: initialDate, duration: 0, description: '', serviceId: ''}"
                :services="services"
                @submit="createEntry"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import {useTemplateRef, onMounted, ref} from 'vue';
import {useRouter, useRoute} from 'vue-router';

import {type TimeEntryInput, createTimeEntry, type Service, getServices} from '@/api/productive';
import TimeEntryForm from '@/components/TimeEntryForm.vue';
import {useAuthStore} from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const formRef = useTemplateRef('formRef');
const today = new Date().toISOString().split('T', 1)[0]!;
const services = ref<Service[]>([]);
const loading = ref(true);
const loadError = ref('');
const initialDate = typeof route.query.date === 'string' && route.query.date <= today ? route.query.date : today;

async function loadServices() {
    try {
        services.value = await getServices();
    } catch (error) {
        loadError.value = error instanceof Error ? error.message : 'Failed to load services.';
    } finally {
        loading.value = false;
    }
}

async function createEntry(input: TimeEntryInput) {
    try {
        await createTimeEntry(input, authStore.personId);
        await router.push({path: '/', query: {date: input.date}});
    } catch (error) {
        formRef.value?.setSubmitError(error instanceof Error ? error.message : 'Failed to create time entry.');
    }
}

onMounted(() => void loadServices());
</script>
