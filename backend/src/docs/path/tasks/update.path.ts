import { internalServerError } from "../common-responses/serverError.path";
import { accessDenied } from "../common-responses/unAuthorisedError.path";
import { validationError } from "../common-responses/validationError.path";

export const taskUpdatePath = {
  summary: "Update an Existing Task",
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
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            title: { type: "string", example: "Buy groceries (Updated)" },
            description: { type: "string", example: "Milk, Bread, Fruits, Eggs" },
            priority: { type: "string", enum: ["low", "medium", "high"], example: "high" },
            status: { type: "string", enum: ["todo", "in_progress", "done"], example: "in_progress" },
            dueDate: { type: "string", format: "date-time", example: "2026-07-16T18:00:00.000Z" },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Task updated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Task updated successfully" },
              data: {
                type: "object",
                properties: {
                  id: { type: "string", example: "60d0fe4f5311236168a109cb" },
                  userId: { type: "string", example: "60d0fe4f5311236168a109ca" },
                  title: { type: "string", example: "Buy groceries (Updated)" },
                  description: { type: "string", example: "Milk, Bread, Fruits, Eggs" },
                  priority: { type: "string", example: "high" },
                  status: { type: "string", example: "in_progress" },
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
    400: validationError,
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
