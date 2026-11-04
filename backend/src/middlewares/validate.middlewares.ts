import { RequestHandler } from "express";
import { ZodType } from "zod";
import ApiError from "../utils/api-error";

export const validate = (schema: ZodType): RequestHandler => {

  return (req, res, next) => {

    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => {
          const field = issue.path.join(".");
          return `${field}: ${issue.message}`
        })

      return next(ApiError.badRequest(message.join(", ")));

    }

    req.body = result.data;
    next();
  };
}