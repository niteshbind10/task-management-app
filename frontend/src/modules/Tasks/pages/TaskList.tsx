import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
  createTaskSuccess,
  updateTaskSuccess,
  deleteTaskSuccess,
} from "@/redux/slices/taskSlice";
import { taskService } from "@/services/task.service";
import { toast } from "react-toastify";
import Layout from "@/components/Layout";
import TaskCard from "../components/TaskCard";
import TaskFilters from "../components/TaskFilters";
import TaskForm from "../components/TaskForm";
import DeleteConfirm from "../components/DeleteConfirm";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { getErrorMessage } from "@/utils/helpers";

const TaskList: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadTasks = async () => {
    dispatch(fetchTasksStart());
    try {
      const res = await taskService.getTasks({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        sortBy,
        order: sortOrder,
      });
      dispatch(fetchTasksSuccess(res.data));
    } catch (error) {
      const msg = getErrorMessage(error);
      dispatch(fetchTasksFailure(msg));
      toast.error(msg);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [dispatch, statusFilter, priorityFilter, sortBy, sortOrder]);

  const handleFormSubmit = async (formData: any) => {
    setFormLoading(true);
    try {
      if (selectedTask) {
        const res = await taskService.updateTask(selectedTask.id, formData);
        dispatch(updateTaskSuccess(res.data));
        toast.success("Task updated successfully!");
      } else {
        const res = await taskService.createTask(formData);
        dispatch(createTaskSuccess(res.data));
        toast.success("Task created successfully!");
      }
      setFormOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    setFormLoading(true);
    try {
      await taskService.deleteTask(taskToDelete);
      dispatch(deleteTaskSuccess(taskToDelete));
      toast.success("Task deleted successfully!");
      setDeleteOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setFormLoading(false);
      setTaskToDelete(null);
    }
  };

  const handleEditClick = (task: any) => {
    setSelectedTask(task);
    setFormOpen(true);
  };

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedTask(null);
    setFormOpen(true);
  };

  return (
    <Layout title="Task Management">
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between gap-4 select-none">
          <div>
            <h2 className="text-lg font-bold text-foreground">My Tasks</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Create, update, filter, and prioritize your daily items.
            </p>
          </div>
          <Button
            onClick={handleCreateClick}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 shadow-md shadow-blue-500/10"
            id="create-task-btn"
          >
            <FiPlus className="mr-1.5" />
            <span>Add Task</span>
          </Button>
        </div>

        <TaskFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-muted-foreground select-none">
              Loading tasks list...
            </span>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks matching filters"
            description="Try loosening your filter settings or create a new task to get started."
            actionLabel="Create a Task"
            onAction={handleCreateClick}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}

        <TaskForm
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          task={selectedTask}
          loading={formLoading}
        />

        <DeleteConfirm
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
          loading={formLoading}
        />
      </div>
    </Layout>
  );
};

export default TaskList;
