import jwt from "jsonwebtoken";

export interface RefreshPayload {
  userId: string;
}

export const createAccessToken = (payload: {
  userId: string;
  tokenVersion: number;
}) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "5m",
  });
};

export const createRefreshToken = (payload: RefreshPayload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};
