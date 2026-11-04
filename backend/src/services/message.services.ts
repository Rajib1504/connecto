import { and, or, eq, lt, desc } from "drizzle-orm";
import { db } from "../db";
import { messages, users } from "../db/schema";
import { SendMessageInput } from "../validator/message.validator";
import ApiError from "../utils/api-error";

const getChatHistory = async (
  currentUserId: number,
  receiverId: number,
  limit: number,
  before?: number
) => {
  // 1. Find messages between these two users
  const conversationCondition = or(
    and(
      eq(messages.senderId, currentUserId),
      eq(messages.receiverId, receiverId)
    ),
    and(
      eq(messages.senderId, receiverId),
      eq(messages.receiverId, currentUserId)
    )
  );

  // 2. Fetch latest messages before the cursor
  const result = await db
    .select({
      id: messages.id,
      senderId: messages.senderId,
      receiverId: messages.receiverId,
      content: messages.content,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(
      before
        ? and(conversationCondition, lt(messages.id, before))
        : conversationCondition
    )
    .orderBy(desc(messages.id))
    .limit(limit + 1);

  // 3. Check whether older messages exist
  const hasMore = result.length > limit;

  // 4. Keep only the requested number
  const selectedMessages = result.slice(0, limit);

  // 5. Cursor = oldest message in this batch
  const nextCursor = hasMore
    ? selectedMessages[selectedMessages.length - 1].id
    : null;

  // 6. Reverse to show oldest → newest
  const chatMessages = selectedMessages.reverse();

  return {
    messages: chatMessages,
    pagination: {
      limit,
      hasMore,
      nextCursor,
    },
  };
};


const sendMessage = async (
  senderId: number,
  data: SendMessageInput
) => {
  const { receiverId, content } = data;

  // 1. Check receiver exists
  const [receiver] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, receiverId))
    .limit(1);

  if (!receiver) {
    throw ApiError.notfound("Receiver not found");
  }

  // 2. Prevent sending message to yourself
  if (senderId === receiverId) {
    throw ApiError.badRequest("Cannot send message to yourself");
  }

  // 3. Save message
  const [newMessage] = await db
    .insert(messages)
    .values({
      senderId,
      receiverId,
      content,
    })
    .returning({
      id: messages.id,
      senderId: messages.senderId,
      receiverId: messages.receiverId,
      content: messages.content,
      createdAt: messages.createdAt,
    });

  return newMessage;
};
export { getChatHistory, sendMessage };