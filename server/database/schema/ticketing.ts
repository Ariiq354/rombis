import { sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const busTable = sqliteTable('bus', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  type: text('type').$type<'2x2' | '1x1' | '2x3' | '1x2'>().notNull(),
  seat: int('seat').notNull(),
  route: text('route', { mode: 'json' }).$type<string[]>().notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export type Bus = typeof busTable.$inferSelect;
export type NewBus = typeof busTable.$inferInsert;
