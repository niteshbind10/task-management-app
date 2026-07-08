import { internalServerError } from "../common-responses/serverError.path";
import { accessDenied } from "../common-responses/unAuthorisedError.path";

export const taskViewPath = {
  summary: "Get Task by ID",
  tags: ["Tasks"],
  security: [{ CookieAuth: [] }],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
      description: "Task ID (Mongoose ObjectId)",
    },
  ],
  responses: {
    200: {
      description: "Task retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Task retrieved successfully" },
              data: {
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
          },
        },
      },
    },
    401: accessDenied,
    403: {
      description: "Forbidden - Access denied to other users' tasks",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Unauthorized access to task" },
            },
          },
        },
      },
    },
    404: {
      description: "Task not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Task not found" },
            },
          },
        },
      },
    },
    500: internalServerError,
  },
};
