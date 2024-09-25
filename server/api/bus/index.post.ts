import { generateIdFromEntropySize } from 'lucia';
import { z } from 'zod';

const busSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  route: z.string().array(),
  type: z.union([z.literal('2x2'), z.literal('1x1'), z.literal('2x3'), z.literal('1x2')]),
  seat: z.number(),
});

export default defineEventHandler(async (event) => {
  privateFunction(event);

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
