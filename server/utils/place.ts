import { desc, eq, inArray } from 'drizzle-orm';
import { db } from '../database';
import { type NewPlace, placeTable } from '../database/schema/ticketing';

export async function getAllPlace() {
  return await db.query.placeTable.findMany({
    orderBy: desc(placeTable.createdAt),
  });
}

export async function createPlace(data: NewPlace) {
  return await db.insert(placeTable).values(data);
}

export async function updatePlace(id: string, data: Partial<NewPlace>) {
  return await db.update(placeTable).set(data).where(eq(placeTable.id, id));
}

export async function deletePlace(id: string[]) {
  return await db.delete(placeTable).where(inArray(placeTable.id, id));
}
