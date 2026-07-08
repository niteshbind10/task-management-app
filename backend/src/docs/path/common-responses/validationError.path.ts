export const validationError = {
  description: "Validation Error",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "title is required" },
        },
      },
    },
  },
};
