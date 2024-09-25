export default defineEventHandler(async (event) => {
  privateFunction(event);

  const res = await getAllTicketSeat();
  const data = res.map((item) => {
    return {
      id: item.id,
      price: item.price,
      seat: item.seat,
      route: item.route,
      is_paid: item.is_paid,
      username: item.user.username,
    };
  });

  return data;
});
