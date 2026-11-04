import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async (
  password: string
): Promise<string> => {// because its hevy task so we use async when it will finish we will get the data 
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};