<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError
}>()
</script>

<template>
  <section
    class="relative flex min-h-screen items-center justify-center overflow-hidden text-green-500"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 960 540"
      class="absolute w-full"
    >
      <path
        d="m0 406 22.8 7.7c22.9 7.6 68.5 23 114.2 22s91.3-18.4 137-28.4 91.3-12.6 137.2-3.3c45.8 9.3 91.8 30.7 137.6 40.7 45.9 10 91.5 8.6 137.2-5.9s91.3-42.1 137-51.8 91.3-1.3 114.2 2.8L960 394v147H0Z"
        fill="currentColor"
      />
    </svg>

    <div class="z-10 text-center">
      <h1 class="mb-6 text-8xl font-bold text-slate-900 dark:text-white">
        {{ error?.statusCode }}
      </h1>
      <p
        class="mb-8 mt-0 text-xl font-medium leading-normal text-slate-700 dark:text-slate-100"
      >
        {{ error?.statusMessage }}
      </p>

      <UButton to="/">Go Home</UButton>
    </div>
  </section>
</template>
