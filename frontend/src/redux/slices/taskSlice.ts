import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalTasks: number;
  byStatus: { todo: number; in_progress: number; done: number };
  byPriority: { low: number; medium: number; high: number };
  overdueTasks: number;
}

interface TaskState {
  tasks: Task[];
  totalTasks: number;
  selectedTask: Task | null;
  dashboardStats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  totalTasks: 0,
  selectedTask: null,
  dashboardStats: null,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    fetchTasksStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess(state, action: PayloadAction<{ tasks: Task[]; total: number }>) {
      state.tasks = action.payload.tasks;
      state.totalTasks = action.payload.total;
      state.loading = false;
    },
    fetchTasksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchTaskByIdStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTaskByIdSuccess(state, action: PayloadAction<Task>) {
      state.selectedTask = action.payload;
      state.loading = false;
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    fetchTaskByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createTaskSuccess(state, action: PayloadAction<Task>) {
      const exists = state.tasks.some((t) => t.id === action.payload.id);
      if (!exists) {
        state.tasks.unshift(action.payload);
        state.totalTasks += 1;
      }
    },
    updateTaskSuccess(state, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.selectedTask && state.selectedTask.id === action.payload.id) {
        state.selectedTask = action.payload;
      }
    },
    deleteTaskSuccess(state, action: PayloadAction<string>) {
      const exists = state.tasks.some((t) => t.id === action.payload);
      if (exists) {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        state.totalTasks -= 1;
      }
      if (state.selectedTask && state.selectedTask.id === action.payload) {
        state.selectedTask = null;
      }
    },
    fetchDashboardStatsSuccess(state, action: PayloadAction<DashboardStats>) {
      state.dashboardStats = action.payload;
    },
    wsTaskCreated(state, action: PayloadAction<Task>) {
      const exists = state.tasks.some((t) => t.id === action.payload.id);
      if (!exists) {
        state.tasks.unshift(action.payload);
        state.totalTasks += 1;
      }
    },
    wsTaskUpdated(state, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.selectedTask && state.selectedTask.id === action.payload.id) {
        state.selectedTask = action.payload;
      }
    },
    wsTaskDeleted(state, action: PayloadAction<string>) {
      const exists = state.tasks.some((t) => t.id === action.payload);
      if (exists) {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        state.totalTasks -= 1;
      }
      if (state.selectedTask && state.selectedTask.id === action.payload) {
        state.selectedTask = null;
      }
    },
  },
});

export const {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
  fetchTaskByIdStart,
  fetchTaskByIdSuccess,
  fetchTaskByIdFailure,
  createTaskSuccess,
  updateTaskSuccess,
  deleteTaskSuccess,
  fetchDashboardStatsSuccess,
  wsTaskCreated,
  wsTaskUpdated,
  wsTaskDeleted,
} = taskSlice.actions;

export default taskSlice.reducer;
