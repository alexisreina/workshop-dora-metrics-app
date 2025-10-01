// https://nuxt.com/docs/api/configuration/nuxt-config
import FrotiersPreset from "@frontiers/prime-preset";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@primevue/nuxt-module'
  ],  
  primevue: {
    options: {
      theme: {
        preset: FrotiersPreset
      }
    }
  }
})
