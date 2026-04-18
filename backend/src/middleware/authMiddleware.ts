import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/ErrorHandler";
import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { executeQuery } from "../utils/dbQuery";

export interface AuthPayload extends jwt.JwtPayload {
  userId: string;
  tokenVersion: number;
}
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized: Token missing", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    var payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as AuthPayload;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new AppError("Access token expired", 401);
    }

    if (err instanceof JsonWebTokenError) {
      throw new AppError("Invalid access token", 401);
    }

    if (err instanceof NotBeforeError) {
      throw new AppError("Token not active", 401);
    }

    throw err;
  }

  const result = await executeQuery<{ token_version: number }>(
    "SELECT token_version FROM users WHERE token_version= $1",
    [payload.tokenVersion],
    "something went wrong while getting token version",
  );
  if (!result.length || result[0].token_version !== payload.tokenVersion) {
    throw new AppError("Session expired. Please login again.", 401);
  }
  req.user = payload.userId;
  next();
};
