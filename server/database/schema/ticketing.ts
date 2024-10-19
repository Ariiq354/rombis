import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "./auth";
import { timestamp } from "./common";

export const busTable = sqliteTable("bus", {
  id: text().primaryKey(),
  name: text().notNull(),
  description: text().notNull(),
  type: text().$type<"2x2" | "1x1" | "2x3" | "1x2">().notNull(),
  seat: int().notNull(),
  route: text({ mode: "json" }).$type<string[]>().notNull(),
  tikum: text({ mode: "json" }).$type<string[]>().notNull(),
  ...timestamp,
});

export const ticketTable = sqliteTable("ticket", {
  id: text().primaryKey(),
  date: text().notNull(),
  busId: text()
    .notNull()
    .references(() => busTable.id, { onDelete: "cascade" }),
  price: text({ mode: "json" }).$type<number[]>().notNull(),
  time: text({ mode: "json" }).$type<string[]>().notNull(),
  current: text().notNull().default(""),
  ...timestamp,
});

export const ticketSeatTable = sqliteTable("ticket_seat", {
  id: text().primaryKey(),
  ticketId: text()
    .notNull()
    .references(() => ticketTable.id, { onDelete: "cascade" }),
  userId: text()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  seat: int().notNull(),
  price: int().notNull(),
  name: text().notNull(),
  tikum: text().notNull(),
  route: text({ mode: "json" }).$type<[string, string]>().notNull(),
  isPaid: int().notNull().default(0),
  ...timestamp,
});

export const busRelations = relations(busTable, ({ many }) => ({
  ticket: many(ticketTable),
}));

export const ticketRelations = relations(ticketTable, ({ many, one }) => ({
  bus: one(busTable, {
    fields: [ticketTable.busId],
    references: [busTable.id],
  }),
  ticketSeat: many(ticketSeatTable),
}));

export const ticketSeatRelations = relations(ticketSeatTable, ({ one }) => ({
  ticket: one(ticketTable, {
    fields: [ticketSeatTable.ticketId],
    references: [ticketTable.id],
  }),
  user: one(userTable, {
    fields: [ticketSeatTable.userId],
    references: [userTable.id],
  }),
}));

export type Bus = typeof busTable.$inferSelect;
export type NewBus = typeof busTable.$inferInsert;

export type Ticket = typeof ticketTable.$inferSelect;
export type NewTicket = typeof ticketTable.$inferInsert;

export type TicketSeat = typeof ticketSeatTable.$inferSelect;
export type NewTicketSeat = typeof ticketSeatTable.$inferInsert;
