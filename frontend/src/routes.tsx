import React, { Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Loader from "./components/Loader";
import ErrorBoundary from "./components/ErrorBoundary";

const Login = React.lazy(() => import("./modules/Auth/pages/Login"));
const Register = React.lazy(() => import("./modules/Auth/pages/Register"));
const Dashboard = React.lazy(() => import("./modules/Dashboard/pages/Dashboard"));
const TaskList = React.lazy(() => import("./modules/Tasks/pages/TaskList"));
const KanbanBoard = React.lazy(() => import("./modules/Tasks/pages/KanbanBoard"));
const NotFound = React.lazy(() => import("./modules/NotFound"));

const ProtectedRoute = React.lazy(() => import("./modules/Auth/components/ProtectedRoute"));
const PublicRoute = React.lazy(() => import("./modules/Auth/components/PublicRoute"));

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={<Loader />}>{children}</Suspense>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: (
      <SuspenseWrapper>
        <PublicRoute />
      </SuspenseWrapper>
    ),
    children: [
      {
        path: "/login",
        element: (
          <SuspenseWrapper>
            <Login />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/register",
        element: (
          <SuspenseWrapper>
            <Register />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    element: (
      <SuspenseWrapper>
        <ProtectedRoute />
      </SuspenseWrapper>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <SuspenseWrapper>
            <Dashboard />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/tasks",
        element: (
          <SuspenseWrapper>
            <TaskList />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/kanban",
        element: (
          <SuspenseWrapper>
            <KanbanBoard />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
  },
]);

const Routes: React.FC = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default Routes;
