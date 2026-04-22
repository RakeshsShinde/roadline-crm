import { Router } from "express";
import { AppError, asyncErrorHandler } from "../../utils/ErrorHandler";
import { sendSignUpOtpAPI, verifySignUpOtpAPI } from "./user.controllers";
import { authMiddleware } from "../../middleware/authMiddleware";

const userRouter = Router();

// to send otp on user phone while signup
userRouter.post(
  "/signup/otp",
  authMiddleware,
  asyncErrorHandler(sendSignUpOtpAPI),
);

// verify the otp for singup
userRouter.post(
  "/verify/otp",
  authMiddleware,
  asyncErrorHandler(verifySignUpOtpAPI),
);

export default userRouter;
