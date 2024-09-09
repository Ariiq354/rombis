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
      ],
    },
  ];
</script>

<template>
  <div
    id="sidebar"
    class="h-screen overflow-hidden border-slate-700 bg-white shadow-lg transition-all duration-200 dark:border-r dark:bg-slate-900"
    :class="sidebarOpenState ? 'w-72' : 'w-0'"
  >
    <div
      class="flex h-16 items-center justify-center gap-2 text-3xl font-semibold tracking-widest text-green-500"
    >
      <UIcon name="i-heroicons-globe-alt" class="h-9 w-9" />
      <span>ROMBUS</span>
    </div>
    <div v-for="(item, index) in sidebarItems" :key="index">
      <h1 class="px-6 py-2 text-xs font-bold uppercase tracking-wide text-green-500">
        {{ item.title }}
      </h1>
      <div v-for="(childrenItem, index) in item.items" :key="index">
        <NuxtLink
          class="flex w-full items-center gap-2 px-6 py-2 text-base text-green-500 transition-all duration-200 hover:bg-slate-100"
          :to="childrenItem.link"
        >
          <UIcon :name="childrenItem.icon" />
          <p
            class="tracking-wide text-black"
            :class="{ 'font-semibold': route.fullPath === childrenItem.link }"
          >
            {{ childrenItem.title }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
