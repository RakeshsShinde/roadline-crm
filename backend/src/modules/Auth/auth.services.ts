import { executeQuery } from "../../utils/dbQuery";
import { AppError } from "../../utils/ErrorHandler";
import { createAccessToken, createRefreshToken } from "../../utils/jwt";
import { comaparePassword, hashPassword } from "../../utils/password";
import { LoginUserInput, RegisterUserInput } from "./auth.schema";

export const RegisterUser = async (data: RegisterUserInput) => {
  const { name, email, password, avatar, default_currency, auth_provider } =
    data;

  const hashedPassword = await hashPassword(password);
  const user = (
    await executeQuery(
      `INSERT INTO users (name,email,password,auth_provider,avatar)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING*
     `,
      [name, email, hashedPassword, auth_provider || "local", avatar || null],
      "something went wrong while register user !",
    )
  )[0];

  return user;
};

export const loginUser = async (data: LoginUserInput) => {
  const { email, password } = data;

  let user = (
    await executeQuery(
      `select * from users where email='${email}'`,
      [],
      "something went wrong while getting user",
    )
  )[0];

  if (!user) {
    throw new AppError("user not exists", 404);
  }

  const isCorrectPassword = await comaparePassword(password, user.password);
  if (!isCorrectPassword) {
    throw new AppError("password do not matched", 400);
  }

  // create an acccess and refresh token

  const accessToken = createAccessToken({
    userId: user.id,
    tokenVersion: user?.token_version,
  });
  const refreshToken = createRefreshToken({ userId: user.id });

  await executeQuery(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1,$2,NOW() + INTERVAL '7 days')`,
    [user.id, refreshToken],
  );

  return { accessToken, refreshToken, user };
};
