import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Task } from "@/redux/slices/taskSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { FiX } from "react-icons/fi";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  task?: Task | null;
  loading?: boolean;
}

const schema = yup.object().shape({
  title: yup.string().required("Title is required").min(2, "Title must be at least 2 characters").max(200),
  description: yup.string().optional().max(2000),
  priority: yup.string().oneOf(["low", "medium", "high"]).required(),
  status: yup.string().oneOf(["todo", "in_progress", "done"]).required(),
  dueDate: yup.string().optional().nullable(),
});

export const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSubmit, task, loading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (task) {
      const formattedDate = task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : "";
      reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: task.status,
        dueDate: formattedDate,
      });
    } else {
      reset({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        dueDate: "",
      });
    }
  }, [task, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm select-none animate-fadeIn">
      <Card className="w-full max-w-lg border border-border shadow-2xl bg-card relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Close Modal"
        >
          <FiX size={18} />
        </button>

        <CardHeader>
          <CardTitle className="text-lg font-bold">
            {task ? "Edit Task details" : "Create new Task"}
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 max-h-[65vh] overflow-y-auto">
            <div className="space-y-1.5">
              <Label htmlFor="task-title">Title</Label>
              <Input
                type="text"
                id="task-title"
                placeholder="Enter task title"
                disabled={loading}
                {...register("title")}
              />
              {errors.title?.message && (
                <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-description">Description</Label>
              <textarea
                id="task-description"
                placeholder="Enter task description"
                disabled={loading}
                rows={3}
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200 resize-none text-foreground"
                {...register("description")}
              />
              {errors.description?.message && (
                <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="task-priority">Priority</Label>
                <select
                  id="task-priority"
                  disabled={loading}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
                  {...register("priority")}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="task-status">Status</Label>
                <select
                  id="task-status"
                  disabled={loading}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
                  {...register("status")}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Completed</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-duedate">Due Date</Label>
              <Input
                type="date"
                id="task-duedate"
                disabled={loading}
                className="text-foreground"
                {...register("dueDate")}
              />
              {errors.dueDate?.message && (
                <p className="text-xs text-rose-500 mt-1">{errors.dueDate.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default TaskForm;
