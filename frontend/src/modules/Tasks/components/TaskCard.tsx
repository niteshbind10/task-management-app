import React from "react";
import { Task } from "@/redux/slices/taskSlice";
import { Card, CardContent } from "@/components/ui/card";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";
import { FiCalendar, FiEdit2, FiTrash2, FiAlertCircle } from "react-icons/fi";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="hover:border-slate-300 dark:hover:border-slate-800 transition-all duration-300">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-foreground truncate select-none">
              {task.title}
            </h4>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 select-none">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-blue-500 transition-colors"
              title="Edit Task"
            >
              <FiEdit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-rose-500 transition-colors"
              title="Delete Task"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 select-none">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border select-none">
          <div className="flex items-center gap-1.5">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            {isOverdue ? (
              <span className="flex items-center gap-1 text-rose-500">
                <FiAlertCircle size={12} className="animate-pulse" />
                <span>Overdue ({formatDueDate(task.dueDate)})</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <FiCalendar size={12} />
                <span>{formatDueDate(task.dueDate)}</span>
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
