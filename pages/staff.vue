<template>
    <div class="bg-blue-grey-lighten-5">
        <v-row style="min-height: 800px">
            <v-col cols="2" class="ma-0">
                <bannar-slide></bannar-slide>
            </v-col>
            <v-col class="bg-white mt-sm-8 my-8 pa-0 mx-auto" md="8" sm="11" cols="11">
                <div style="background-color: #fdf8ef; width: 100%">
                    <p class="font-weight-bold pa-4">
                        طاقم الموقع
                    </p>
                </div>
                <bannar-center></bannar-center>

                <v-row class="ma-2"  style="background-color: rgb(248, 247, 247);">
                    <v-col md="2" sm="3" cols="6" v-for="(item, index) in members" :key="index">
                        <div class="text-center">
                            <v-avatar size="100" class="">
                                <v-img :src="item.image" cover></v-img>
                            </v-avatar>
                            <p>{{item.name}}</p>
                            <p>{{item.job}}</p>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="2">
                <bannar-slide></bannar-slide>
            </v-col>
        </v-row>

    </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();

const members = ref([]);

const { data, error } = await useSendRequest('/getAllMember', {});
if (!error.value && data.value?.status) {
    members.value = data.value.data
}else
 setToastMessage('حدث خظا ما');

useHead({
    title: 'القانوني - طاقم الموقع',
    meta: [
        { name: "description", content: 'تحتوي هذه الصفحة على طافم الموقع' },
        { property: "og:description", content: 'تحتوي هذه الصفحة على طافم الموقع' },
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