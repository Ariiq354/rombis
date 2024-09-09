import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as auth from './schema/auth';

const client = createClient({
  url: 'file:test.db',
  // url: DATABASE_URL,
  // authToken: DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, {
  schema: {
    ...auth,
  },
});

export const adapter = new DrizzleSQLiteAdapter(db, auth.sessionTable, auth.userTable);
