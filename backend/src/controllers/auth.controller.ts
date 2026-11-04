import type { RequestHandler } from "express";
import { registerUser } from "../services/auth.services.js";
import ApiResponse from "../utils/api-response.js";

export const signupController: RequestHandler = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    return ApiResponse.created(
      res,
      "Account registered successfully",
      user
    );
  } catch (error) {
    next(error);
  }
};