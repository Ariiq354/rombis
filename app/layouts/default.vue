<script setup lang="ts">
  const sidebarOpenState = ref(true);

  const user = useUser();

  function toggleSidebar() {
    sidebarOpenState.value = !sidebarOpenState.value;
  }

  async function logout() {
    try {
      await $fetch("/api/auth/logout", {
        method: "POST",
      });
      user.value = null;
      await navigateTo("/");
    } catch (error: unknown) {
      if (isNuxtError(error)) {
        useToastError(String(error.statusCode), error.statusMessage);
      }
    }
  }
</script>

<template>
  <section class="flex">
    <AppSidebar :sidebar-toggle="sidebarOpenState" />
    <div
      class="flex flex-1 flex-col overflow-auto p-8 transition-all duration-200"
      :class="{ 'ml-72': sidebarOpenState }"
    >
      <AppTopbar :logout="logout" :toggle-sidebar="toggleSidebar" />
      <div>
        <slot />
      </div>
    </div>
  </section>
</template>
