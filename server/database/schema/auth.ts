import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { generateIdFromEntropySize } from 'lucia';

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey().default(generateIdFromEntropySize(10)),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
    .notNull()
});

export const sessionTable = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer('expires_at').notNull()
});

export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;
