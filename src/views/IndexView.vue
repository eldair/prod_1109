<template>
    <div class="mx-auto max-w-4xl space-y-6">
        <!-- Top Header & Date Navigation Card -->
        <header
            class="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold text-slate-900">Time Entries</h1>
                <p class="mt-1 text-sm text-slate-500">Manage your daily logged hours and tasks</p>
            </div>

            <date-picker @fetch="fetchTimeEntries" :today="todaysDate" :date="selectedDate"></date-picker>
        </header>

        <!-- Main Content Area -->
        <section>
            <router-link
                :to="{path: '/entries/create', query: {date: selectedDate}}"
                class="mb-4 block w-full rounded-lg border border-blue-600 bg-white px-4 py-2.5 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
                Create New Entry
            </router-link>
            <!-- Loading State -->
            <div
                v-if="loading"
                class="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-slate-500 shadow-sm"
            >
                <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p class="mt-4 text-sm font-medium">Fetching time entries...</p>
            </div>

            <!-- Error State -->
            <div
                v-else-if="error"
                class="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm"
            >
                <p class="font-medium">{{ error }}</p>
                <button
                    type="button"
                    class="mt-3 text-sm font-semibold underline hover:text-red-800"
                    @click="() => fetchTimeEntries()"
                >
                    Try Again
                </button>
            </div>

            <!-- Empty State -->
            <div
                v-else-if="timeEntries.length === 0"
                class="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 shadow-sm"
            >
                <p class="text-base font-medium text-slate-700">No time entries found for this date.</p>
                <p class="mt-1 text-sm text-slate-400">Use the date picker above or log a new entry.</p>
            </div>

            <!-- List View -->
            <div v-else class="space-y-4">
                <article
                    v-for="entry in timeEntries"
                    :key="entry.id || entry.date"
                    class="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 sm:flex-row sm:items-center"
                >
                    <div class="space-y-2">
                        <div class="flex items-center gap-3">
                            <span
                                class="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10"
                            >
                                {{ formatDuration(entry.duration) }}
                            </span>
                            <span class="text-xs text-slate-400">Date: {{ entry.date }}</span>
                        </div>

                        <p class="text-sm font-normal whitespace-pre-line text-slate-800">
                            {{ entry.description || 'No description provided' }}
                        </p>
                    </div>

                    <div
                        class="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4 sm:mt-0 sm:border-0 sm:pt-0"
                    >
                        <button
                            type="button"
                            class="rounded-lg border cursor-pointer border-slate-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:border-red-200"
                            @click="promptDelete(entry)"
                        >
                            Delete
                        </button>
                        <router-link
                            v-if="entry.id"
                            :to="`/entries/${entry.id}/edit`"
                            class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                        >
                            Edit
                        </router-link>
                    </div>
                </article>
            </div>
        </section>

        <!-- Delete Confirmation Modal -->
        <div
            v-if="deletingEntry"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
        >
            <div class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
                <h3 class="text-lg font-bold text-slate-900">Confirm Deletion</h3>
                <p class="mt-2 text-sm text-slate-600">
                    Are you sure you want to delete this time entry? This action cannot be undone.
                </p>

                <div class="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        :disabled="deletingLoading"
                        class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                        @click="deletingEntry = null"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        :disabled="deletingLoading"
                        class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                        @click="confirmDelete"
                    >
                        {{ deletingLoading ? 'Deleting...' : 'Delete' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router';
import {onMounted, watch, ref} from 'vue';

import {deleteTimeEntry, getTimeEntries, type TimeEntry} from '@/api/productive';
import DatePicker from '@/components/DatePicker.vue';
import {useAuthStore} from '@/stores/auth';

// State
const todaysDate = new Date().toISOString().split('T', 1)[0]!;
const route = useRoute();
const router = useRouter();

function getInitialDate(): string {
    const queryDate = route.query.date;
    return typeof queryDate === 'string' && queryDate <= todaysDate ? queryDate : todaysDate;
}

const selectedDate = ref(getInitialDate());
const timeEntries = ref<TimeEntry[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Modal State
const deletingEntry = ref<TimeEntry | null>(null);
const deletingLoading = ref(false);

// Helper to format minutes into HH:MM
function formatDuration(minutes: number | string): string {
    const num = typeof minutes === 'string' ? Number(minutes) : minutes;
    if (isNaN(num)) return '0m';
    const hrs = Math.floor(num / 60);
    const mins = num % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}

const authStore = useAuthStore();

// Fetch Entries
const fetchTimeEntries = async (date?: string, updateUrl = true) => {
    date ||= selectedDate.value;
    selectedDate.value = date;

    if (updateUrl && route.query.date !== date) {
        await router.push({query: {...route.query, date}});
    }

    loading.value = true;
    error.value = null;

    try {
        // Calling getTimeEntries directly from productive.ts
        const entries = await getTimeEntries(date, authStore.personId);
        timeEntries.value = Array.isArray(entries) ? entries : [];
    } catch (error_) {
        error.value = error_ instanceof Error ? error_.message : 'Failed to fetch time entries';
    } finally {
        loading.value = false;
    }
};

// Delete Logic
function promptDelete(entry: TimeEntry) {
    deletingEntry.value = entry;
}

async function confirmDelete() {
    if (!deletingEntry.value) return;

    const entry = deletingEntry.value;
    deletingLoading.value = true;

    try {
        if (!entry.id) throw new Error('Time entry is missing an id.');

        await deleteTimeEntry(entry.id);
        // Remove item locally upon success
        timeEntries.value = timeEntries.value.filter((item) => item.id !== entry.id);
        deletingEntry.value = null;
    } catch (error_) {
        alert(error_ instanceof Error ? error_.message : 'Failed to delete entry.');
    } finally {
        deletingLoading.value = false;
    }
}

onMounted(() => {
    void fetchTimeEntries(undefined, false);
});

watch(
    () => route.query.date,
    (date) => {
        if (typeof date !== 'string' || date > todaysDate || date === selectedDate.value) return;

        selectedDate.value = date;
        void fetchTimeEntries(date, false);
    },
);
</script>
