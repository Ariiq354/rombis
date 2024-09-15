export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },
  modules: ['@nuxt/ui', '@nuxt/image', 'nuxt-security', '@nuxtjs/google-fonts'],
  devtools: { enabled: true },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseAuthToken: process.env.DATABASE_AUTH_TOKEN,
  },

  nitro: {
    experimental: {
      openAPI: true,
    },
  },

  googleFonts: {
    families: {
      Poppins: true,
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
