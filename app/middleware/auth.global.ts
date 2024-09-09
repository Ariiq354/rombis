export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUser();
  const data: any = await useRequestFetch()('/api/auth/user');
  if (data) {
    user.value = data;
  }
  const currentRoute = to.fullPath;
  if (!data && currentRoute.includes('/dashboard')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthenticated',
    });
  }
});
