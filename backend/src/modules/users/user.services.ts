import { executeQuery } from "../../utils/dbQuery";
import { AppError } from "../../utils/ErrorHandler";
import { v4 as uuidv4 } from "uuid";
import { generateOTP } from "../../utils/reusbleFunctions";

export const sendOtp = async ({
  identifier,
  type,
}: {
  identifier: string;
  type: string;
}) => {
  const otp = generateOTP(6);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
  const requestId = uuidv4();

  //remove old otp for same identifier
  await executeQuery(
    `DELETE FROM otp_codes WHERE identifier=$1 AND type=$2 RETURNING *`,
    [identifier, type],
  );

  // Save OTP
  await executeQuery(
    `INSERT INTO otp_codes 
     (identifier, otp, type, expires_at, request_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [identifier, otp, type, expiresAt, requestId],
  );

  const message = `Your verification code is ${otp}. It is valid for 5 minutes.`;

  //   todo: call actual api to send otp on phone/email

  return {
    message: "OTP sent successfully",
    requestId,
  };
};

export const verifyOtp = async ({
  identifier,
  otp,
  type,
  requestId,
}: {
  identifier: string;
  otp: string;
  type: string;
  requestId?: string;
}) => {
  const values = requestId ? [identifier, type, requestId] : [identifier, type];

  const query = `
    SELECT * FROM otp_codes
    WHERE identifier=$1
    AND type=$2
    ${requestId ? "AND request_id=$3" : ""}
    AND is_verified=false
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const result = (await executeQuery(query, values))[0];

  if (!result) {
    throw new AppError("OTP not found", 404);
  }

  // if otp expired
  if (new Date(result.expires_at) < new Date()) {
    throw new AppError("OTP expired", 400);
  }

  // Attempt limit
  if (result.attempts >= 5) {
    throw new AppError("Too many attempts", 429);
  }

  //   Wrong OTP
  if (result.otp !== otp) {
    await executeQuery(
      `UPDATE otp_codes 
       SET attempts = attempts + 1 
       WHERE id=$1`,
      [result.id],
    );

    throw new AppError("Invalid OTP", 400);
  }

  //  Mark verified after verify
  await executeQuery(
    `UPDATE otp_codes 
     SET is_verified=true 
     WHERE id=$1`,
    [result.id],
  );

  return {
    message: "OTP verified successfully",
    identifier,
    type,
  };
};
