// https://nuxt.com/docs/api/configuration/nuxt-config
import FrotiersPreset from "@frontiers/prime-preset";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@primevue/nuxt-module"],
  primevue: {
    options: {
      theme: {
        preset: FrotiersPreset,
      },
    },
  },
  runtimeConfig: {
    jira: {
      baseUrl: process.env.JIRA_BASE_URL || "",
      clientId: process.env.JIRA_CLIENT_ID || "",
      clientSecret: process.env.JIRA_CLIENT_SECRET || "",
      refreshIntervalMs: Number(process.env.JIRA_REFRESH_INTERVAL_MS || 300000),
    },
    public: {
      jira: {
        refreshIntervalMs: Number(process.env.JIRA_REFRESH_INTERVAL_MS || 300000),
      },
    },
  },
});
