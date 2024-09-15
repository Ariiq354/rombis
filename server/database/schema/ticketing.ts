import { sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const placeTable = sqliteTable('places', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  is_active: int('is_active', { mode: 'boolean' }).default(false).notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const busTable = sqliteTable('bus', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  route: text('route', { mode: 'json' }).$type<string[]>().notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export type Place = typeof placeTable.$inferSelect;
export type NewPlace = typeof placeTable.$inferInsert;

export type Bus = typeof busTable.$inferSelect;
export type NewBus = typeof busTable.$inferInsert;
