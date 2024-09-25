export default eventHandler(async (event) => {
  publicFunction(event);

  await lucia.invalidateSession(event.context.session!.id);
  appendHeader(event, 'Set-Cookie', lucia.createBlankSessionCookie().serialize());
});
