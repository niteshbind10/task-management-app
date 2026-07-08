import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const dueDateMessages = {
  "date.format": "Please provide a valid date (e.g., 08-07-2026)",
  "date.base": "Please provide a valid date",
};

export const createTaskSchema = Joi.object({
  title: Joi.string().required().min(2).max(200).trim(),
  description: Joi.string().optional().allow("").max(2000).trim(),
  priority: Joi.string().valid("low", "medium", "high").default("medium"),
  status: Joi.string().valid("todo", "in_progress", "done").default("todo"),
  dueDate: Joi.date().iso().optional().allow(null).messages(dueDateMessages),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().optional().min(2).max(200).trim(),
  description: Joi.string().optional().allow("").max(2000).trim(),
  priority: Joi.string().valid("low", "medium", "high"),
  status: Joi.string().valid("todo", "in_progress", "done"),
  dueDate: Joi.date().iso().optional().allow(null).messages(dueDateMessages),
}).min(1);

export const taskIdSchema = Joi.object({
  id: Joi.string().pattern(objectIdPattern).required().messages({
    "string.pattern.base": "Invalid Task ID format",
  }),
});

