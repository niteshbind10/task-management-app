import { internalServerError } from "../common-responses/serverError.path";
import { accessDenied } from "../common-responses/unAuthorisedError.path";

export const dashboardStatsPath = {
  summary: "Get Dashboard Statistics",
  description: "Get counts of tasks grouped by status and priority, total tasks, and overdue tasks count.",
  tags: ["Dashboard"],
  security: [{ CookieAuth: [] }],
  responses: {
    200: {
      description: "Stats retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Dashboard stats retrieved successfully" },
              data: {
                type: "object",
                properties: {
                  totalTasks: { type: "integer", example: 25 },
                  byStatus: {
                    type: "object",
                    properties: {
                      todo: { type: "integer", example: 10 },
                      in_progress: { type: "integer", example: 8 },
                      done: { type: "integer", example: 7 },
                    },
                  },
                  byPriority: {
                    type: "object",
                    properties: {
                      low: { type: "integer", example: 8 },
                      medium: { type: "integer", example: 12 },
                      high: { type: "integer", example: 5 },
                    },
                  },
                  overdueTasks: { type: "integer", example: 3 },
                },
              },
            },
          },
        },
      },
    },
    401: accessDenied,
    500: internalServerError,
  },
};
