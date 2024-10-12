export default defineEventHandler(async (event) => {
  privateFunction(event);

  const dataTicket = await getAllTicket();

  const data = dataTicket.map((item) => {
    const busData = {
      description: item.bus.description,
      name: item.bus.name,
      route: item.bus.route,
      seat: item.bus.seat,
      type: item.bus.type,
      tikum: item.bus.tikum,
    };
    const ticketSeatData = item.ticketSeat.map((seatItem) => {
      return {
        id_ticketSeat: seatItem.id,
        name: seatItem.name,
        seat: seatItem.seat,
      };
    });

    return {
      id_ticket: item.id,
      date: item.date,
      current: item.current,
      bus: busData,
      filledSeat: ticketSeatData,
    };
  });

  return data;
});
