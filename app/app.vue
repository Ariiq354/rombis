<script setup lang="ts">
  useSeoMeta({
    title: 'Rombis Lajon',
    ogTitle: 'Rombis Lajon',
    description: 'Pesan tiket bis untuk rombonganmu!',
    ogDescription: 'Pesan tiket bis untuk rombonganmu!',
    ogImage:
      'https://i.ytimg.com/vi/vQxPS06X-IA/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgZShMMA8=&rs=AOn4CLBdvY4fpi7a4lMpntUonkvhACSjsw',
    twitterCard: 'summary_large_image',
    ogUrl: 'asd',
    twitterTitle: 'Rombis Lajon',
    twitterDescription: 'Pesan tiket bis untuk rombonganmu!',
    twitterImage:
      'https://i.ytimg.com/vi/vQxPS06X-IA/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgZShMMA8=&rs=AOn4CLBdvY4fpi7a4lMpntUonkvhACSjsw',
  });

  useHead({
    htmlAttrs: {
      lang: 'id',
    },
    link: [
      {
        rel: 'icon',
        type: 'image/ico',
        href: '/favicon.ico',
      },
    ],
  });
</script>

<template>
  <div class="font-Poppins">
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>
