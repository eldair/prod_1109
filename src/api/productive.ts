import {getApiErrorMessage} from '@/utils/api-errors';

import {api} from './client';

export type TimeEntry = {
    id?: string;
    description: string;
    duration: number;
    date: string;
};
export type TimeEntryInput = Omit<TimeEntry, 'id'>;
type SourceTimeEntryAttributes = {
    note: string;
    time: number;
    date: string;
};
type SourceTimeEntry = {
    id: string;
    attributes: SourceTimeEntryAttributes;
};

export async function getTimeEntries(date: string, personId: string): Promise<TimeEntry[]> {
    try {
        const response = await api.get<{data: SourceTimeEntry[]}>('time_entries', {
            params: {'filter[creator_id]': personId, 'filter[date]': date},
        });

        return response.data.data.map((entry) => toTimeEntry(entry));
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
}

export async function getTimeEntry(entryId: string): Promise<TimeEntry> {
    try {
        const response = await api.get<{data: SourceTimeEntry}>(`time_entries/${entryId}`);
        // @note: we could validate concrete response and if data.data is missing and show different error according to
        // that
        const entry = response.data.data;
        return toTimeEntry(entry);
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
}

export async function createTimeEntry(input: TimeEntryInput, personId: string): Promise<void> {
    try {
        await api.post('time_entries', toPayload(input, personId));
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
}

export async function updateTimeEntry(entryId: string, input: TimeEntryInput, personId: string): Promise<void> {
    try {
        await api.patch(`time_entries/${entryId}`, toPayload(input, personId));
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
}

export async function deleteTimeEntry(entryId: string) {
    try {
        await api.delete(`time_entries/${entryId}`);
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
}

function toTimeEntry(entry: SourceTimeEntry): TimeEntry {
    return {
        id: entry.id,
        description: entry.attributes.note,
        duration: entry.attributes.time,
        date: entry.attributes.date,
    };
}

function toPayload(input: TimeEntryInput, personId: string) {
    return {
        data: {
            type: 'time_entries',
            attributes: {
                date: input.date,
                time: input.duration,
                note: input.description,
            },
            relationships: {
                person: {
                    data: {
                        type: 'people',
                        id: personId,
                    },
                },
            },
        },
    };
}
