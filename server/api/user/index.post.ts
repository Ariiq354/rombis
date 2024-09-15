import { generateIdFromEntropySize } from 'lucia';
import { Argon2id } from 'oslo/password';
import { z } from 'zod';

const userSchema = z.object({
  id: z.string().optional(),
  username: z.string(),
  password: z.string().min(8),
  is_active: z.boolean(),
});

export default defineEventHandler(async (event) => {
  if (event.context.user?.role !== 1) {
    throw createError({
      statusCode: 403,
    });
  }

  const formData = await readBody(event);

  const parseRes = userSchema.parse(formData);
  const res = {
    ...parseRes,
    password: await new Argon2id().hash(parseRes.password),
  };

  if (res.id) {
    const exist = await getUserByUsername(res.username);
    if (exist) {
      if (exist.id !== res.id) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Username already exist',
        });
      }
    }
    await updateUser(res.id, res);
  } else {
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
  }

  return;
});
