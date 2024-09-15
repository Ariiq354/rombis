export default defineEventHandler(async (event) => {
  if (!event.context.session) {
    throw createError({
      statusCode: 403,
    });
  }

  const res = await getAllPlace();
  const data = res.map((item) => {
    return {
      id: item.id,
      name: item.name,
      is_active: item.is_active,
    };
  });

  return data;
});
