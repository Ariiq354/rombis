import { desc, eq, inArray } from 'drizzle-orm';
import { db } from '../database';
import { type NewBus, busTable } from '../database/schema/ticketing';

export async function getAllBus() {
  return await db.query.busTable.findMany({
    orderBy: desc(busTable.createdAt),
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
