import type { RequestHandler } from "express";
import ApiError from "../utils/api-error.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticate: RequestHandler = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw ApiError.unauthorized("Authentication required");
    }

    const decoded = verifyToken(token);

    req.user = {// we declear a new type for req.user on types file because express dosent provide it
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : ApiError.unauthorized("Invalid or expired token")
    );
  }
};