import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
import {
  type NewTicketSeat,
  ticketSeatTable,
} from "~~/server/database/schema/ticketing";

export async function getAllTicketSeat() {
  return await db
    .select()
    .from(ticketSeatTable)
    .groupBy(ticketSeatTable.price, sql`DATE(ticket_seat.created_at)`)
    .orderBy(desc(ticketSeatTable.createdAt))
    .leftJoin(userTable, eq(ticketSeatTable.userId, userTable.id));
}

export async function getTicketSeatByUserId(userId: string) {
  return await db.query.ticketSeatTable.findMany({
    orderBy: desc(ticketSeatTable.createdAt),
    where: eq(ticketSeatTable.userId, userId),
    with: {
      ticket: {
        with: {
          bus: true,
        },
      },
    },
  });
}

export async function checkUniquePrice(price: number) {
  const today = new Date().toISOString().slice(0, 10);

  return await db
    .select()
    .from(ticketSeatTable)
    .where(
      and(eq(ticketSeatTable.price, price), sql`DATE(created_at) = ${today}`)
    );
}

export async function createTicketSeat(data: NewTicketSeat) {
  return await db.insert(ticketSeatTable).values(data);
}

export async function updateTicketSeat(
  id: string,
  data: Partial<NewTicketSeat>
) {
  return await db
    .update(ticketSeatTable)
    .set(data)
    .where(eq(ticketSeatTable.id, id));
}

export async function updatePaidStatus(
  price: number,
  date: string,
  isPaid: number
) {
  return await db
    .update(ticketSeatTable)
    .set({
      isPaid,
    })
    .where(
      and(eq(ticketSeatTable.price, price), eq(sql`DATE(created_at)`, date))
    );
}

export async function deleteTicketSeat(id: string[]) {
  return await db
    .delete(ticketSeatTable)
    .where(inArray(ticketSeatTable.id, id));
}
