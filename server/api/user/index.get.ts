export default defineEventHandler(async (event) => {
  if (event.context.user?.role !== 1) {
    throw createError({
      statusCode: 403,
    });
  }

  const res = await getAllUser();
  const data = res.map((item) => {
    return {
      id: item.id,
      username: item.username,
      is_active: item.is_active,
    };
  });

  return data;
});
