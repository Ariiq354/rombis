import { generateIdFromEntropySize } from "lucia";
import { z } from "zod";

const ticketSchema = z.object({
  id_ticket: z.string(),
  id_user: z.string(),
  price: z.number(),
  seat: z.number().array(),
  route: z.tuple([z.string(), z.string()]),
});

export default defineEventHandler(async (event) => {
  publicFunction(event);

  const formData = await readBody(event);

  const res = ticketSchema.parse(formData);

  res.seat.forEach(async (item) => {
    const itemData = {
      ...res,
      seat: item,
      id: generateIdFromEntropySize(10),
    };

    await createTicketSeat(itemData);
  });

  return;
});
