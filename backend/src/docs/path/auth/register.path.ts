import { internalServerError } from "../common-responses/serverError.path";
import { validationError } from "../common-responses/validationError.path";

export const registerPath = {
  summary: "Register a New User",
  tags: ["Auth"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            fullName: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", example: "password123" },
          },
          required: ["fullName", "email", "password"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "User registered successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Registration successful" },
              data: {
                type: "object",
                properties: {
                  id: { type: "string", example: "60d0fe4f5311236168a109ca" },
                  fullName: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john@example.com" },
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
    500: internalServerError,
  },
};
