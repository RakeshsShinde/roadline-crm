import bcrypt from "bcrypt";

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comaparePassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
