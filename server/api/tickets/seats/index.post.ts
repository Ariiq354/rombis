import { z } from "zod";

const ticketSchema = z.object({
  ticketId: z.string(),
  userId: z.string(),
  price: z.number(),
  name: z.string().array(),
  seat: z.number().array(),
  tikum: z.string().array(),
  route: z.tuple([z.string(), z.string()]),
});

export default defineEventHandler(async (event) => {
  publicFunction(event);

  const formData = await readBody(event);

  const res = ticketSchema.parse(formData);

  res.seat.forEach(async (item, index) => {
    const name = res.name[index] ? res.name[index] : "";
    const tikum = res.tikum[index] ? res.tikum[index] : "";

    const itemData = {
      ...res,
      seat: item,
      name: name,
      tikum: tikum,
      id: generateIdFromEntropySize(10),
    };

    await createTicketSeat(itemData);
  });

  return;
});
