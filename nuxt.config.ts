// https://nuxt.com/docs/api/configuration/nuxt-config
import FrontiersPreset from '@frontiers/prime-preset';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@primevue/nuxt-module', '@nuxt/fonts', '@nuxt/eslint'],
  fonts: {
    families: [
      {
        name: 'Museo Sans',
        src: 'https://static2.frontiersin.org/static-resources/MuseoSans300.woff2',
        weight: 300,
        global: true,
      },
      {
        name: 'Museo Sans',
        src: 'https://static2.frontiersin.org/static-resources/MuseoSans500.woff2',
        weight: 500,
        global: true,
      },
      {
        name: 'Museo Sans',
        src: 'https://static2.frontiersin.org/static-resources/MuseoSans700.woff2',
        weight: 700,
        global: true,
      },
    ],
  },
  primevue: {
    options: {
      theme: {
        preset: FrontiersPreset,
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
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
