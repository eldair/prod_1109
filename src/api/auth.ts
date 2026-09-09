import {getApiErrorMessage} from '@/utils/api-errors';

import {api} from './client';

export async function authenticate(token: string, organizationId: string) {
    try {
        const response = await api.get('organization_memberships', {
            headers: {'X-Auth-Token': token},
            params: {'filter[organization_id]': organizationId, include: 'person'},
        });

        return response.data.data[0] ?? null;
    } catch (error) {
        throw new Error(getApiErrorMessage(error));
    }
}
