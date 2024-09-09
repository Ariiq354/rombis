export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },
  modules: ['@nuxt/ui', '@nuxt/image', 'nuxt-security'],
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Rombis Lajon',
    },
  },

  icon: {
    serverBundle: {
      collections: ['heroicons'],
    },
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
    },
  },
});
