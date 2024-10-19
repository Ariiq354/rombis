import { desc, eq, gt, inArray } from "drizzle-orm";
import { getCurrentDate } from "~/utils";
import { db } from "~~/server/database";
import {
  type NewTicket,
  ticketTable,
} from "~~/server/database/schema/ticketing";

export async function getAllTicket(is_available = false) {
  let whereQuery;
  if (is_available) {
    whereQuery = gt(ticketTable.date, getCurrentDate());
  }

  return await db.query.ticketTable.findMany({
    orderBy: desc(ticketTable.createdAt),
    with: {
      bus: true,
      ticketSeat: true,
    },
    where: whereQuery,
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
