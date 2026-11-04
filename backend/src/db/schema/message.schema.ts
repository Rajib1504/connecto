import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./user.shcema.ts";


export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),

  senderId: integer("sender_id")
    .notNull()
    .references(() => users.id),

  receiverId: integer("receiver_id")
    .notNull()
    .references(() => users.id),

  content: text("content").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});