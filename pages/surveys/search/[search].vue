<template>
    <v-card min-height="100vh" color="#f4f4f4" class="">
        <v-row class="mx-1">
            <v-col md="2" sm="0">
                <bannar-slide></bannar-slide>
            </v-col>
            <v-col style="border: 1px solid #999" class="bg-white mb-5 my-sm-8 pa-0 pb-16" md="8" sm="11" cols="12">
                <div style="background-color: #fdf8ef; width: 100%" class="pa-3">
                    <div class="d-flex justify-space-between">
                        <span class="font-weight-bold pt-2 ml-5"><nuxt-link class="text-decoration-none font-weight-bold"
                                to="/surveys">استطلاعات</nuxt-link>
                            <span> / نتائج البحث / {{ route.params.search }}</span>

                        </span>

                        <div class="imageHolder pointer" @click="tryGoToAddSurvey">
                            <v-btn rounded="xl" prepend-icon="mdi-pencil-circle-outline" color="black">أضف استطلاعاً</v-btn>
                        </div>
                    </div>
                    <div class="d-flex justify-space-between mt-5">
                        <p class="font-weight-bold mt-3 ml-8 d-md-block d-none">
                            يحتوي على :
                            <span style="color: red"> {{ surveys.length }} استطلاعات</span>
                        </p>
                        <div class="d-flex">
                            <v-select label="Select" style="min-width: 200px; height: 45px" variant="outlined"
                                class="pa-0 ml-10" density="compact" v-model="filterSelect" item-title="name"
                                item-value="value" :items="[
                                    { name: 'الاحدث اولا', value: 'newest' },
                                    { name: 'الاقدم اولا', value: 'oldest' },
                                    { name: 'الاكثر مشاهدة', value: 'mostViews' },
                                    { name: 'الاقل مشاهدة', value: 'leastViews' },
                                    { name: 'الاكثر تفضيلا', value: 'mostFavioret' },
                                    { name: 'الاكثر تعليقا', value: 'mostCommentCount' },
                                    { name: 'الاقل تعليقا', value: 'leastCommentCount' },

                                ]">
                                <template v-slot:item="{ props }">
                                    <v-list-item v-bind="props" class="text-end"></v-list-item>
                                </template>
                            </v-select>
                        </div>
                        <v-text-field v-model="keyword" clearable
                            style="max-width: 170px; min-width: 150px; max-height: 40px" class="rounded-pill mt-1"
                            label="ابحث" density="compact" prepend-inner-icon="mdi-magnify" variant="outlined"
                            @keyup.enter="search()"></v-text-field>
                    </div>
                    <p class="font-weight-bold mt-3 ml-8 d-md-none d-block">
                        يحتوي على :
                        <span style="color: red"> {{ surveys.length }} استطلاعات</span>
                    </p>
                </div>
                <bannar-center></bannar-center>
                <v-card border class="mx-3 my-10 pa-5 d-flex" style="width: 97.5%; border-radius: 20px"
                    v-for="survey in currentSurveys" :key="survey.id">
                    <v-row class="pointer" @click="$router.push('/surveys/' + survey.id + '/show')">
                        <v-col cols="10">
                            <p class="text-h4 text-center mr-16">
                                {{ survey.question_name }}
                            </p>
                            <div class="d-flex">
                                <div class="imageHolder" style="width: 40px; height: 40px">
                                    <v-avatar>
                                        <v-img cover :src="survey.user.image"></v-img>
                                    </v-avatar>
                                </div>
                                <p class="align-self-center font-weight-bold mr-2">
                                    {{ survey.user.name }}
                                </p>

                                <!-- <v-banner border="none" lines="one" :text="blog.content" class="font-weight-black" >
                        </v-banner> -->
                                <hr style="border-top: 1px solid black" class="align-self-center flex-grow-1 ms-3" />
                                <!-- <v-divider class="border-opacity-100 align-self-center mr-3 " style="max-width: 75%; min-width: 75%;"></v-divider> -->
                            </div>
                            <div class="d-flex justify-end">
                                <div class="imageHolder ml-1 align-self-center" style="width: 15px; height: 15px">
                                    <v-img src="/images/تاريخ.png" style="width: 100%; height: 100%"></v-img>
                                </div>
                                <p class="text-body-2 ml-4 mt-1 align-self-center">
                                    {{
                                        new Date(survey.created_at).toLocaleDateString(['ban', 'id'], {
                                            hour12: false,
                                        })
                                    }}
                                </p>
                                <div class="imageHolder ml-1 align-self-center" style="width: 15px; height: 15px">
                                    <v-img src="/images/عدد-المشاهدات.png" style="width: 100%; height: 100%"></v-img>
                                </div>
                                <p class="text-body-2 ml-4 mt-1 align-self-center">
                                    {{ survey.question_views.question_views }}
                                </p>
                                <div class="imageHolder ml-1 align-self-center" style="width: 15px; height: 15px">
                                    <v-img src="/images/عدد-التعليقات.png" style="width: 100%; height: 100%"></v-img>
                                </div>
                                <p class="text-body-2 ml-4 mt-1 align-self-center">
                                    {{ survey.question_user_voit_count.number_user_voit }}
                                </p>
                                <div class="imageHolder ml-1 align-self-center" style="width: 15px; height: 15px">
                                    <v-img src="/images/قائمة-المفضلة-قبل-الضغط.png"
                                        style="width: 100%; height: 100%"></v-img>
                                </div>
                                <p class="text-body-2 mt-1 align-self-center">
                                    {{ survey.question_wish_list_count.question_wishlist_count }}
                                </p>
                            </div>
                        </v-col>
                        <v-col cols="2" align-self="center">
                            <v-avatar v-if="questionAlreadyVoit && questionAlreadyVoit.includes(survey.id)
                                " size="100" color="success" style="border: 2px solid black" text=" asdad">
                                <div class="">
                                    <v-icon icon="mdi-heart"></v-icon><br />أبديت رأيك
                                </div>
                            </v-avatar>
                            <v-avatar v-else size="100" color="white" style="border: 2px solid black">
                                لم تشارك بعد
                            </v-avatar>
                        </v-col>
                    </v-row>
                </v-card>
                <div class="text-center">
                    <v-btn variant="tonal" color="black" v-if="currentSurveys.length < surveys.length"
                        @click="pageNumber++">عرض المزيد</v-btn>
                </div>

                <v-alert class="ma-3" type="info" v-if="surveys.length === 0">لا يوجد استطلاعات لعرضها</v-alert>
                <div class="d-md-none d-block">
                    <bannar-center></bannar-center>
                    <!-- <bannar-center></bannar-center> -->
                </div>
            </v-col>
            <v-col md="2" sm="0">
                <bannar-slide></bannar-slide>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" transition="dialog-top-transition" width="auto">
            <v-card elevation="4" class="text-center" max-width="300">
                <v-card-text class="text-h6">
                    <v-card-title class="text-error text-h4">عفوا</v-card-title>
                    <div class="">
                        أنت لا تستطيع إضافة استطلاع يجب عليك تسجيل الدخول أولا
                    </div>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn variant="flat" color="success" @click="dialog = false">موافق</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>
          
<script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";

const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();
const route = useRoute();

const filterSelect = ref('newest');
// const categoryInfo = ref();
const pageNumber = ref(1);
const dialog = ref();

const itemPerPage = ref(5);
const surveys = ref();
const questionAlreadyVoit = ref();
const keyword = ref();
const fillterSurveys = computed(() => {
    if (filterSelect.value === "newest") {
        return surveys.value.sort(function (a: any, b: any): number {
            if (a.created_at < b.created_at) return 1;
            return -1;
        });
    } else if (filterSelect.value === "oldest") {
        return surveys.value.sort(function (a: any, b: any): number {
            if (a.created_at > b.created_at) return 1;
            return -1;
        });
    } else if (filterSelect.value === "mostViews") {
        return surveys.value.sort(function (a: any, b: any): number {
            if (a.question_views.question_views < b.question_views.question_views)
                return 1;
            return -1;
        });
    } else if (filterSelect.value === "leastViews") {
        return surveys.value.sort(function (a: any, b: any): number {
            if (a.question_views.question_views > b.question_views.question_views)
                return 1;
            return -1;
        });
    } else if (filterSelect.value === "mostFavioret") {
        return surveys.value.sort(function (a: any, b: any): number {
            if (
                a.question_wish_list_count.question_wishlist_count <
                b.question_wish_list_count.question_wishlist_count
            )
                return 1;
            return -1;
        });
    } else if (filterSelect.value === "mostCommentCount") {
        return surveys.value.sort(function (a: any, b: any): number {
            if (
                a.question_user_voit_count.number_user_voit <
                b.question_user_voit_count.number_user_voit
            )
                return 1;
            return -1;
        });
    } else if (filterSelect.value === "leastCommentCount") {
        return surveys.value.sort(function (a: any, b: any): number {
            if (
                a.question_user_voit_count.number_user_voit >
                b.question_user_voit_count.number_user_voit
            )
                return 1;
            return -1;
        });
    }
    return surveys.value;
});

const currentSurveys = computed(() => {
    return fillterSurveys.value.slice(0, itemPerPage.value * pageNumber.value);
});

const { data, error } = await useSendRequest<responseReturn>("/surveys/searchInSurveys", {
    keyword: route.params.search,
    token: authStore.token,
});
if (error.value) {
    setToastMessage("حدث خطأ ما");
} else {
    if (data.value?.status) {
        const dataReturend = data.value.data as any;
        // categoryInfo.value = dataReturend.category;
        surveys.value = dataReturend.data;
        questionAlreadyVoit.value = dataReturend.questionAlreadyVoit;
    }
}

function tryGoToAddSurvey() {
    if (authStore.isLogin) return navigateTo("/surveys/add");
    dialog.value = true;
}

function search() {
    if(keyword.value)
        navigateTo('/surveys/search/' + keyword.value)
    return;
}

useHead({
  title:'استطلاعات - نتائج بحث| ' + route.params.search,
  meta: [
    { name: "description", content: route.params.search },
    { property: "og:description", content: route.params.search  },
    { property: "og:image", content: '/images/استطلاعات.png' },
    { name: "twitter:card", content: "summay_large_image" },
    { property:'og:locale',content:'ar_ar'},
    { property:'og:url',content:'https://alqanoni.com/'},
    { property:'og:type',content:'website'}
  ],
  link:[{rel:'canonical',href:'https://alqanoni.com/'}],
});
</script>
          
<style scoped>
.pointer {
    cursor: pointer;
}
</style>