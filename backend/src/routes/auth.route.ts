import { Router } from "express";
import { validate } from "../middlewares/validate.middlewares";
import { signinSchema, signupSchema } from "../validator/auth.validator";
import * as authController from "../controllers/auth.controller";

const AuthRouter = Router();

AuthRouter.post("/signup", validate(signupSchema), authController.signupController);
AuthRouter.post("/signin", validate(signinSchema), authController.signInController);

export default AuthRouter;