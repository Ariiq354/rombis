import { z } from 'zod';
import { deleteUser } from '~~/server/utils/user';

const deleteSchema = z.object({
  id: z.array(z.string()),
});

export default defineEventHandler(async (event) => {
  if (!event.context.session) {
    throw createError({
      statusCode: 403,
    });
  }

  const formData = await readBody(event);

  const res = deleteSchema.parse(formData);

  await deleteUser(res.id);

  return;
});