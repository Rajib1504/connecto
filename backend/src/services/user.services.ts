import { db } from "../db";
import { users } from "../db/schema";
import { eq, ne, count } from "drizzle-orm";
const getAllUsers = async (
  currentUserId: number,
  page: number,
  limit: number
) => {
  // Calculate offset for pagination (when my page is 1, offset is 0, when page is 2, offset is 10)
  const offset = (page - 1) * limit;

  // Fetch users
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(ne(users.id, currentUserId))
    .limit(limit)
    .offset(offset);

  // Count total users excluding current user
  const [totalResult] = await db
    .select({ total: count() })
    .from(users)
    .where(ne(users.id, currentUserId));

  const totalUsers = totalResult.total;

  return {
    users: allUsers,
    pagination: {
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
    },
  };
};

export { getAllUsers };