<template>
    <v-card v-if="competitions" min-height="100vh" color="#f4f4f4" class="">
        <v-row class="mx-1">
            <v-col md="2" sm="0">
                <bannar-slide></bannar-slide>
            </v-col>
            <v-col style="border: 1px solid #999" class="bg-white mb-5 mt-sm-8 pa-0 pb-16" md="8" sm="11" cols="12">
                <div style="background-color: #fdf8ef; width: 100%" class="pa-3">
                    <div class="d-flex justify-space-between">
                        <span class="font-weight-bold pt-2 ml-5"><nuxt-link class="text-decoration-none font-weight-bold"
                                to="/competitions">مسابقات / </nuxt-link>
                                <span>نتائج بحث </span>
                            <span >/ {{ route.params.search }} </span></span>

                    </div>
                    <div class="d-flex justify-space-between mt-5">
                        <p class="font-weight-bold mt-3 ml-8 d-md-block d-none">
                            يحتوي على :
                            <span style="color: red">{{ competitions.length }} مسابقات</span>
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
                                    { name: 'الاكثر مشاركة', value: 'mostCommentCount' },
                                    { name: 'الاقل مشاركة', value: 'leastCommentCount' },

                                ]">
                                <template v-slot:item="{ props }">
                                    <v-list-item v-bind="props" class="text-end"></v-list-item>
                                </template>
                            </v-select>
                        </div>
                        <v-text-field clearable style="max-width: 250px; min-width: 150px; max-height: 40px" class="rounded-pill mt-1"
            label="ابحث" density="compact" v-model="search" @keyup.enter.prevent="goToSearch"
            prepend-inner-icon="mdi-magnify" variant="outlined"></v-text-field>
                    </div>

                </div>
                <bannar-center></bannar-center>
                <v-container>
                    <v-row>
                        <v-col cols="12" md="6" v-for=" competition in currentCompetition" :key="competition.id">
                            <v-card class="rounded-xl ps-2 pb-3 mb-5" @click="$router.push('/competitions/view/'+competition.id)"
                                style="background-color: #fdf8ef;border: 1px rgb(231, 183, 94) solid ;cursor: pointer;">
                                <p class="text-h6 font-weight-black text-center pt-3 pb-4">{{ competition.title }}</p>
                                <div class="d-flex justify-space-between mb-4">
                                    <div style="font-size: 14px;" class="">
                                        <div>
                                            <v-icon size="large" icon="mdi-timer-sand-complete" class="me-2"></v-icon>
                                            <span>بقي : </span>
                                            <span v-if="competition.status > 1" class="text-green">{{ competition.status }} ايام </span>
                                            <span v-else-if="competition.status == 1" class="text-orange-accent-4">تنتهي اليوم </span>
                                            <span v-else>انتهت </span>
                                        </div>
                                        <div>
                                            <v-icon size="large" icon="mdi-format-list-bulleted" class="me-2"></v-icon>
                                            <span>الحالة : </span>
                                            <span v-if="competition.status > 0" class="text-green">نشطة</span>
                                            <span v-else>مغلقة </span>
                                        </div>
                                        <div>
                                            <v-icon size="large" icon="mdi-cart-outline" class="me-2"></v-icon>
                                            <span>تكلفة المشاركة : {{competition.points}} نقطة</span>
                                        </div>
                                    </div>
                                    <div class="align-self-center py-8 px-5 text-center text-h6 font-weight-black bg-white"
                                        style="border: 1.5px rgb(232, 194, 125) solid; border-left: none;border-radius: 0 17px 17px 0;">
                                        <p v-if="competition.status > 0 ">إجتاز المسابقة</p>
                                        <p v-else>نتيجة المسابقة</p>
                                    </div>
                                </div>
                                <div class="d-flex">
                                    <div>
                                        <v-avatar>
                                            <v-img :src="competition.user.image"></v-img>
                                        </v-avatar>
                                        <span>{{ competition.user.name }}</span>
                                    </div>
                                    <div class="flex-grow-1 mx-4 mt-5">
                                        <hr>
                                        <div class="mt-1">
                                            <div class="text-body-2 d-flex">
                                                <div class="d-flex">
                                                    <div class="imageHolder ml-1" style="width: 15px; height: 15px">
                                                        <v-img src="/images/تاريخ.png"
                                                            style="width: 100%; height: 100%"></v-img>
                                                    </div>
                                                    <p class="align-self-center">
                                                        {{
                                                            new Date(competition.created_at).toLocaleDateString(["ban", "id"])
                                                        }}
                                                    </p>
                                                </div>
                                                <div class="d-flex ms-3">
                                                    <div class="imageHolder ml-1" style="width: 15px; height: 19px">
                                                        <v-img src="/images/عدد-المشاهدات.png"
                                                            style="width: 100%; height: 100%"></v-img>
                                                    </div>
                                                    <p class=" align-self-center">
                                                        {{ competition.competition_view.view_count }}
                                                    </p>
                                                </div>
                                                <div class="d-flex ms-3">
                                                    <div class="imageHolder ml-1" style="width: 15px; height: 19px">
                                                        <v-img src="/images/قائمة-المفضلة-قبل-الضغط.png"
                                                            style="width: 100%; height: 100%"></v-img>
                                                    </div>
                                                    <p class=" align-self-center">
                                                        {{ competition.wishlists_count }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </v-card>
                        </v-col>
                       
                    </v-row>
                </v-container>
                <div class="text-center">
                    <v-btn variant="tonal" color="black" v-if="currentCompetition.length < fillterCompetition.length"
                        @click="pageNumber++">عرض المزيد</v-btn>
                </div>

                <v-alert class="ma-3" type="info" v-if="fillterCompetition.length === 0">لا يوجد مسابقات لعرضها</v-alert>
                <div class="d-md-none d-block">
                    <bannar-center></bannar-center>
                    <bannar-center></bannar-center>
                </div>
            </v-col>
            <v-col md="2" sm="0">
                <bannar-slide></bannar-slide>
            </v-col>
        </v-row>

    </v-card>
</template>
        
<script setup >
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
const { setToastMessage } = useSettingsStore();
const filterSelect = ref('newest');
const route = useRoute();
const categoryInfo = ref();
const pageNumber = ref(1);
const search = ref();

const itemPerPage = ref(2);
const competitions = ref();
const duration = ref(0);

const authStore = useAuthStore();




const fillterCompetition = computed(() => {
    if (filterSelect.value == "newest") {
        return competitions.value.sort(function (a, b) {
            if (a.created_at < b.created_at) return 1;
            return -1;
        });
    } else if (filterSelect.value == "oldest") {
        return competitions.value.sort(function (a, b) {
            if (a.created_at > b.created_at) return 1;
            return -1;
        });
    }
    else if (filterSelect.value == "mostViews") {
        return competitions.value.sort(function (a, b) {
            if (a.competition_view.view_count < b.competition_view.view_count) return 1;
            return -1;
        });
    } else if (filterSelect.value == "leastViews") {
        return competitions.value.sort(function (a, b) {
            if (a.competition_view.view_count > b.competition_view.view_count) return 1;
            return -1;
        });
    }
    if (filterSelect.value == "mostFavioret") {
        return competitions.value.sort(function (a, b) {
            if (a.wishlists_count < b.wishlists_count) return 1;
            return -1;
        });
    } 
    else if (filterSelect.value == "mostCommentCount") {
        return competitions.value.sort(function (a, b) {
            if (a.created_at > b.created_at) return 1;
            return -1;
        });
    }
    else if (filterSelect.value == "leastCommentCount") {
        return competitions.value.sort(function (a, b) {
            if (a.created_at > b.created_at) return 1;
            return -1;
        });
    }

    return competitions.value;
});

const currentCompetition = computed(() => {
    return fillterCompetition.value.slice(0, itemPerPage.value * pageNumber.value);
});

const { data, error } = await useSendRequest(
    "/competitions/search",
    { search: route.params.search }
);
if (error.value) {
    setToastMessage("حدث خظأ ما الرجاء اعادة تحميل الصفحة");
} else {
    if (data.value?.status) {
        competitions.value = data.value.data;
    }
}

function goToSearch() {
  if (search.value) {
    return navigateTo('/competitions/search/' + search.value);
  }
}
useHead({
  title: "مسابقات - نتائج بحث| " + route.params.search,
  meta: [
    { name: "description", content: route.params.search },
    { property: "og:description", content: route.params.search },
    { property: "og:image", content: "/images/مسابقات.png" },
    { name: "twitter:card", content: "summay_large_image" },
    { property: "og:locale", content: "ar_ar" },
    { property: "og:url", content: "https://alqanouni.com/" },
    { property: "og:type", content: "website" },
  ],
  link: [{ rel: "canonical", href: "https://alqanouni.com/" }],
});
</script>
        
<style>
.pointer {
    cursor: pointer;
}
</style>