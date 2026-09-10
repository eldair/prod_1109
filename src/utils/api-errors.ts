// utils/api-error.ts

import axios from 'axios';

type ApiErrorResponse = {
    errors?: Array<{
        detail?: string;
        meta?: {
            message?: string;
        };
    }>;
};

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
        const response = error.response.data as ApiErrorResponse;
        const apiError = response.errors?.[0];

        return normalizeErrorMessage(apiError?.meta?.message || apiError?.detail || 'Validation failed.');
    }

    return 'Something went wrong.';
}

function normalizeErrorMessage(message: string): string {
    const normalizedMessage = message.trim();

    if (!normalizedMessage) return 'Validation failed.';

    return `${normalizedMessage.charAt(0).toUpperCase()}${normalizedMessage.slice(1)}`;
}
