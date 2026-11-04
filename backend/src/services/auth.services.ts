import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { SigninInput, SignupInput } from "../validator/auth.validator"
import ApiError from "../utils/api-error";
import { comparePassword, hashPassword } from "../utils/hash-password";
import { env } from "../config/env";
import { generateToken } from "../utils/jwt";

const registerUser = async (data: SignupInput) => {
  const { name, email, password } = data
  // check if user already exist
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw ApiError.conflict("Email is already registered");
  }
  //hash password
  const hashedPassword = await hashPassword(password);

  //create user
  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    });
  return newUser;
}
const loginUser = async (data: SigninInput) => {
  const { email, password } = data
  // find user by email
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user) {
    throw ApiError.unauthorized("Invalid credentials");
  }
  // compare password 
  const isPasswordMatch = await comparePassword(password, user.password);

  if (!isPasswordMatch) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  // generate token
  const token = generateToken({ userId: user.id });
  // return user with token
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }
}
const logoutService = () => {
  return "logout"
}
export { registerUser, loginUser, logoutService }