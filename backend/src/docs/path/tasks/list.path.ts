import { internalServerError } from "../common-responses/serverError.path";
import { accessDenied } from "../common-responses/unAuthorisedError.path";

export const taskListPath = {
  summary: "List My Tasks",
  description: "Retrieve all tasks belonging to the logged-in user. Supports filtering and sorting.",
  tags: ["Tasks"],
  security: [{ CookieAuth: [] }],
  parameters: [
    {
      name: "status",
      in: "query",
      schema: { type: "string", enum: ["todo", "in_progress", "done"] },
      description: "Filter by status",
    },
    {
      name: "priority",
      in: "query",
      schema: { type: "string", enum: ["low", "medium", "high"] },
      description: "Filter by priority",
    },
    {
      name: "sortBy",
      in: "query",
      schema: { type: "string", enum: ["dueDate", "createdAt"], default: "createdAt" },
      description: "Field to sort by",
    },
    {
      name: "order",
      in: "query",
      schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
      description: "Sort order (ascending or descending)",
    },
    {
      name: "limit",
      in: "query",
      schema: { type: "integer", default: 10 },
      description: "Limit of records for pagination",
    },
    {
      name: "skip",
      in: "query",
      schema: { type: "integer", default: 0 },
      description: "Skip records for pagination",
    },
  ],
  responses: {
    200: {
      description: "Tasks retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Tasks retrieved successfully" },
              data: {
                type: "object",
                properties: {
                  tasks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", example: "60d0fe4f5311236168a109cb" },
                        userId: { type: "string", example: "60d0fe4f5311236168a109ca" },
                        title: { type: "string", example: "Buy groceries" },
                        description: { type: "string", example: "Milk, Bread, Fruits" },
                        priority: { type: "string", example: "medium" },
                        status: { type: "string", example: "todo" },
                        dueDate: { type: "string", format: "date-time" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                      },
                    },
                  },
                  total: { type: "integer", example: 1 },
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
