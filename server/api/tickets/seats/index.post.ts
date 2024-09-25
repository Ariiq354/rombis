import { generateIdFromEntropySize } from 'lucia';
import { z } from 'zod';

const ticketSchema = z.object({
  id_ticket: z.string(),
  id_user: z.string(),
  price: z.number(),
  seat: z.number(),
  route: z.tuple([z.string(), z.string()]),
});

export default defineEventHandler(async (event) => {
  publicFunction(event);

  const formData = await readBody(event);

  const res = ticketSchema.parse(formData);

  const newData = {
    ...res,
    id: generateIdFromEntropySize(10),
  };
  await createTicketSeat(newData);

  return;
});
