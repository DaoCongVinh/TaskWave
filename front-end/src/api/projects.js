import { apiClient } from './client';

export const projectsApi = {
    getProjects: async () => {
        const res = await apiClient('/projects');
        return res?.data || res || [];
    },
    createProject: async (projectData) => {
        const res = await apiClient('/projects', { body: projectData });
        return res?.data || res;
    },
    updateProject: async (id, projectData) => {
        const res = await apiClient(`/projects/${id}`, { method: 'PUT', body: projectData });
        return res?.data || res;
    },
    deleteProject: async (id) => {
        const res = await apiClient(`/projects/${id}`, { method: 'DELETE' });
        return res?.data || res;
    },
    addMember: async (id, username) => {
        const res = await apiClient(`/projects/${id}/members?username=${encodeURIComponent(username)}`, { method: 'POST' });
        return res?.data || res;
    },
};
