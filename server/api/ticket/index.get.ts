export default defineEventHandler(async (event) => {
  if (!event.context.session) {
    throw createError({
      statusCode: 403,
    });
  }

  const res = await getAllTicket();
  const data = res.map((item) => {
    const busData = {
      desciption: item.bus.description,
      name: item.bus.name,
      route: item.bus.route,
      seat: item.bus.seat,
      type: item.bus.type,
    };
    const ticketSeatData = item.ticketSeat.map((seatItem) => {
      return seatItem.seat;
    });

    return {
      id: item.id,
      id_bus: item.id_bus,
      date: item.date,
      price: item.price,
      time: item.time,
      bus: busData,
      filledSeat: ticketSeatData,
    };
  });

  return data;
});
