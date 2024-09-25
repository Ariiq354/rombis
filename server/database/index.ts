import { createClient } from "@libsql/client";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { drizzle } from "drizzle-orm/libsql";
import * as auth from "./schema/auth";
import * as ticketing from "./schema/ticketing";

const client = createClient({
  url: "file:test.db",
});

export const db = drizzle(client, {
  schema: {
    ...auth,
    ...ticketing,
  },
});

export const adapter = new DrizzleSQLiteAdapter(
  db,
  auth.sessionTable,
  auth.userTable
);
