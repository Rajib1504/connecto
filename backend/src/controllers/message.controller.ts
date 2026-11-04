import type { RequestHandler } from "express";
import * as messageService from "../services/message.services";
import ApiResponse from "../utils/api-response";
import ApiError from "../utils/api-error";
import { getSocketServer } from "../socket/socket-instence";
const getChatHistoryController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const currentUserId = req.user!.userId;

    const receiverId = Number(req.params.receiverId);
    const limit = req.query.limit === undefined
      ? 30
      : Number(req.query.limit);

    const before = req.query.before === undefined
      ? undefined
      : Number(req.query.before);

    // Validate parameters
    if (
      !Number.isSafeInteger(receiverId) ||
      receiverId <= 0 ||
      !Number.isSafeInteger(limit) ||
      limit < 1 ||
      limit > 50 ||
      (before !== undefined &&
        (!Number.isSafeInteger(before) || before <= 0))
    ) {
      throw ApiError.badRequest("Invalid chat parameters");
    }

    if (currentUserId === receiverId) {
      throw ApiError.badRequest("Cannot chat with yourself");
    }

    const result = await messageService.getChatHistory(
      currentUserId,
      receiverId,
      limit,
      before
    );

    return ApiResponse.ok(
      res,
      "Chat history fetched successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};

const sendMessageController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const senderId = req.user!.userId;

    const newMessage = await messageService.sendMessage(
      senderId,
      req.body
    );
    // console.log("Sending socket event to:", newMessage.receiverId);

    // Emit to receiver
    getSocketServer()
      .to(`user:${newMessage.receiverId}`)
      .emit("new-message", newMessage);

    return ApiResponse.created(
      res,
      "Message sent successfully",
      newMessage
    );
  } catch (error) {
    next(error);
  }
};
export { getChatHistoryController, sendMessageController };