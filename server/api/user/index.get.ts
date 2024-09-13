export default defineEventHandler(async (event) => {
  if (!event.context.session) {
    throw createError({
      statusCode: 403,
    });
  }

  const res = await getAllUser();
  const data = res.map((item) => {
    return {
      id: item.id,
      username: item.username,
      status: item.status,
    };
  });

  return data;
});
