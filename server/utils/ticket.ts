import { desc, eq, inArray } from 'drizzle-orm';
import { db } from '../database';
import { type NewTicket, ticketTable } from '../database/schema/ticketing';

export async function getAllTicket() {
  return await db.query.ticketTable.findMany({
    orderBy: desc(ticketTable.createdAt),
    with: {
      bus: true,
      ticketSeat: true,
    },
  });
}

export async function createTicket(data: NewTicket) {
  return await db.insert(ticketTable).values(data);
}

export async function updateTicket(id: string, data: Partial<NewTicket>) {
  return await db.update(ticketTable).set(data).where(eq(ticketTable.id, id));
}

export async function deleteTicket(id: string[]) {
  return await db.delete(ticketTable).where(inArray(ticketTable.id, id));
}
