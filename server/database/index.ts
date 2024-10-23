import { drizzle } from "drizzle-orm/libsql";
import * as auth from "./schema/auth";
import * as ticketing from "./schema/ticketing";

const config = useRuntimeConfig();

export const db = drizzle({
  connection: {
    url: config.databaseUrl as string,
    authToken: config.databaseAuthToken as string,
  },
  schema: {
    ...auth,
    ...ticketing,
  },
  casing: "snake_case",
});
