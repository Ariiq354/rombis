import { generateIdFromEntropySize } from 'lucia';
import { z } from 'zod';

const ticketSchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  id_bus: z.string(),
  price: z.number().array(),
  time: z.string().array(),
});

export default defineEventHandler(async (event) => {
  privateFunction(event);

  const formData = await readBody(event);

  const res = ticketSchema.parse(formData);

  if (res.id) {
    await updateTicket(res.id, res);
  } else {
    const newData = {
      ...res,
      id: generateIdFromEntropySize(10),
    };
    await createTicket(newData);
  }

  return;
});
