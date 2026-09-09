import {getApiErrorMessage} from '@/utils/api-errors';

import {api} from './client';

export type TimeEntry = {
    description: string;
    duration: number;
    date: string;
};
type SourceTimeEntryAttributes = {
    note: string;
    time: number;
    date: string;
};
type SourceTimeEntry = {
    attributes: SourceTimeEntryAttributes;
};

export async function getTimeEntries(date: string, personId: string): Promise<TimeEntry[]> {
    try {
        const response = await api.get<{data: SourceTimeEntry[]}>('time_entries', {
            params: {'filter[creator_id]': personId, 'filter[date]': date},
        });

        console.log(response);

        return response.data.data.map((item) => ({
            description: item.attributes.note,
            duration: item.attributes.time,
            date: item.attributes.date,
        }));
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
}

export async function createTimeEntry() {}

export async function updateTimeEntry() {}

export async function deleteTimeEntry(entryId: string) {}
