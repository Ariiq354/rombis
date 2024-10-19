export default defineEventHandler(async (event) => {
  privateFunction(event);

  const res = await getAllTicketSeat();
  const data = res.map((item) => {
    return {
      id: item.ticket_seat.id,
      price: item.ticket_seat.price,
      seat: item.ticket_seat.seat,
      route: item.ticket_seat.route,
      isPaid: item.ticket_seat.isPaid,
      created_at: item.ticket_seat.createdAt.slice(0, 10),
      username: item.user?.username,
    };
  });

  return data;
});
