import express, { Application } from "express";
import dotenv from "dotenv";
import pool from "./utils/db";
import cookieparser from "cookie-parser";
import { GlobalErrorHandler } from "./middleware/ErrorMiddleware";
import cors from "cors";
import passport from "passport";
import "./config/passport";
import authRouter from "./modules/Auth/auth.route";
import userRouter from "./modules/users/user.route";

dotenv.config();
pool.connect();
const app: Application = express();
app.use(passport.initialize());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // ✅ if using cookies / auth headers
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieparser());

// mount the all routes
app.use("/auth", authRouter);
app.use("/users", userRouter);

const PORT = process.env.PORT || 5000;

app.use(GlobalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
