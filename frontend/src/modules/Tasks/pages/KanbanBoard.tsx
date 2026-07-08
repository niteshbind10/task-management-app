import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
  updateTaskSuccess,
  createTaskSuccess,
} from "@/redux/slices/taskSlice";
import { taskService } from "@/services/task.service";
import { toast } from "react-toastify";
import Layout from "@/components/Layout";
import { getErrorMessage } from "@/utils/helpers";
import { DndContext, useSensor, useSensors, PointerSensor, DragEndEvent } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import PriorityBadge from "@/components/PriorityBadge";
import { FiCalendar, FiPlus, FiAlertCircle } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TaskForm from "../components/TaskForm";

const DraggableCard = ({ task, onClick }: { task: any; onClick: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 50 : 1,
    }
    : undefined;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing touch-none select-none"
    >
      <Card
        onClick={onClick}
        className="hover:border-slate-300 dark:hover:border-slate-800 transition-all duration-200 bg-card border shadow-sm"
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-start gap-2">
            <h5 className="text-xs font-bold text-foreground line-clamp-2 select-none pointer-events-none">
              {task.title}
            </h5>
            <PriorityBadge priority={task.priority} />
          </div>
          {task.description && (
            <p className="text-[11px] text-muted-foreground line-clamp-2 select-none pointer-events-none">
              {task.description}
            </p>
          )}
          <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1.5 border-t border-border select-none pointer-events-none">
            {task.dueDate ? (
              <span className={`flex items-center gap-1 font-semibold ${isOverdue ? "text-rose-500" : ""}`}>
                <FiCalendar size={10} />
                <span>{formatDueDate(task.dueDate)}</span>
              </span>
            ) : (
              <span />
            )}
            {isOverdue && <FiAlertCircle size={10} className="text-rose-500 animate-pulse" />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const KanbanColumn = ({
  id,
  title,
  tasks,
  onCardClick,
}: {
  id: string;
  title: string;
  tasks: any[];
  onCardClick: (t: any) => void;
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col h-[70vh] bg-secondary/20 border rounded-xl overflow-hidden min-w-[280px] flex-1">
      <div className="p-3 bg-secondary/40 border-b flex items-center justify-between font-bold text-xs select-none">
        <span className="text-foreground">{title}</span>
        <span className="bg-secondary px-2 py-0.5 rounded-full text-[10px] text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[200px]"
      >
        {tasks.map((task) => (
          <DraggableCard key={task.id} task={task} onClick={() => onCardClick(task)} />
        ))}
      </div>
    </div>
  );
};

const KanbanBoard: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);

  // Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadTasks = async () => {
    dispatch(fetchTasksStart());
    try {
      const res = await taskService.getTasks();
      dispatch(fetchTasksSuccess(res.data));
    } catch (error) {
      const msg = getErrorMessage(error);
      dispatch(fetchTasksFailure(msg));
      toast.error(msg);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [dispatch]);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Require drag movement of 8px before activation to allow clicks
    },
  });
  const sensors = useSensors(pointerSensor);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const nextStatus = over.id as any;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === nextStatus) return;

    const updatedTask = { ...task, status: nextStatus };
    dispatch(updateTaskSuccess(updatedTask));

    try {
      await taskService.updateTask(taskId, { status: nextStatus });
      toast.success("Task status updated!");
    } catch (error) {
      // Revert on error
      dispatch(updateTaskSuccess(task));
      toast.error("Failed to update status, reverting changes.");
    }
  };

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

  const handleCardClick = (task: any) => {
    setSelectedTask(task);
    setFormOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedTask(null);
    setFormOpen(true);
  };

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <Layout title="Kanban Board">
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between gap-4 select-none">
          <div>
            <h2 className="text-lg font-bold text-foreground">Workflow Board</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Drag and drop cards between statuses to update their states.
            </p>
          </div>
          <Button
            onClick={handleCreateClick}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 shadow-md shadow-blue-500/10"
          >
            <FiPlus className="mr-1.5" />
            <span>Add Task</span>
          </Button>
        </div>

        {loading && tasks.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-muted-foreground">
              Loading Kanban Board...
            </span>
          </div>
        ) : (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-5 overflow-x-auto pb-4">
              <KanbanColumn
                id="todo"
                title="To Do"
                tasks={todoTasks}
                onCardClick={handleCardClick}
              />
              <KanbanColumn
                id="in_progress"
                title="In Progress"
                tasks={inProgressTasks}
                onCardClick={handleCardClick}
              />
              <KanbanColumn
                id="done"
                title="Completed"
                tasks={doneTasks}
                onCardClick={handleCardClick}
              />
            </div>
          </DndContext>
        )}

        <TaskForm
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          task={selectedTask}
          loading={formLoading}
        />
      </div>
    </Layout>
  );
};

export default KanbanBoard;
