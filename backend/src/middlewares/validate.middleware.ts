import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AppError } from "@/middlewares/error.middleware";

type ValidationSource = "body" | "query" | "params";

export const validate = (
  schema: Joi.ObjectSchema,
  source: ValidationSource = "body"
) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new AppError(messages, 400);
    }

    req[source] = value;
    next();
  };
};
