import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";
import { fetchDashboardStatsSuccess } from "@/redux/slices/taskSlice";
import { taskService } from "@/services/task.service";
import { toast } from "react-toastify";
import Layout from "@/components/Layout";
import { StatCard } from "../components/StatCard";
import { TasksByStatus } from "../components/TasksByStatus";
import { OverdueBanner } from "../components/OverdueBanner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FiClipboard,
  FiLoader,
  FiCheckSquare,
  FiAlertTriangle,
  FiInbox,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import { getErrorMessage } from "@/utils/helpers";
import PriorityBadge from "@/components/PriorityBadge";
import StatusBadge from "@/components/StatusBadge";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dashboardStats } = useSelector((state: RootState) => state.tasks);
  const [loading, setLoading] = useState(true);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Get dashboard stats
      const statsRes = await taskService.getDashboardStats();
      dispatch(fetchDashboardStatsSuccess(statsRes.data));

      // Get latest 5 tasks
      const tasksRes = await taskService.getTasks({ limit: 5 });
      setRecentTasks(tasksRes.data.tasks);
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const stats = [
    {
      title: "Total Tasks",
      value: dashboardStats?.totalTasks || 0,
      icon: <FiClipboard size={22} className="text-slate-500" />,
      description: "Total tasks in dashboard",
      className: "border-slate-200/60 dark:border-slate-800/80 shadow-md h-32 flex flex-col justify-between",
    },
    {
      title: "To Do",
      value: dashboardStats?.byStatus.todo || 0,
      icon: <FiInbox size={22} className="text-amber-500" />,
      description: "Unstarted tasks",
      className: "border-slate-200/60 dark:border-slate-800/80 shadow-md h-32 flex flex-col justify-between",
    },
    {
      title: "In Progress",
      value: dashboardStats?.byStatus.in_progress || 0,
      icon: <FiLoader size={22} className="text-blue-500 animate-spin" />,
      description: "Active tasks in progress",
      className: "border-slate-200/60 dark:border-slate-800/80 shadow-md h-32 flex flex-col justify-between",
    },
    {
      title: "Completed",
      value: dashboardStats?.byStatus.done || 0,
      icon: <FiCheckSquare size={22} className="text-emerald-500" />,
      description: "Done and completed",
      className: "border-slate-200/60 dark:border-slate-800/80 shadow-md h-32 flex flex-col justify-between",
    },
    {
      title: "Overdue",
      value: dashboardStats?.overdueTasks || 0,
      icon: <FiAlertTriangle size={22} className="text-rose-500 animate-pulse" />,
      description: "Past due date",
      className: `border-slate-200/60 dark:border-slate-800/80 shadow-md h-32 flex flex-col justify-between ${
        (dashboardStats?.overdueTasks || 0) > 0 ? "border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/10 text-rose-500" : ""
      }`,
    },
  ];

  return (
    <Layout title="Dashboard Overview">
      <div className="space-y-6 animate-fadeIn">
        {/* Overdue alert banner */}
        <OverdueBanner overdueCount={dashboardStats?.overdueTasks || 0} />

        {/* Loading placeholder or metrics */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-muted-foreground select-none">
              Loading dashboard metrics...
            </span>
          </div>
        ) : (
          <>
            {/* Metric grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats.map((stat, idx) => (
                <StatCard
                  key={idx}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  description={stat.description}
                  className={stat.className}
                />
              ))}
            </div>

            {/* Visual charts and recent tasks */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Status bar chart */}
              <TasksByStatus
                todo={dashboardStats?.byStatus.todo || 0}
                inProgress={dashboardStats?.byStatus.in_progress || 0}
                done={dashboardStats?.byStatus.done || 0}
                total={dashboardStats?.totalTasks || 0}
              />

              {/* Quick Actions Panel */}
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
                  <CardDescription>Common operations for task lists.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Button
                    onClick={() => navigate("/tasks")}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 justify-between group shadow-md shadow-blue-500/10"
                  >
                    <span>Create a new task</span>
                    <FiPlus className="transition-transform group-hover:scale-110" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/kanban")}
                    className="w-full justify-between group"
                  >
                    <span>View Kanban Board</span>
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Tasks List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-bold">Recent Tasks</CardTitle>
                  <CardDescription>Your latest 5 tasks and their states.</CardDescription>
                </div>
                <Button
                  variant="link"
                  onClick={() => navigate("/tasks")}
                  className="text-xs font-bold text-blue-500 p-0 hover:underline"
                >
                  View All Tasks
                </Button>
              </CardHeader>
              <CardContent>
                {recentTasks.length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-xl bg-secondary/10">
                    <FiInbox className="mx-auto text-muted-foreground mb-3" size={32} />
                    <h4 className="text-sm font-bold text-muted-foreground mb-0.5">No Tasks Found</h4>
                    <p className="text-xs text-muted-foreground">
                      Create and manage your first work tasks here.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {recentTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => navigate("/tasks")}
                        className="py-3 flex items-center justify-between hover:bg-muted/40 cursor-pointer rounded-lg px-3 transition-colors -mx-3"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <h4 className="text-sm font-bold text-foreground truncate select-none">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-muted-foreground truncate select-none mt-0.5">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 select-none">
                          <PriorityBadge priority={task.priority} />
                          <StatusBadge status={task.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
