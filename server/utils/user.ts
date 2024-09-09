import { db } from '../database';

export async function getUserByUsername(username: string) {
  return await db.query.userTable.findFirst({
    where: (user, { eq }) => eq(user.username, username)
  });
}
