export default defineEventHandler(async (event) => {
  publicFunction(event);

  const id_user = getRouterParam(event, "id_user");
  if (id_user) {
    const res = await getTicketSeatByUserId(id_user);
    if (res) {
      const data = res.map((item) => {
        const ticketData = {
          date: item.ticket.date,
          time: item.ticket.time,
          current: item.ticket.current,
          bus: {
            name: item.ticket.bus.name,
            description: item.ticket.bus.description,
          },
        };

        return {
          id: item.id,
          price: item.price,
          seat: item.seat,
          name: item.name,
          is_paid: item.is_paid,
          route: item.route,
          ticket: ticketData,
          created_at: item.createdAt,
        };
      });

      return data;
    }
  }
  return;
});
