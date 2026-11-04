import { Router } from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import * as messageController from "../controllers/message.controller";
import { validate } from "../middlewares/validate.middlewares";
import { sendMessageSchema } from "../validator/message.validator";

const MessageRouter = Router();

MessageRouter.get(
  "/:receiverId",
  authenticate,
  messageController.getChatHistoryController
);
MessageRouter.post(
  "/",
  authenticate,
  validate(sendMessageSchema),
  messageController.sendMessageController
);

export default MessageRouter;