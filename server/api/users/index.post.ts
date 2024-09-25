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
  privateFunction(event);

  const formData = await readValidatedBody(event, (body) => userSchema.parse(body));
  const res = {
    ...formData,
    password: await new Argon2id().hash(formData.password),
  };

  const exist = await getUserByUsername(res.username);
  if (res.id) {
    if (exist && exist.id !== res.id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username already exist',
      });
    }
    await updateUser(res.id, res);
  } else {
    if (exist) {
      throw createError({
        statusCode: 400,
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
