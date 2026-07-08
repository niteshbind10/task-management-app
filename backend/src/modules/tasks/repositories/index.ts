import Task, { ITaskModel } from "@/models/task.model";
import { makeRepository } from "@/repositories/base.repository";

export const TaskRepository = makeRepository<ITaskModel>(Task);
