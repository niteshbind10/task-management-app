import { internalServerError } from "../common-responses/serverError.path";
import { accessDenied } from "../common-responses/unAuthorisedError.path";

export const taskDeletePath = {
  summary: "Delete a Task",
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
      description: "Task deleted successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Task deleted successfully" },
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
