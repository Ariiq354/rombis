import { verifyRequestOrigin } from "lucia";

import type { User, Session } from "lucia";

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== "GET") {
    const originHeader = getHeader(event, "Origin") ?? null;
    const hostHeader = getHeader(event, "Host") ?? null;
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      throw createError({
        statusCode: 403,
      });
    }
  }

  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    event.context.session = null;
    event.context.user = null;
    return;
  }
  await lucia.deleteExpiredSessions();
  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize()
    );
  }
  if (!session) {
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize()
    );
  }
  event.context.session = session;
  event.context.user = user;
});

declare module "h3" {
  interface H3EventContext {
    user: User | null;
    session: Session | null;
  }
}
