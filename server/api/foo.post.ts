export default defineEventHandler((event) => {
  throw createError({
    statusCode: 500,
    statusMessage: 'Internal server error',
  });
});
