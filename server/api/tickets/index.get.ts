import { z } from "zod";

const querySchema = z
  .object({
    is_available: z.coerce.boolean().optional(),
  })
  .strict();

export default defineEventHandler(async (event) => {
  publicFunction(event);

  const res = await getValidatedQuery(event, (query) =>
    querySchema.parse(query)
  );

  const dataTicket = await getAllTicket(res.is_available);

  const data = dataTicket.map((item) => {
    const busData = {
      description: item.bus.description,
      name: item.bus.name,
      route: item.bus.route,
      tikum: item.bus.tikum,
      seat: item.bus.seat,
      type: item.bus.type,
    };
    const ticketSeatData = item.ticketSeat.map((seatItem) => {
      return seatItem.seat;
    });

    return {
      id: item.id,
      busId: item.busId,
      date: item.date,
      price: item.price,
      current: item.current,
      time: item.time,
      bus: busData,
      filledSeat: ticketSeatData,
    };
  });

  return data;
});
