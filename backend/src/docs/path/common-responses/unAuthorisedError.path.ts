export const accessDenied = {
  description: "Unauthorized Access",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Authentication required. Please login." },
        },
      },
    },
  },
};
