export default defineEventHandler(async (event) => {
  if (event.context.user?.role !== 1) {
    throw createError({
      statusCode: 403,
    });
  }

  const res = await getAllTicketSeat();
  const data = res.map((item) => {
    return {
      id: item.id,
      price: item.price,
      seat: item.seat,
      route: item.route,
      is_paid: item.is_paid,
      user_name: item.user.username,
    };
  });

  return data;
});
