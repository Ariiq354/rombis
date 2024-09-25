import type { H3Event } from 'h3';

export function privateFunction(event: H3Event) {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthenticated',
    });
  }

  if (event.context.user.role !== 1) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized',
    });
  }
}

export function publicFunction(event: H3Event) {
  if (!event.context.session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthenticated',
    });
  }
}
