import { relations, sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './auth';

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

export const ticketTable = sqliteTable('ticket', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  id_bus: text('id_bus')
    .notNull()
    .references(() => busTable.id),
  price: text('price', { mode: 'json' }).$type<number[]>().notNull(),
  time: text('time', { mode: 'json' }).$type<string[]>().notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const ticketSeatTable = sqliteTable('ticket_seat', {
  id: text('id').primaryKey(),
  id_ticket: text('id_ticket')
    .notNull()
    .references(() => ticketTable.id),
  id_user: text('id_user')
    .notNull()
    .references(() => userTable.id),
  seat: int('seat').notNull(),
  price: int('seat').notNull(),
  route: text('route', { mode: 'json' }).$type<[string, string]>().notNull(),
  is_paid: int('seat', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const busRelations = relations(busTable, ({ many }) => ({
  ticket: many(ticketTable),
}));

export const ticketRelations = relations(ticketTable, ({ many, one }) => ({
  bus: one(busTable, {
    fields: [ticketTable.id_bus],
    references: [busTable.id],
  }),
  ticketSeat: many(ticketSeatTable),
}));

export const ticketSeatRelations = relations(ticketSeatTable, ({ one }) => ({
  ticket: one(ticketTable, {
    fields: [ticketSeatTable.id_ticket],
    references: [ticketTable.id],
  }),
  user: one(userTable, {
    fields: [ticketSeatTable.id_user],
    references: [userTable.id],
  }),
}));

export type Bus = typeof busTable.$inferSelect;
export type NewBus = typeof busTable.$inferInsert;

export type Ticket = typeof ticketTable.$inferSelect;
export type NewTicket = typeof ticketTable.$inferInsert;

export type TicketSeat = typeof ticketSeatTable.$inferSelect;
export type NewTicketSeat = typeof ticketSeatTable.$inferInsert;
