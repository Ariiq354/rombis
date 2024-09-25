import { z } from "zod";

const querySchema = z
  .object({
    is_available: z.boolean().optional(),
  })
  .strict();

export default defineEventHandler(async (event) => {
  publicFunction(event);

  const res = await getValidatedQuery(event, (query) =>
    querySchema.parse(query)
  );

  const id = getRouterParam(event, "id");
  if (id) {
    const busData = await getBusById(id, res.is_available);
    if (busData) {
      const ticketData = busData.ticket.map((item) => {
        return {
          id: item.id,
          price: item.price,
          date: item.date,
          time: item.time,
        };
      });

      return {
        id: busData.id,
        name: busData.name,
        description: busData.description,
        route: busData.route,
        type: busData.type,
        seat: busData.seat,
        ticket: ticketData,
      };
    }
  }
  return;
});
