import { internalServerError } from "../common-responses/serverError.path";
import { accessDenied } from "../common-responses/unAuthorisedError.path";

export const getMePath = {
  summary: "Get Authenticated User Profile",
  tags: ["Auth"],
  security: [{ CookieAuth: [] }],
  responses: {
    200: {
      description: "Profile retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "User profile fetched successfully" },
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
    401: accessDenied,
    500: internalServerError,
  },
};
