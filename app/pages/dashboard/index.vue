<script setup lang="ts">
  async function logout() {
    await $fetch('/api/auth/logout', {
      method: 'POST',
    });
    await navigateTo('/');
  }
</script>

<template>
  <div>Ini dashboard</div>
  <form @submit.prevent="logout">
    <UButton type="submit">Sign out</UButton>
  </form>
</template>
