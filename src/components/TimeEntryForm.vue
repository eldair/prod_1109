<template>
    <form class="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" @submit.prevent="submitForm">
        <div>
            <label for="entry-duration" class="mb-2 block text-sm font-medium text-slate-700">Duration (minutes)</label>
            <input
                id="entry-duration"
                v-model="form.duration"
                type="number"
                min="1"
                max="1440"
                step="1"
                required
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                :aria-invalid="Boolean(errors.duration)"
            />
            <p v-if="errors.duration" class="mt-1 text-sm text-red-600">{{ errors.duration }}</p>
        </div>
        <div v-if="showServiceSelect">
            <label for="entry-service" class="mb-2 block text-sm font-medium text-slate-700">Service</label>
            <select
                id="entry-service"
                v-model="form.serviceId"
                required
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                :aria-invalid="Boolean(errors.serviceId)"
            >
                <option value="" disabled>Select a service</option>
                <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
            </select>
            <p v-if="errors.serviceId" class="mt-1 text-sm text-red-600">{{ errors.serviceId }}</p>
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
            <button
                type="button"
                class="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
                @click="router.back()"
            >
                Cancel
            </button>
            <button
                type="submit"
                :disabled="submitting"
                class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
                {{ submitting ? 'Saving...' : submitLabel }}
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import {reactive, ref} from 'vue';

import type {TimeEntryInput, Service} from '@/api/productive';

const props = withDefaults(
    defineProps<{
        entry?: TimeEntryInput;
        services?: Service[];
        showServiceSelect?: boolean;
        submitLabel?: string;
    }>(),
    {services: () => [], showServiceSelect: true, submitLabel: 'Create Entry'},
);
const router = useRouter();
const emit = defineEmits<{submit: [input: TimeEntryInput]}>();
const form = reactive<TimeEntryInput>({
    duration: props.entry?.duration ?? 0,
    description: props.entry?.description ?? '',
    date: props.entry?.date ?? new Date().toISOString().split('T', 1)[0]!,
    serviceId: props.entry?.serviceId ?? '',
});
const errors = reactive<Partial<Record<keyof TimeEntryInput, string>>>({});
const submitError = ref('');
const submitting = ref(false);
const today = new Date().toISOString().split('T', 1)[0]!;
const {showServiceSelect} = props;

// @note can user have time entry longer than 24h in single day?
function validate() {
    errors.duration =
        form.duration > 0 && form.duration <= 1440 && Number.isSafeInteger(Number(form.duration))
            ? ''
            : 'Enter a duration between 1 and 1,440 minutes.';
    errors.description = form.description.trim() ? '' : 'Enter a description.';
    errors.date = form.date ? (form.date > today ? 'Date cannot be in the future.' : '') : 'Select a date.';
    errors.serviceId = showServiceSelect && !form.serviceId ? 'Select a service.' : '';
    return !errors.duration && !errors.description && !errors.date && !errors.serviceId;
}

function submitForm() {
    submitError.value = '';
    if (!validate()) return;
    submitting.value = true;
    emit('submit', {
        ...form,
        description: form.description.trim(),
    });
}

function setSubmitError(message: string) {
    submitError.value = message;
    submitting.value = false;
}

defineExpose({setSubmitError});
</script>
