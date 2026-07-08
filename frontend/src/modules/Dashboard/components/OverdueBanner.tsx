import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface OverdueBannerProps {
  overdueCount: number;
}

export const OverdueBanner: React.FC<OverdueBannerProps> = ({ overdueCount }) => {
  if (overdueCount === 0) return null;

  return (
    <div
      className="flex items-center gap-3.5 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 shadow-md shadow-rose-500/5 select-none animate-pulseGlow"
      id="overdue-banner"
    >
      <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
        <FiAlertTriangle size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold tracking-wide">Critical Tasks Overdue</h4>
        <p className="text-xs text-rose-500/80 font-medium mt-0.5">
          You have {overdueCount} task{overdueCount > 1 ? "s that are" : " that is"} past the due date and not completed yet.
        </p>
      </div>
    </div>
  );
};

export default OverdueBanner;
