import { desc, eq, inArray } from 'drizzle-orm';
import { db } from '~~/server/database';
import { type NewTicketSeat, ticketSeatTable } from '~~/server/database/schema/ticketing';

export async function getAllTicketSeat() {
  return await db.query.ticketSeatTable.findMany({
    orderBy: desc(ticketSeatTable.createdAt),
    with: {
      ticket: true,
      user: true,
    },
  });
}

export async function getTicketSeatByUserId(userId: string) {
  return await db.query.ticketSeatTable.findMany({
    orderBy: desc(ticketSeatTable.createdAt),
    where: eq(ticketSeatTable.id_user, userId),
    with: {
      ticket: {
        with: {
          bus: true,
        },
      },
    },
  });
}

export async function createTicketSeat(data: NewTicketSeat) {
  return await db.insert(ticketSeatTable).values(data);
}

export async function updateTicketSeat(id: string, data: Partial<NewTicketSeat>) {
  return await db.update(ticketSeatTable).set(data).where(eq(ticketSeatTable.id, id));
}

export async function deleteTicketSeat(id: string[]) {
  return await db.delete(ticketSeatTable).where(inArray(ticketSeatTable.id, id));
}
