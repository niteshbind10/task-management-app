import { TaskRepository } from "../repositories";
import { TaskAttributes, TaskCreationAttributes, TaskUpdateAttributes } from "@/interfaces/task.types";
import { AppError } from "@/middlewares/error.middleware";

export const createTask = async (userId: string, data: TaskCreationAttributes): Promise<TaskAttributes> => {
  const task = await TaskRepository.create({
    userId,
    title: data.title,
    description: data.description,
    priority: data.priority,
    status: data.status || "todo",
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
  });
  return task.toObject() as TaskAttributes;
};

export const getAllTasks = async (
  userId: string,
  filters: { status?: string; priority?: string; sortBy?: string; order?: string; limit?: number; skip?: number } = {}
): Promise<{ tasks: TaskAttributes[]; total: number }> => {
  const queryFilter: any = { userId };
  
  if (filters.status) {
    queryFilter.status = filters.status;
  }
  
  if (filters.priority) {
    queryFilter.priority = filters.priority;
  }

  const sortField = filters.sortBy || "createdAt";
  const sortOrder = filters.order === "asc" ? 1 : -1;
  const sortOption: any = { [sortField]: sortOrder };

  const total = await TaskRepository.count(queryFilter);
  const tasks = await TaskRepository.findAll(queryFilter, {
    sort: sortOption,
    limit: filters.limit,
    skip: filters.skip,
  });

  return {
    tasks: tasks.map((t) => t.toObject() as TaskAttributes),
    total,
  };
};

export const getTaskById = async (userId: string, taskId: string): Promise<TaskAttributes> => {
  const task = await TaskRepository.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (task.userId.toString() !== userId) {
    throw new AppError("Unauthorized access to task", 403);
  }

  return task.toObject() as TaskAttributes;
};

export const updateTask = async (userId: string, taskId: string, data: TaskUpdateAttributes): Promise<TaskAttributes> => {
  const task = await TaskRepository.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (task.userId.toString() !== userId) {
    throw new AppError("Unauthorized access to task", 403);
  }

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;

  const updatedTask = await TaskRepository.updateById(taskId, updateData);
  if (!updatedTask) {
    throw new AppError("Task update failed", 500);
  }

  return updatedTask.toObject() as TaskAttributes;
};

export const deleteTask = async (userId: string, taskId: string): Promise<void> => {
  const task = await TaskRepository.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (task.userId.toString() !== userId) {
    throw new AppError("Unauthorized access to task", 403);
  }

  await TaskRepository.deleteById(taskId);
};
