import type { User } from "lucia";

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUser();
  const data: User = await useRequestFetch()("/api/auth/session");
  if (data) {
    user.value = data;
  }
  const currentRoute = to.fullPath;
  if (!data && currentRoute.includes("/dashboard")) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthenticated",
    });
  }
});
