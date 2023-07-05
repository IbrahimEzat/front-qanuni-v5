<template>
  <div class="bg-blue-grey-lighten-5">
    <v-row class="">
      <v-col md="2" sm="0">
        <!-- <bannar-slide></bannar-slide> -->
      </v-col>
      <v-col md="8" cols="12" class="bg-white my-8 pa-5">
        <div style="background-color: #fdf8ef; width: 100%" class="pa-3">
          <div class="d-flex align-center justify-space-between">
            <span class="font-weight-bold pt-2 ml-5"
              ><nuxt-link
                class="text-decoration-none font-weight-bold"
                to="/surveys"
                >استطلاعات</nuxt-link
              >
              / تصنيفات</span
            >

            <div class="imageHolder pointer" @click="tryGoToAddSurvey">
              <v-btn
                rounded="xl"
                prepend-icon="mdi-pencil-circle-outline"
                color="black"
                >أضف استطلاعاً</v-btn
              >
            </div>
            <p class="font-weight-bold ml-8 d-md-block d-none">
              يحتوي على :
              <span style="color: red"> {{ surveysNumber }} استطلاعات</span>
            </p>
            <v-text-field
              v-model="keyword"
              clearable
              style="max-width: 250px; min-width: 150px; max-height: 40px"
              class="rounded-pill mt-1 d-md-block d-none"
              label="ابحث"
              density="compact"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              @keyup.enter="search()"
            ></v-text-field>
          </div>
          <div
            class="d-flex align-center justify-space-between mt-5 d-md-none d-block"
          >
            <p class="font-weight-bold ml-8">
              يحتوي على :
              <span style="color: red"> {{ surveysNumber }} استطلاعات</span>
            </p>
            <v-text-field
              v-model="keyword"
              clearable
              style="max-width: 250px; min-width: 150px; max-height: 40px"
              class="rounded-pill mt-1"
              label="ابحث"
              density="compact"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              @keyup.enter="search()"
            ></v-text-field>
          </div>
        </div>
        <bannar-center></bannar-center>
        <div class="ma-3 pa-5">
          <div class="d-flex flex-wrap align-center">
            <div
              v-for="category in categories"
              :key="category.id"
              v-show="category.surveys_count != 0"
            >
              <v-sheet
                @click="$router.push('/surveys/' + category.slug)"
                :color="category.background"
                style="position: relative; max-width: 230px"
                class="text-center mb-3 me-3 pa-3 rounded-lg text-h6 pointer"
                :style="{ color: category.color + '' }"
                ><p>{{ category.name }}</p>
                <v-badge
                  color="red"
                  :content="category.surveys_count"
                  style="position: absolute; top: 0; right: 0"
                ></v-badge>
              </v-sheet>
            </div>
          </div>
          <!-- <v-row>
            <v-col v-show="category.surveys_count != 0" sm="4" md="3" cols="6" v-for="(category) in categories" :key="category.id">
              <v-sheet   @click="$router.push('/surveys/' + category.slug)" :color="category.background"
                class="text-center pa-3 rounded-pill text-h6 pointer" :style="{ color: category.color + '' }">{{
                  category.name }} ({{ category.surveys_count }})</v-sheet>
            </v-col>
          </v-row> -->
          <v-alert v-if="surveysNumber == 0" type="info"
            >لا يوجد تصنيفات فالموقع</v-alert
          >
        </div>
      </v-col>
      <v-col md="2" sm="0">
        <!-- <bannar-slide></bannar-slide> -->
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
          <v-btn variant="flat" color="success" @click="dialog = false"
            >موافق</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
        
<script setup lang="ts">
import { responseReturn } from "~/types/tpes";
import { useSettingsStore } from "~/stores/useSettings";
import { useAuthStore } from "~/stores/useAuthStore";
const dialog = ref(false);
const surveysNumber = ref(-1);
const authStore = useAuthStore();
const router = useRouter();
const keyword = ref();
const categories = ref<any>();
const { setToastMessage } = useSettingsStore();
const { data, error } = await useSendRequest<responseReturn>(
  "/categories/survey",
  {}
);
if (error.value) {
  setToastMessage("حدث خطا ما");
} else {
  if (data.value?.status) {
    categories.value = data.value.data as {
      name: string;
      color: string;
      background: string;
      slug: string;
      surveys_count: any;
    }[];
  } else {
    const msg = data.value?.message as string;
    setToastMessage(msg);
  }
}
const { data: countData, error: errorCount } =
  await useSendRequest<responseReturn>("/surveys/getCount", {});

if (!errorCount.value && countData.value?.status)
  surveysNumber.value = countData.value.data as number;

function tryGoToAddSurvey() {
  if (!authStore.isLogin) dialog.value = true;
  else router.push("/surveys/add");
}

function search() {
  if (keyword.value) navigateTo("/surveys/search/" + keyword.value);
  return;
}
useHead({
  title: "القانوني - تصنيفات|استطلاعات",
  meta: [
    {
      name: "description",
      content: "تحتوي هذه الصفحة على التصنيفات الخاصة بأهم الاستطلاعات",
    },
    {
      property: "og:description",
      content: "تحتوي هذه الصفحة على التصنيفات الخاصة بأهم الاستطلاعات",
    },
    { property: "og:image", content: "/images/استطلاعات.png" },
    { name: "twitter:card", content: "summay_large_image" },
    { property: "og:locale", content: "ar_ar" },
    { property: "og:url", content: "https://alqanoni.com/" },
    { property: "og:type", content: "website" },
  ],
  link: [{ rel: "canonical", href: "https://alqanoni.com/" }],
});
</script>
        
<style scoped>
.pointer {
  cursor: pointer;
}
</style>
