import { Lucia, TimeSpan } from "lucia";
import { adapter } from "../database";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
  sessionExpiresIn: new TimeSpan(1, "d"),
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      role: attributes.role,
      is_active: attributes.is_active,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
  role: number;
  is_active: boolean;
}
