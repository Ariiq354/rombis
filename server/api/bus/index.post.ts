import { generateIdFromEntropySize } from 'lucia';
import { z } from 'zod';

const busSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  route: z.string().array(),
});

export default defineEventHandler(async (event) => {
  if (event.context.user?.role !== 1) {
    throw createError({
      statusCode: 403,
    });
  }

  const formData = await readBody(event);

  const res = busSchema.parse(formData);

  if (res.id) {
    await updateBus(res.id, res);
  } else {
    const newData = {
      ...res,
      id: generateIdFromEntropySize(10),
    };
    await createBus(newData);
  }

  return;
});
