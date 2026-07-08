import { registerPath } from "./path/auth/register.path";
import { loginUserPath } from "./path/auth/login.path";
import { logoutPath } from "./path/auth/logout.path";
import { getMePath } from "./path/auth/me.path";
import { taskCreatePath } from "./path/tasks/create.path";
import { taskListPath } from "./path/tasks/list.path";
import { taskViewPath } from "./path/tasks/view.path";
import { taskUpdatePath } from "./path/tasks/update.path";
import { taskDeletePath } from "./path/tasks/delete.path";
import { dashboardStatsPath } from "./path/dashboard/stats.path";

const swaggerSpec = {
  openapi: "3.0.2",
  info: {
    title: "Task Management API",
    version: "1.0.0",
    description: "RESTful API for Task Management with JWT Authentication and WebSockets",
  },
  components: {
    securitySchemes: {
      CookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: registerPath,
    },
    "/api/auth/login": {
      post: loginUserPath,
    },
    "/api/auth/logout": {
      post: logoutPath,
    },
    "/api/auth/me": {
      get: getMePath,
    },
    "/api/tasks": {
      post: taskCreatePath,
      get: taskListPath,
    },
    "/api/tasks/{id}": {
      get: taskViewPath,
      put: taskUpdatePath,
      delete: taskDeletePath,
    },
    "/api/dashboard": {
      get: dashboardStatsPath,
    },
  },
};

export default swaggerSpec;
