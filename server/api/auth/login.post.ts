import { Argon2id } from "oslo/password";
import { z } from "zod";

const loginSchema = z
  .object({
    username: z.string(),
    password: z.string().min(8),
    rememberMe: z.boolean().optional(),
  })
  .strict();

export default eventHandler(async (event) => {
  const formData = await readBody(event);

  const res = loginSchema.parse(formData);

  const username = res.username;
  const password = res.password;

  const existingUser = await getUserByUsername(username);

  if (!existingUser) {
    throw createError({
      statusMessage: "Username atau password salah",
      statusCode: 400,
    });
  }

  const validPassword = await new Argon2id().verify(
    existingUser.password,
    password
  );
  if (!validPassword) {
    throw createError({
      statusMessage: "Username atau password salah",
      statusCode: 400,
    });
  }

  const session = await lucia.createSession(existingUser.id, {});
  if (res.rememberMe) {
    await extendSession(session.id, 2629743);
  }
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize()
  );

  return {
    authSession: session,
  };
});
