import type { RequestHandler } from "express";
import * as userService from "../services/user.services";
import ApiResponse from "../utils/api-response";
import ApiError from "../utils/api-error";

 const getAllUsersController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    // 1. Get pagination query
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    // 2. Validate pagination
    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 50
    ) {
      throw ApiError.badRequest("Invalid pagination parameters");
    }

    // 3. Get authenticated user ID
    const currentUserId = req.user!.userId;

    // 4. Fetch users
    const result = await userService.getAllUsers(
      currentUserId,
      page,
      limit
    );

    return ApiResponse.ok(
      res,
      "Users fetched successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};

export { getAllUsersController };