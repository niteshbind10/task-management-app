import { internalServerError } from "../common-responses/serverError.path";
import { accessDenied } from "../common-responses/unAuthorisedError.path";
import { validationError } from "../common-responses/validationError.path";

export const taskCreatePath = {
  summary: "Create a New Task",
  tags: ["Tasks"],
  security: [{ CookieAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            title: { type: "string", example: "Buy groceries" },
            description: { type: "string", example: "Milk, Bread, Fruits" },
            priority: { type: "string", enum: ["low", "medium", "high"], example: "medium" },
            status: { type: "string", enum: ["todo", "in_progress", "done"], example: "todo" },
            dueDate: { type: "string", format: "date-time", example: "2026-07-15T18:00:00.000Z" },
          },
          required: ["title"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "Task created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Task created successfully" },
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
    400: validationError,
    401: accessDenied,
    500: internalServerError,
  },
};
