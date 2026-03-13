import { apiClient } from './client';

export const tasksApi = {
    getAllTasks: async () => {
        const res = await apiClient('/tasks/all');
        return res?.data?.content || res?.content || res?.data || res || [];
    },
    getTasksByProject: async (projectId) => {
        const res = await apiClient(`/tasks?projectId=${encodeURIComponent(projectId)}`);
        return res?.data?.content || res?.content || res?.data || res || [];
    },
    getTasks: async () => {
        // Alias for getAllTasks for backward compatibility
        const res = await apiClient('/tasks/all');
        return res?.data?.content || res?.content || res?.data || res || [];
    },
    createTask: async (taskData) => {
        const res = await apiClient('/tasks', { body: taskData });
        return res?.data || res;
    },
    getTaskById: async (id) => {
        const res = await apiClient(`/tasks/${id}`);
        return res?.data || res;
    },
    updateTask: async (id, taskData) => {
        const res = await apiClient(`/tasks/${id}`, { method: 'PUT', body: taskData });
        return res?.data || res;
    },
    deleteTask: async (id) => {
        const res = await apiClient(`/tasks/${id}`, { method: 'DELETE' });
        return res?.data || res;
    },
    searchTasks: async (query) => {
        const res = await apiClient(`/tasks/search?query=${encodeURIComponent(query)}`);
        return res?.data?.content || res?.content || res?.data || res || [];
    },
};
