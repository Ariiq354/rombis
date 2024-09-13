<script setup lang="ts">
  const sidebarOpenState = ref(true);

  const user = useUser();

  function toggleSidebar() {
    sidebarOpenState.value = !sidebarOpenState.value;
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
      });
      user.value = null;
      await navigateTo('/');
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal server error',
      });
    }
  }
</script>

<template>
  <section class="flex">
    <AppSidebar :sidebarOpenState="sidebarOpenState" />
    <div class="flex w-full flex-1 flex-col bg-slate-200 p-4 dark:bg-black">
      <AppTopbar :logout="logout" :toggleSidebar="toggleSidebar" />
      <div class="p-4">
        <slot />
      </div>
    </div>
  </section>
</template>
