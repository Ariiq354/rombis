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
  casing: "snake_case",
});
