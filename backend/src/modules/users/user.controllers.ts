import { Request, Response } from "express";
import { sendOtpSchema, verifyOtpSchema } from "../../Schema/user.schema";
import { sendOtp, verifyOtp } from "./user.services";

export const sendSignUpOtpAPI = async (req: Request, res: Response) => {
  const data = sendOtpSchema.parse(req.body);
  const result = await sendOtp({
    identifier: data.identifier,
    type: data.type,
  });

  return res.status(200).json({
    success: true,
    message: result.message,
    requestId: result.requestId,
  });
};

export const verifySignUpOtpAPI = async (req: Request, res: Response) => {
  const data = verifyOtpSchema.parse(req.body);

  await verifyOtp({
    identifier: data.identifier,
    otp: data.otp,
    type: data.type,
    requestId: data.requestId,
  });

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
};
