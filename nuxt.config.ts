// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  future: {
    compatibilityVersion: 4,
  },

  icon: {
    serverBundle: {
      collections: ['heroicons'],
    },
  },

  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image', 'nuxt-security'],
});
