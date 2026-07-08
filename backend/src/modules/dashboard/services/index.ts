import Task from "@/models/task.model";
import mongoose from "mongoose";

export const getStats = async (userId: string) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const now = new Date();

  const stats = await Task.aggregate([
    { $match: { userId: userObjectId } },
    {
      $facet: {
        total: [{ $count: "count" }],
        byStatus: [
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ],
        byPriority: [
          { $group: { _id: "$priority", count: { $sum: 1 } } }
        ],
        overdue: [
          {
            $match: {
              status: { $ne: "done" },
              dueDate: { $lt: now }
            }
          },
          { $count: "count" }
        ]
      }
    }
  ]);

  const result = stats[0];

  const totalTasks = result.total[0]?.count || 0;
  
  const byStatus = { todo: 0, in_progress: 0, done: 0 };
  result.byStatus.forEach((item: any) => {
    const statusKey = item._id as keyof typeof byStatus;
    if (statusKey in byStatus) {
      byStatus[statusKey] = item.count;
    }
  });

  const byPriority = { low: 0, medium: 0, high: 0 };
  result.byPriority.forEach((item: any) => {
    const priorityKey = item._id as keyof typeof byPriority;
    if (priorityKey in byPriority) {
      byPriority[priorityKey] = item.count;
    }
  });

  const overdueTasks = result.overdue[0]?.count || 0;

  return {
    totalTasks,
    byStatus,
    byPriority,
    overdueTasks
  };
};
