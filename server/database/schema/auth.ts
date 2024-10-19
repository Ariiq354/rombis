import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "./common";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const userTable = sqliteTable("user", {
  id: text().primaryKey(),
  username: text().notNull().unique(),
  password: text().notNull(),
  isActive: int({ mode: "boolean" }).notNull().default(false),
  role: int().notNull().default(0),
  ...timestamp,
});

export const sessionTable = sqliteTable("session", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => userTable.id),
  expiresAt: int({ mode: "timestamp" }).notNull(),
});

export type User = InferSelectModel<typeof userTable>;
export type NewUser = InferInsertModel<typeof userTable>;

export type UserLucia = Omit<User, "createdAt" | "updatedAt" | "password">;

export type Session = InferSelectModel<typeof sessionTable>;
export type NewSession = InferInsertModel<typeof sessionTable>;
