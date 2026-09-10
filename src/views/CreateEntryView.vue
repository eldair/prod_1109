<template>
    <div class="min-h-screen bg-slate-50 p-4 sm:p-8">
        <div class="mx-auto max-w-2xl space-y-6">
            <header>
                <h1 class="text-2xl font-bold text-slate-900">Create Time Entry</h1>
                <p class="mt-1 text-sm text-slate-500">Log the time you spent on a task.</p>
            </header>
            <time-entry-form ref="formRef" @submit="createEntry" />
        </div>
    </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import {ref} from 'vue';

import {type TimeEntryInput, createTimeEntry} from '@/api/productive';
import TimeEntryForm from '@/components/TimeEntryForm.vue';
import {useAuthStore} from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const formRef = ref<InstanceType<typeof TimeEntryForm>>();

async function createEntry(input: TimeEntryInput) {
    try {
        await createTimeEntry(input, authStore.personId);
        await router.push({path: '/', query: {date: input.date}});
    } catch (error) {
        formRef.value?.setSubmitError(error instanceof Error ? error.message : 'Failed to create time entry.');
    }
}
</script>
