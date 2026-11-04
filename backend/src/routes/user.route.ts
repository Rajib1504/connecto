import { Router } from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import * as userController from "../controllers/user.controller";

const UserRouter = Router();

UserRouter.get("/", authenticate, userController.getAllUsersController);

export default UserRouter;