import { eq, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import { sessionTable } from "~~/server/database/schema/auth";

export async function extendSession(sessionId: string, time: number) {
  return await db
    .update(sessionTable)
    .set({
      expiresAt: sql`${sessionTable.expiresAt} + ${time}`,
    })
    .where(eq(sessionTable.id, sessionId));
}
