export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface TaskAttributes {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskCreationAttributes {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  status?: TaskStatus;
}

export interface TaskUpdateAttributes {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
}
