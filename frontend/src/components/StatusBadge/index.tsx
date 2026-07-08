import React from "react";

interface StatusBadgeProps {
  status: "todo" | "in_progress" | "done";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    todo: {
      bg: "bg-slate-500/10 dark:bg-slate-400/5",
      text: "text-slate-500 dark:text-slate-400",
      border: "border-slate-300 dark:border-slate-800",
      label: "To Do",
    },
    in_progress: {
      bg: "bg-blue-500/10 dark:bg-blue-500/5",
      text: "text-blue-500 dark:text-blue-400",
      border: "border-blue-500/20",
      label: "In Progress",
    },
    done: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/5",
      text: "text-emerald-500 dark:text-emerald-400",
      border: "border-emerald-500/20",
      label: "Completed",
    },
  };

  const current = styles[status] || styles.todo;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border select-none ${current.bg} ${current.text} ${current.border}`}
    >
      {status === "in_progress" && (
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></span>
      )}
      {current.label}
    </span>
  );
};

export default StatusBadge;
