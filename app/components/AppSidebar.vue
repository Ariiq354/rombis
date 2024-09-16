<script setup lang="ts">
  defineProps<{
    sidebarOpenState: boolean;
  }>();

  const route = useRoute();

  const sidebarItems = [
    {
      title: 'Dashboards',
      items: [
        {
          title: 'Dashboard',
          link: '/dashboard',
          icon: 'i-heroicons-home',
        },
        {
          title: 'Laporan',
          link: '/dashboard/laporan',
          icon: 'i-heroicons-presentation-chart-bar',
        },
      ],
    },
    {
      title: 'User',
      items: [
        {
          title: 'User',
          link: '/dashboard/user',
          icon: 'i-heroicons-user',
        },
        {
          title: 'Pemesanan',
          link: '/dashboard/pemesanan',
          icon: 'i-heroicons-shopping-cart',
        },
      ],
    },
    {
      title: 'Ticket',
      items: [
        {
          title: 'Ticket',
          link: '/dashboard/ticket',
          icon: 'i-heroicons-ticket',
        },
        {
          title: 'Bus',
          link: '/dashboard/bus',
          icon: 'i-heroicons-map-pin',
        },
      ],
    },
  ];
</script>

<template>
  <div
    id="sidebar"
    class="sticky top-0 h-screen overflow-hidden border-slate-700 bg-white shadow-lg transition-all duration-200 dark:border-r dark:bg-slate-900"
    :class="sidebarOpenState ? 'w-72' : 'w-0'"
  >
    <div
      class="flex h-24 items-center justify-center gap-2 text-3xl font-semibold tracking-widest text-green-500"
    >
      <UIcon name="i-heroicons-globe-alt" class="h-9 w-9" />
      <span>ROMBIS</span>
    </div>
    <div v-for="(item, index) in sidebarItems" :key="index">
      <h1 class="px-7 py-4 text-xs font-bold uppercase text-green-500">
        {{ item.title }}
      </h1>
      <div v-for="(childrenItem, index) in item.items" :key="index">
        <NuxtLink
          class="flex w-full items-center gap-2 px-7 py-3 text-base transition-all duration-200 hover:bg-slate-100"
          :to="childrenItem.link"
        >
          <UIcon :name="childrenItem.icon" class="h-4 w-4" />
          <p
            class="tracking-wide"
            :class="{ 'font-semibold': route.fullPath === childrenItem.link }"
          >
            {{ childrenItem.title }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
