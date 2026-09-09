// utils/api-error.ts

import axios from 'axios';

export function getApiErrorMessage(error: unknown): string {
    if (!axios.isAxiosError(error)) {
        return 'Unexpected error occurred.';
    }

    if (error.response?.status === 401) {
        return 'Wrong credentials.';
    }

    if (error.response?.status === 403) {
        return 'You do not have permission to perform this action.';
    }

    if (error.response?.status === 404) {
        return 'Resource not found.';
    }

    if (error.response?.status === 422) {
        return 'Validation failed.';
    }

    return 'Something went wrong.';
}
