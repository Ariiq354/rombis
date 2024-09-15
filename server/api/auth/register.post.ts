import { generateIdFromEntropySize } from 'lucia';
import { Argon2id } from 'oslo/password';
import { z } from 'zod';

const userSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  const formData = await readBody(event);

  const parseRes = userSchema.parse(formData);
  const res = {
    ...parseRes,
    password: await new Argon2id().hash(parseRes.password),
  };

  const exist = await getUserByUsername(res.username);
  if (exist) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Username already exist',
    });
  }

  const newData = {
    ...res,
    id: generateIdFromEntropySize(10),
  };
  await createUser(newData);

  return;
});
