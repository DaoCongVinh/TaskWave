import { apiClient } from './client';

export const auth = {
    login: (username, password) =>
        apiClient('/auth/login', {
            body: { username, password },
        }),

    register: (username, email, password) =>
        apiClient('/auth/register', {
            body: { username, email, password },
        }),
};
