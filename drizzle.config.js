/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./server/database/schema/*",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: "file:test.db",
  },
};
