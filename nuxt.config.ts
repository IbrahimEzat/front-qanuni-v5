import vuetify from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ['vuetify/styles/main.sass'],
    modules: [
        ["@pinia/nuxt", {
            autoImports: ["defineStore", "acceptHMRUpdate"]
        }],
        async (options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', config => config.plugins.push(vuetify()))
        }, 'nuxt-swiper'],
    alias: {
        pinia: '/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs',
    },
    build: {
        transpile: ["vuetify"],
    },
    sourcemap: false
})
