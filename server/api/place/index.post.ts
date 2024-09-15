import { generateIdFromEntropySize } from 'lucia';
import { z } from 'zod';

const placeSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  is_active: z.boolean(),
});

export default defineEventHandler(async (event) => {
  if (event.context.user?.role !== 1) {
    throw createError({
      statusCode: 403,
    });
  }

  const formData = await readBody(event);

  const res = placeSchema.parse(formData);

  if (res.id) {
    await updatePlace(res.id, res);
  } else {
    const newData = {
      ...res,
      id: generateIdFromEntropySize(10),
    };
    await createPlace(newData);
  }

  return;
});
