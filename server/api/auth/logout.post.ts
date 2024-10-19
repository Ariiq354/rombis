export default eventHandler(async (event) => {
  publicFunction(event);

  await invalidateSession(event.context.session!.id);
  deleteSessionTokenCookie(event);
});
