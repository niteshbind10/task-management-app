import React from "react";

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high";
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const styles = {
    high: "bg-rose-500/10 border-rose-500/20 text-rose-500",
    medium: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    low: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize select-none ${
        styles[priority] || styles.low
      }`}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;
