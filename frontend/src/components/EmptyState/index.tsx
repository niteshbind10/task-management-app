import React from "react";
import { FiInbox } from "react-icons/fi";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No tasks found",
  description = "Get started by creating your first task.",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 py-16 border border-dashed rounded-xl bg-card border-border select-none">
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
        <FiInbox size={24} />
      </div>
      <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
