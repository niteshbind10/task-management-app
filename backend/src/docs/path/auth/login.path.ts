import { internalServerError } from "../common-responses/serverError.path";
import { validationError } from "../common-responses/validationError.path";

export const loginUserPath = {
  summary: "User Login",
  tags: ["Auth"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", example: "password123" },
            rememberMe: { type: "boolean", example: true },
          },
          required: ["email", "password"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login successful",
      headers: {
        "Set-Cookie": {
          schema: {
            type: "string",
            example: "token=sometokenvalue; Path=/; HttpOnly; SameSite=Lax",
          },
        },
      },
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Login successful" },
              data: {
                type: "object",
                properties: {
                  user: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "60d0fe4f5311236168a109ca" },
                      fullName: { type: "string", example: "John Doe" },
                      email: { type: "string", example: "john@example.com" },
                    },
                  },
                  token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsIn..." },
                },
              },
            },
          },
        },
      },
    },
    400: validationError,
    401: {
      description: "Invalid credentials",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Invalid email or password" },
            },
          },
        },
      },
    },
    500: internalServerError,
  },
};
