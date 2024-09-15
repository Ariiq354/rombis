export default defineEventHandler(async (event) => {
  if (event.context.user?.role !== 1) {
    throw createError({
      statusCode: 403,
    });
  }

  const res = await getAllBus();
  const data = res.map((item) => {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      route: item.route,
    };
  });

  return data;
});
