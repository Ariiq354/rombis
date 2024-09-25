import { z } from "zod";

const ticketSchema = z.object({
  id: z.string(),
  id_paid: z.boolean(),
});

export default defineEventHandler(async (event) => {
  privateFunction(event);

  const formData = await readBody(event);

  const res = ticketSchema.parse(formData);

  await updateTicketSeat(res.id, res);

  return;
});
