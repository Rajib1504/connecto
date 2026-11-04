import type { RequestHandler } from "express";
import * as authService from "../services/auth.services.js";
import ApiResponse from "../utils/api-response.js";
import { env } from "../config/env.js";


const signupController: RequestHandler = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    return ApiResponse.created(
      res,
      "Account registered successfully",
      user
    );
  } catch (error) {
    next(error);
  }
};

const signInController: RequestHandler = async (req, res, next) => {
  try {
    const { token, user } = await authService.loginUser(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return ApiResponse.ok(res, "Login successful", user);
  } catch (error) {
    next(error);
  }
};
const logoutController: RequestHandler = (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return ApiResponse.ok(res, "Logout successful");
  } catch (error) {
    next(error);
  }
};


export { signupController, signInController, logoutController };