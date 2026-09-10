<template>
    <div class="min-h-screen bg-slate-50 p-4 sm:p-8">
        <div class="mx-auto max-w-2xl space-y-6">
            <header>
                <h1 class="text-2xl font-bold text-slate-900">Edit Time Entry</h1>
                <p class="mt-1 text-sm text-slate-500">Update the details for this time entry.</p>
            </header>
            <div
                v-if="loading"
                class="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm"
            >
                Loading entry...
            </div>
            <p
                v-else-if="loadError"
                class="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm"
            >
                {{ loadError }}
            </p>
            <time-entry-form
                v-else-if="entry"
                ref="formRef"
                :entry="entry"
                submit-label="Save Changes"
                @submit="saveEntry"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router';
import {onMounted, ref} from 'vue';

import {type TimeEntryInput, updateTimeEntry, type TimeEntry, getTimeEntry} from '@/api/productive';
import TimeEntryForm from '@/components/TimeEntryForm.vue';
import {useAuthStore} from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const formRef = ref<InstanceType<typeof TimeEntryForm>>();
const entry = ref<TimeEntry>();
const loading = ref(true);
const loadError = ref('');

async function loadEntry() {
    try {
        entry.value = await getTimeEntry(String(route.params.id));
    } catch (error) {
        loadError.value = error instanceof Error ? error.message : 'Failed to load time entry.';
    } finally {
        loading.value = false;
    }
}

async function saveEntry(input: TimeEntryInput) {
    try {
        await updateTimeEntry(String(route.params.id), input, authStore.personId);
        await router.push('/');
    } catch (error) {
        formRef.value?.setSubmitError(error instanceof Error ? error.message : 'Failed to update time entry.');
    }
}

onMounted(() => void loadEntry());
</script>
