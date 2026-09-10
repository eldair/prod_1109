<template>
    <form class="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" @submit.prevent="submitForm">
        <div>
            <label for="entry-duration" class="mb-2 block text-sm font-medium text-slate-700">Duration (minutes)</label>
            <input
                id="entry-duration"
                v-model="form.duration"
                type="number"
                min="1"
                step="1"
                required
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                :aria-invalid="Boolean(errors.duration)"
            />
            <p v-if="errors.duration" class="mt-1 text-sm text-red-600">{{ errors.duration }}</p>
        </div>
        <div>
            <label for="entry-description" class="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <textarea
                id="entry-description"
                v-model="form.description"
                rows="4"
                required
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                :aria-invalid="Boolean(errors.description)"
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
        </div>
        <div>
            <label for="entry-date" class="mb-2 block text-sm font-medium text-slate-700">Date</label>
            <input
                id="entry-date"
                v-model="form.date"
                type="date"
                :max="today"
                required
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                :aria-invalid="Boolean(errors.date)"
            />
            <p v-if="errors.date" class="mt-1 text-sm text-red-600">{{ errors.date }}</p>
        </div>
        <p v-if="submitError" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {{ submitError }}
        </p>
        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <router-link
                to="/"
                class="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
                Cancel
            </router-link>
            <button
                type="submit"
                :disabled="submitting"
                class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {{ submitting ? 'Saving...' : submitLabel }}
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';

import type {TimeEntryInput} from '@/api/productive';

const props = withDefaults(defineProps<{entry?: TimeEntryInput; submitLabel?: string}>(), {
    submitLabel: 'Create Entry',
});
const emit = defineEmits<{submit: [input: TimeEntryInput]}>();
const form = reactive<TimeEntryInput>({
    duration: props.entry?.duration ?? 0,
    description: props.entry?.description ?? '',
    date: props.entry?.date ?? new Date().toISOString().split('T', 1)[0]!,
});
const errors = reactive<Partial<Record<keyof TimeEntryInput, string>>>({});
const submitError = ref('');
const submitting = ref(false);
const today = new Date().toISOString().split('T', 1)[0]!;

function validate() {
    errors.duration =
        form.duration > 0 && Number.isSafeInteger(Number(form.duration)) ? '' : 'Enter a duration in whole minutes.';
    errors.description = form.description.trim() ? '' : 'Enter a description.';
    errors.date = form.date ? (form.date > today ? 'Date cannot be in the future.' : '') : 'Select a date.';
    return !errors.duration && !errors.description && !errors.date;
}

function submitForm() {
    submitError.value = '';
    if (!validate()) return;
    submitting.value = true;
    emit('submit', {...form, description: form.description.trim()});
}

function setSubmitError(message: string) {
    submitError.value = message;
    submitting.value = false;
}

defineExpose({setSubmitError});
</script>
