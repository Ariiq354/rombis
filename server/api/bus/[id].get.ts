export default defineEventHandler(async (event) => {
  if (!event.context.session) {
    throw createError({
      statusCode: 403,
    });
  }

  const id = getRouterParam(event, 'id');
  if (id) {
    const res = await getBusById(id);
    if (res) {
      const ticketData = res.ticket.map((item) => {
        return {
          id: item.id,
          price: item.price,
          date: item.date,
          time: item.time,
        };
      });

      return {
        id: res.id,
        name: res.name,
        description: res.description,
        route: res.route,
        type: res.type,
        seat: res.seat,
        ticket: ticketData,
      };
    }
  }
  return;
});
