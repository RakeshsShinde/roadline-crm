import { Request, Response } from "express";
import {
  loginSchema,
  LoginUserInput,
  registerSchema,
  RegisterUserInput,
} from "./auth.schema";
import { loginUser, RegisterUser } from "./auth.services";
import { executeQuery } from "../../utils/dbQuery";
import { AppError } from "../../utils/ErrorHandler";
import {
  createAccessToken,
  createRefreshToken,
  RefreshPayload,
} from "../../utils/jwt";
import jwt from "jsonwebtoken";

export const registerAPI = async (req: Request, res: Response) => {
  const data: RegisterUserInput = registerSchema.parse(req.body);

  const user = await RegisterUser(data);

  return res.status(200).json({
    message: "user register sucecssfully ",
    data: user,
  });
};

export const loginAPI = async (req: Request, res: Response) => {
  const data: LoginUserInput = loginSchema.parse(req.body);
  const tokens = await loginUser(data);

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: true,
    accessToken: tokens.accessToken,
    user: tokens.user,
  });
};

export const logoutAPI = async (req: Request, res: Response) => {
  const userId = req.user;
  // 🔥 invalidate all existing access tokens
  await executeQuery(
    "UPDATE users SET token_version = token_version + 1 WHERE id = $1",
    [userId],
  );

  // optional: also clear refresh tokens
  await executeQuery("DELETE FROM refresh_tokens WHERE user_id = $1", [userId]);

  res.json({ message: "Logged out from all devices" });
};

export const refreshAccessTokenAPI = async (req: Request, res: Response) => {
  console.log("called this api with...");
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new AppError("Refresh token expired", 401);
  }

  // verify the refreh token

  let payload: RefreshPayload;

  try {
    payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as RefreshPayload;
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  // check access token is exists in DB
  const token = (
    await executeQuery<{ user_id: string }>(
      `SELECT user_id FROM refresh_tokens WHERE token=$1`,
      [refreshToken],
      "Failed to get refresh token",
    )
  )[0];

  if (!token) {
    throw new AppError("Refresh token revoked", 403);
  }

  const userResult = await executeQuery<{ token_version: number }>(
    `SELECT token_version FROM users WHERE id = $1`,
    [payload.userId],
    "Failed to get user token version",
  );

  if (!userResult.length) {
    throw new AppError("User not found", 404);
  }

  const tokenVersion = userResult[0].token_version;

  // 4️⃣ Create new access token
  const newAccessToken = createAccessToken({
    userId: payload.userId,
    tokenVersion,
  });

  return res.status(200).json({
    suceess: true,
    accessToken: newAccessToken,
  });
};

export const googleLoginAPI = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Google authentication failed", 401);
  }

  const user = req.user as any;

  const accessToken = createAccessToken({
    userId: user.id,
    tokenVersion: user?.token_version,
  });
  const refreshToken = createRefreshToken({ userId: user.id });
  // saved refresh token inside db
  await executeQuery(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1,$2,NOW() + INTERVAL '7 days')`,
    [user.id, refreshToken],
  );

  // also saved inside cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect(
    `${process.env.CLIENT_URL}/oauth-success?token=${accessToken}&user=${encodeURIComponent(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }),
    )}`,
  );
};

export const githubLoginAPI = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("github authentication failed", 401);
  }

  const user = req.user as any;

  const accessToken = createAccessToken({
    userId: user.id,
    tokenVersion: user?.token_version,
  });

  const refreshToken = createRefreshToken({ userId: user.id });
  // saved refresh token inside db
  await executeQuery(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1,$2,NOW() + INTERVAL '7 days')`,
    [user.id, refreshToken],
  );

  // also saved inside cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect(
    `${process.env.CLIENT_URL}/oauth-success?token=${accessToken}&user=${encodeURIComponent(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }),
    )}`,
  );
};
