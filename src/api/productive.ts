import {getApiErrorMessage} from '@/utils/api-errors';

import {api} from './client';

const jsonApiHeaders = {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
};

export type TimeEntry = {
    id?: string;
    description: string;
    duration: number;
    date: string;
    serviceId: string;
};
export type TimeEntryInput = Omit<TimeEntry, 'serviceName' | 'id'>;
export type Service = {
    id: string;
    name: string;
};
type SourceTimeEntryAttributes = {
    note: string;
    time: number;
    date: string;
};
type SourceTimeEntry = {
    id: string;
    attributes: SourceTimeEntryAttributes;
    relationships: {
        service: {data: {id: string}};
    };
};
type SourceService = {
    id: string;
    attributes: {
        name: string;
    };
};

export async function getTimeEntries(date: string, personId: string): Promise<TimeEntry[]> {
    try {
        // @note: we should be implementing pagination here but it is out of scope
        const response = await api.get<{data: SourceTimeEntry[]}>('time_entries', {
            params: {'filter[creator_id]': personId, 'filter[date]': date, include: 'service'},
        });

        return response.data.data.map((entry) => toTimeEntry(entry));
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
}

export async function getServices(): Promise<Service[]> {
    try {
        const response = await api.get<{data: SourceService[]}>('services');
        return response.data.data.map((service) => ({id: service.id, name: service.attributes.name}));
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
}

export async function getTimeEntry(entryId: string): Promise<TimeEntry> {
    try {
        const response = await api.get<{data: SourceTimeEntry}>(`time_entries/${entryId}`, {
            params: {include: 'service'},
        });
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
        await api.post('time_entries', toPayload(input, personId), {headers: jsonApiHeaders});
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
}

export async function updateTimeEntry(entryId: string, input: TimeEntryInput, personId: string): Promise<void> {
    try {
        await api.patch(`time_entries/${entryId}`, toPayload(input, personId), {headers: jsonApiHeaders});
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
        serviceId: entry.relationships.service.data.id,
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
                person_id: personId,
                service_id: input.serviceId,
            },
        },
    };
}
