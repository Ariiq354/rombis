import { z } from 'zod';

const deleteSchema = z.object({
  id: z.array(z.string()),
});

export default defineEventHandler(async (event) => {
  if (event.context.user?.role !== 1) {
    throw createError({
      statusCode: 403,
    });
  }

  const formData = await readBody(event);

  const res = deleteSchema.parse(formData);

  await deleteTicket(res.id);

  return;
});
