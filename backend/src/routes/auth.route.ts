import { Router } from "express";
import { validate } from "../middlewares/validate.middlewares";
import { signinSchema, signupSchema } from "../validator/auth.validator";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middlewares";
import ApiResponse from "../utils/api-response";

const AuthRouter = Router();

AuthRouter.post("/signup", validate(signupSchema), authController.signupController);
AuthRouter.post("/signin", validate(signinSchema), authController.signInController);
AuthRouter.post("/logout", authController.logoutController);


//temporary test route
AuthRouter.get("/protected", authenticate, (req, res) => {
  return ApiResponse.ok(res, "Authenticated successfully", {
    userId: req.user?.userId,
  });
});
export default AuthRouter;