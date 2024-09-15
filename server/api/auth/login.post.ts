import { Argon2id } from 'oslo/password';
import { getUserByUsername } from '../../utils/user';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export default eventHandler(async (event) => {
  const formData = await readBody(event);

  const res = loginSchema.parse(formData);

  const username = res.username;
  const password = res.password;

  const existingUser = await getUserByUsername(username);

  if (!existingUser) {
    throw createError({
      statusMessage: 'Incorrect username or password',
      statusCode: 400,
    });
  }

  if (existingUser.role !== 1) {
    throw createError({
      statusMessage: 'Incorrect username or password',
      statusCode: 400,
    });
  }

  const validPassword = await new Argon2id().verify(existingUser.password, password);
  if (!validPassword) {
    throw createError({
      statusMessage: 'Incorrect username or password',
      statusCode: 400,
    });
  }

  const session = await lucia.createSession(existingUser.id, {});
  appendHeader(event, 'Set-Cookie', lucia.createSessionCookie(session.id).serialize());
});
