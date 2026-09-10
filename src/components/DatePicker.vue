<template>
    <div class="flex items-center gap-1">
        <!-- Previous Day Button -->
        <button
            type="button"
            class="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100 active:bg-slate-100 cursor-pointer"
            title="Previous day"
            @click="shiftDate(-1)"
        >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <!-- Clickable Visible Date Badge / Button -->
        <div class="relative inline-flex items-center">
            <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
                @click="openDatePicker"
            >
                <svg class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                <span>{{ formattedDisplayDate }}</span>
            </button>

            <!-- Invisible input anchored to the button with :max restriction -->
            <input
                ref="dateInputRef"
                v-model="selectedDate"
                type="date"
                :max="today"
                class="pointer-events-none absolute inset-0 h-full w-full opacity-0"
                @change="fetchTimeEntries"
            />
        </div>

        <!-- Next Day Button (Disabled if Today) -->
        <button
            type="button"
            :disabled="isToday"
            class="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100 active:bg-slate-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-300 cursor-pointer"
            title="Next day"
            @click="shiftDate(1)"
        >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
import {useTemplateRef, computed, ref} from 'vue';

// @note could implement validation to check for proper format
const props = defineProps<{today: string; date: string}>();

const selectedDate = ref<string>(props.date);
const dateInputRef = useTemplateRef<HTMLInputElement>('dateInputRef');

const isToday = computed(() => selectedDate.value >= props.today);

// Reformats date for display in human form
const formattedDisplayDate = computed(() => {
    if (!selectedDate.value) return '';
    const date = new Date(`${selectedDate.value}T00:00`);
    return date.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'});
});

// Shift date by +1 or -1 day
function shiftDate(days: number) {
    const currentDate = new Date(`${selectedDate.value}T00:00`);
    currentDate.setDate(currentDate.getDate() + days);

    // Extract local year, month, and day to avoid UTC offset shifts
    // @note could have used luxon/date but for avoiding additional libraries it is done like this. Temporal API will
    // fix this
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(currentDate.getDate()).padStart(2, '0');

    const formattedStr = `${y}-${m}-${d}`;

    // Prevent shifting past today
    if (formattedStr > props.today) return;

    selectedDate.value = formattedStr;
    fetchTimeEntries();
}

function openDatePicker() {
    dateInputRef.value?.showPicker();
}

const emit = defineEmits<{
    fetch: [date: string];
}>();

function fetchTimeEntries() {
    emit('fetch', selectedDate.value);
}
</script>
