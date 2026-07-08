import api from "./api";

export const taskService = {
  createTask: async (data: { title: string; description?: string; priority?: string; status?: string; dueDate?: string }) => {
    const response = await api.post("/tasks", data);
    return response.data;
  },

  getTasks: async (params?: { status?: string; priority?: string; sortBy?: string; order?: string; limit?: number; skip?: number }) => {
    const response = await api.get("/tasks", { params });
    return response.data;
  },

  getTaskById: async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  updateTask: async (taskId: string, data: { title?: string; description?: string; priority?: string; status?: string; dueDate?: string | null }) => {
    const response = await api.put(`/tasks/${taskId}`, data);
    return response.data;
  },

  deleteTask: async (taskId: string) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get("/dashboard");
    return response.data;
  },
};
export default taskService;
