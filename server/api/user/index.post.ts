import { generateIdFromEntropySize } from 'lucia';
import { z } from 'zod';
import { createUser, updateUser } from '~~/server/utils/user';

const userSchema = z.object({
  id: z.string().optional(),
  username: z.string(),
  password: z.string().min(8),
  status: z.number().optional(),
});

export default defineEventHandler(async (event) => {
  if (!event.context.session) {
    throw createError({
      statusCode: 403,
    });
  }

  const formData = await readBody(event);

  const res = userSchema.parse(formData);

  const exist = await getUserByUsername(res.username);
  if (exist) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Username already exist',
    });
  }

  if (res.id) {
    await updateUser(res.id, res);
  } else {
    const newData = {
      ...res,
      id: generateIdFromEntropySize(10),
    };
    await createUser(newData);
  }

  return;
});
