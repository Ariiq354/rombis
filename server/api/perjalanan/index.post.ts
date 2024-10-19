import { z } from "zod";

const ticketSchema = z.object({
  id_ticket: z.string(),
  current: z.string(),
  seatPosition: z
    .object({
      id_ticketSeat: z.string(),
      seat: z.number(),
    })
    .array(),
});

export default defineEventHandler(async (event) => {
  privateFunction(event);

  const formData = await readBody(event);

  const res = ticketSchema.parse(formData);

  await updateTicket(res.id_ticket, {
    current: res.current,
  });

  res.seatPosition.forEach(async (item) => {
    await updateTicketSeat(item.id_ticketSeat, {
      seat: item.seat,
    });
  });

  return;
});
