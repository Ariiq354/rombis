import { desc, eq, gt, inArray } from "drizzle-orm";
import { getCurrentDate } from "~/utils";
import { db } from "~~/server/database";
import {
  type NewBus,
  busTable,
  ticketTable,
} from "~~/server/database/schema/ticketing";

export async function getAllBus() {
  return await db.query.busTable.findMany({
    orderBy: desc(busTable.createdAt),
  });
}

export async function getBusById(id: string, is_available = false) {
  let whereQuery;
  if (is_available) {
    whereQuery = gt(ticketTable.date, getCurrentDate());
  }

  return await db.query.busTable.findFirst({
    where: eq(busTable.id, id),
    with: {
      ticket: {
        where: whereQuery,
        with: {
          ticketSeat: true
        }
      },
    },
  });
}

export async function createBus(data: NewBus) {
  return await db.insert(busTable).values(data);
}

export async function updateBus(id: string, data: Partial<NewBus>) {
  return await db.update(busTable).set(data).where(eq(busTable.id, id));
}

export async function deleteBus(id: string[]) {
  return await db.delete(busTable).where(inArray(busTable.id, id));
}
