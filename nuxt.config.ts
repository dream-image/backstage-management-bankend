// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path"
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  alias: {
    '@': resolve(__dirname, "/")
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  css: ["~/assets/main.scss"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},

    },
  },
  modules: [
    '@element-plus/nuxt'
  ],
  devServer:{
    port:3001
  }

})
