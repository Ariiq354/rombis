import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as auth from './schema/auth';
import

const client = createClient({
  // url: 'file:test.db',
  url: '',
  authToken: '',
});

export const db = drizzle(client, {
  schema: {
    ...auth,
  },
});

export const adapter = new DrizzleSQLiteAdapter(db, auth.sessionTable, auth.userTable);
