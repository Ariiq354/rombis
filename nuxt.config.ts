export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@nuxt/ui", "nuxt-security", "@nuxt/fonts"],
  devtools: { enabled: true },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseAuthToken: process.env.DATABASE_AUTH_TOKEN,
  },

  routeRules: {
    "/dashboard": { redirect: "/dashboard/user" },
    "/dashboard/laporan": { redirect: "/dashboard/user" },
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === "development" ? "unsafe-none" : "require-corp",
    },
  },
});
