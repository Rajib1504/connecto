import { Router } from "express";
import { validate } from "../middlewares/validate.middlewares";
import { signinSchema, signupSchema } from "../validator/auth.validator";
import { signupController } from "../controllers/auth.controller";

const AuthRouter = Router();

AuthRouter.post("/signup", validate(signupSchema), signupController);
// AuthRouter.post("/signin", validate(signinSchema), signinController);

export default AuthRouter;