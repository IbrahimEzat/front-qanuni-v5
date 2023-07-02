import { createVuetify, ThemeDefinition } from 'vuetify'
import "@mdi/font/css/materialdesignicons.css";

export default defineNuxtPlugin(nuxtApp => {
    const myAllBlackTheme: ThemeDefinition = {
        dark: false,
        // colors: {
        //     background: "#546545",
        //     surface: "#925155",
        //     primary: "#aaa123",
        //     "primary-darken-1": "#5878aa",
        //     secondary: "#5568af",
        //     "secondary-darken-1": "#dfa235",
        //     error: "#000000",
        //     info: "#000000",
        //     success: "#000000",
        //     warning: "#356aff",
        // },
    };
    
    const vuetify = createVuetify({
        ssr:true,
        theme: {
            defaultTheme: "myAllBlackTheme",
            themes: {
                myAllBlackTheme,
            },
        }
    })
    nuxtApp.vueApp.use(vuetify)
})