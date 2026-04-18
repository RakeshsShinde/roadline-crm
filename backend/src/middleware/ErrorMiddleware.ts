import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/ErrorHandler";

export function GlobalErrorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  let error = err;
  const statusCode = error.statusCode || 500;
  const message = error.message || "internal server error";

  if (err instanceof ZodError) {
    const formattedErrors: Record<string, string> = {};

    err.issues.forEach((issue) => {
      const field = issue.path.join(".");
      formattedErrors[field || "body"] = issue.message;
    });

    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: formattedErrors,
    });
  }

  // 2️⃣ Custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // 3️⃣ Unknown error
  console.error("UNHANDLED ERROR:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
