import { internalServerError } from "../common-responses/serverError.path";

export const logoutPath = {
  summary: "User Logout",
  tags: ["Auth"],
  responses: {
    200: {
      description: "Logged out successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Logged out successfully" },
            },
          },
        },
      },
    },
    500: internalServerError,
  },
};
