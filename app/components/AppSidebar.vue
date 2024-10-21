<script setup lang="ts">
  defineProps<{
    sidebarToggle: boolean;
  }>();

  const sidebarItems = [
    {
      title: "User",
      items: [
        {
          title: "User",
          link: "/dashboard/user",
          icon: "i-heroicons-user",
        },
        {
          title: "Pemesanan",
          link: "/dashboard/pemesanan",
          icon: "i-heroicons-shopping-cart",
        },
        {
          title: "Detail Perjalanan",
          link: "/dashboard/perjalanan",
          icon: "i-heroicons-rocket-launch",
        },
      ],
    },
    {
      title: "Ticket",
      items: [
        {
          title: "Ticket",
          link: "/dashboard/ticket",
          icon: "i-heroicons-ticket",
        },
        {
          title: "Bus",
          link: "/dashboard/bus",
          icon: "i-heroicons-map-pin",
        },
      ],
    },
  ];
</script>

<template>
  <div
    id="sidebar"
    class="fixed top-0 h-full overflow-hidden border-r border-gray-200 bg-white shadow-xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-900"
    :class="sidebarToggle ? 'w-72' : 'w-0'"
  >
    <div class="text-primary flex items-center justify-center pb-8 pt-10">
      <div class="flex items-center gap-2 text-2xl tracking-widest">
        <UIcon name="i-heroicons-globe-alt" class="h-8 w-8" />
        <span>ROMBIS</span>
      </div>
    </div>
    <div v-for="(firstItem, firstIndex) in sidebarItems" :key="firstIndex">
      <h1 class="text-primary px-8 py-4 text-sm font-bold uppercase">
        {{ firstItem.title }}
      </h1>
      <AppSidebarItem :link-item-prop="firstItem.items" :depth="0" />
    </div>
  </div>
</template>
