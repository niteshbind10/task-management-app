import React from "react";
import Label from "@/components/ui/label";

interface TaskFiltersProps {
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  priorityFilter: string;
  setPriorityFilter: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  sortOrder: string;
  setSortOrder: (val: string) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <div className="p-4 bg-card border rounded-xl flex flex-wrap gap-4 items-end shadow-sm select-none">
      <div className="flex-1 min-w-[140px] space-y-1.5">
        <Label htmlFor="filter-status">Status</Label>
        <select
          id="filter-status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Completed</option>
        </select>
      </div>

      <div className="flex-1 min-w-[140px] space-y-1.5">
        <Label htmlFor="filter-priority">Priority</Label>
        <select
          id="filter-priority"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex-1 min-w-[140px] space-y-1.5">
        <Label htmlFor="sort-field">Sort By</Label>
        <select
          id="sort-field"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
        >
          <option value="createdAt">Creation Date</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>

      <div className="flex-1 min-w-[140px] space-y-1.5">
        <Label htmlFor="sort-order">Order</Label>
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
