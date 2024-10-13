import { z } from "zod";
import { updatePaidStatus } from "~~/server/utils/data-access/ticketSeat";

const ticketSchema = z.object({
  price: z.number(),
  created_at: z.string(),
  is_paid: z.number(),
});

export default defineEventHandler(async (event) => {
  publicFunction(event);

  const formData = await readBody(event);

  const res = ticketSchema.parse(formData);

  await updatePaidStatus(res.price, res.created_at, res.is_paid);

  return;
});
