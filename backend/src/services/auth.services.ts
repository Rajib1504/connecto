import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { SignupInput } from "../validator/auth.validator"
import ApiError from "../utils/api-error";
import { hashPassword } from "../utils/hash-password";

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
const loginService = () => {
  return "login"
}
const logoutService = () => {
  return "logout"
}
export { registerUser, loginService, logoutService }