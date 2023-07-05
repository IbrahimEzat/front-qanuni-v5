<template>
    <div class="bg-blue-grey-lighten-5">
        <v-row style="min-height: 800px">
            <v-col cols="2" class="ma-0">
                <!-- <bannar-slide></bannar-slide> -->
            </v-col>
            <v-col class="bg-white mt-sm-8 my-8 pa-0 mx-auto" md="8" sm="11" cols="11">
                <div style="background-color: #fdf8ef; width: 100%">
                    <p class="font-weight-bold pa-4">
                        معلومات حول الموقع
                    </p>
                </div>
                <bannar-center></bannar-center>

                <div v-html="content" class="content ma-5 "></div>
            </v-col>
            <v-col cols="2">
                <!-- <bannar-slide></bannar-slide> -->
            </v-col>
        </v-row>

    </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();

const content = ref();

const { data, error } = await useSendRequest('/staticPages/ShowAboutSite', {});

if (data.value?.status) {
    content.value = data.value.data.content;
} else {
    setToastMessage('حدث خظا ما');
}
useHead({
    title: 'القانوني - معلومات حول الموقع',
    meta: [
        { name: "description", content: 'تحتوي هذه الصفحة على معلومات حول الموقع' },
        { property: "og:description", content: 'تحتوي هذه الصفحة على معلومات حول الموقع' },
        { property: "og:image", content: '/images/مقالات.png' },
        { name: "twitter:card", content: "summay_large_image" },
        { property: 'og:locale', content: 'ar_ar' },
        { property: 'og:url', content: 'https://alqanoni.com/' },
        { property: 'og:type', content: 'website' }
    ],
    link: [{ rel: 'canonical', href: 'https://alqanoni.com/' }],
});
</script>


<style>
img {
    max-width: 100% !important;
    max-height: 400px !important;
}

.ql-editor {
    min-height: 100px;
}
</style>