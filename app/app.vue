<script setup lang="ts">
  useSeoMeta({
    title: "Rombis Lajon",
    ogTitle: "Rombis Lajon",
    description: "Pesan tiket bis untuk rombonganmu!",
    ogDescription: "Pesan tiket bis untuk rombonganmu!",
    ogImage:
      "https://i.ytimg.com/vi/vQxPS06X-IA/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgZShMMA8=&rs=AOn4CLBdvY4fpi7a4lMpntUonkvhACSjsw",
    twitterCard: "summary_large_image",
    ogUrl: "asd",
    twitterTitle: "Rombis Lajon",
    twitterDescription: "Pesan tiket bis untuk rombonganmu!",
    twitterImage:
      "https://i.ytimg.com/vi/vQxPS06X-IA/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgZShMMA8=&rs=AOn4CLBdvY4fpi7a4lMpntUonkvhACSjsw",
  });

  useHead({
    htmlAttrs: {
      lang: "id",
    },
    link: [
      {
        rel: "icon",
        type: "image/ico",
        href: "/favicon.ico",
      },
    ],
  });
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-black">
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator :height="5" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
    <UModals />
  </div>
</template>

<style>
  html {
    font-family: Poppins, sans-serif;
    font-size: 14px;
  }
</style>
