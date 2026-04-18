import { Router } from "express";
import { AppError, asyncErrorHandler } from "../../utils/ErrorHandler";
import {
  githubLoginAPI,
  googleLoginAPI,
  loginAPI,
  logoutAPI,
  refreshAccessTokenAPI,
  registerAPI,
} from "./auth.controllers";
import { authMiddleware } from "../../middleware/authMiddleware";
import passport from "passport";

const authRouter = Router();

authRouter.post("/register", asyncErrorHandler(registerAPI));
authRouter.post("/login", asyncErrorHandler(loginAPI));
authRouter.post("/refresh-token", asyncErrorHandler(refreshAccessTokenAPI));
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/",
  }),
  asyncErrorHandler(googleLoginAPI),
);

authRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "http://localhost:5173",
  }),
  asyncErrorHandler(githubLoginAPI),
);

authRouter.post("/logout", authMiddleware, asyncErrorHandler(logoutAPI));
export default authRouter;
