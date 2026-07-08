import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

interface TasksByStatusProps {
  todo: number;
  inProgress: number;
  done: number;
  total: number;
}

export const TasksByStatus: React.FC<TasksByStatusProps> = ({ todo, inProgress, done, total }) => {
  const getPercentage = (value: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const statusItems = [
    {
      label: "To Do",
      count: todo,
      percentage: getPercentage(todo),
      color: "bg-slate-400 dark:bg-slate-600",
      textColor: "text-slate-500 dark:text-slate-400",
    },
    {
      label: "In Progress",
      count: inProgress,
      percentage: getPercentage(inProgress),
      color: "bg-blue-500",
      textColor: "text-blue-500",
    },
    {
      label: "Completed",
      count: done,
      percentage: getPercentage(done),
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
    },
  ];

  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle className="text-base font-bold">Task Status Distribution</CardTitle>
        <CardDescription>Visual breakdown of tasks by progress status.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {statusItems.map((item, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold select-none">
              <span className="text-muted-foreground">{item.label}</span>
              <span className={item.textColor}>
                {item.count} ({item.percentage}%)
              </span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TasksByStatus;
