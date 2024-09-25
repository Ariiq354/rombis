export default defineEventHandler(async (event) => {
  publicFunction(event);

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
