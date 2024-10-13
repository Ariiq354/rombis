export default defineEventHandler((event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 404,
      statusMessage: "Session doesn't exist or not found",
    });
  }

  return event.context.user;
});
