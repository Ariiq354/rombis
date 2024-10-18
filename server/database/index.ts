import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { drizzle } from "drizzle-orm/libsql";
import * as auth from "./schema/auth";
import * as ticketing from "./schema/ticketing";
const config = useRuntimeConfig();

export const db = drizzle({
  connection: {
    url: config.databaseUrl,
    authToken: config.databaseAuthToken,
  },
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
