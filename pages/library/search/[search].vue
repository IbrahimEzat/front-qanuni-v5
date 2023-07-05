<template>
  <v-card v-if="libraries" min-height="100vh" color="#f4f4f4" class="">
    <v-row class="mx-1">
      <v-col md="2" sm="0">
        <bannar-slide></bannar-slide>
      </v-col>
      <v-col
        style="border: 1px solid #999"
        class="bg-white mb-5 mt-sm-8 pa-0 pb-16"
        md="8"
        sm="11"
        cols="12"
      >
        <div style="background-color: #fdf8ef; width: 100%" class="pa-3">
          <div class="d-flex justify-space-between">
            <span class="font-weight-bold pt-2 ml-5"
              ><nuxt-link
                class="text-decoration-none font-weight-bold"
                to="/library"
                >المكتبة</nuxt-link
              >
            </span>

            <div class="imageHolder mt-2 pointer" @click="tryGoToAddFile">
              <v-btn
                rounded="xl"
                prepend-icon="mdi-pencil-circle-outline"
                color="black"
                >اضف ملف</v-btn
              >
            </div>
          </div>
          <div class="d-flex justify-space-between mt-5">
            <p class="font-weight-bold mt-3 ml-8 d-md-block d-none">
              يحتوي الآن على :
              <span style="color: red"> {{ libraries.length }} ملفات</span>
            </p>
            <div class="d-flex">
              <v-select
                label="Select"
                style="min-width: 200px; height: 45px"
                variant="outlined"
                class="pa-0 ml-10"
                density="compact"
                v-model="filterSelect"
                item-title="name"
                item-value="value"
                :items="[
                  { name: 'الاحدث اولا', value: 'newest' },
                  { name: 'الاقدم اولا', value: 'oldest' },
                  { name: 'الاكثر مشاهدة', value: 'mostViews' },
                  { name: 'الاقل مشاهدة', value: 'leastViews' },
                  { name: 'الاكثر تفضيلا', value: 'mostFavioret' },
                  { name: 'الاكثر تعليقا', value: 'mostCommentCount' },
                  { name: 'الاقل تعليقا', value: 'leastCommentCount' },
                  { name: 'الاقل تقييما', value: 'leastRating' },
                  { name: 'الأكثر تقييما', value: 'mostRating' },
                  { name: 'الأكثر تنزيلا', value: 'mostDownload' },
                ]"
              >
                <template v-slot:item="{ props }">
                  <v-list-item v-bind="props" class="text-end"></v-list-item>
                </template>
              </v-select>
            </div>
            <v-text-field
              v-model="search"
              clearable
              style="max-width: 200px; max-height: 9px"
              class="rounded-pill"
              label="ابحث"
              density="compact"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              @keyup.enter.prevent="goToSearch"
            ></v-text-field>
          </div>
          <p class="font-weight-bold mt-3 ml-8 d-md-none d-block">
            يحتوي على :
            <span style="color: red"> {{ libraries.length }} ملفات</span>
          </p>
        </div>
        <bannar-center></bannar-center>
        <div class="mx-3 d-flex" style="max-width: 97.5%">
          <v-row class="pointer ma-0 me-n3">
            <v-col
              md="6"
              cols="12"
              class="pa-0 pe-3 mb-3"
              v-for="library in currentLibraries"
              :key="library.id"
            >
              <library-card-file :library="library" />
            </v-col>
          </v-row>
        </div>
        <div class="text-center">
          <v-btn
            variant="tonal"
            color="black"
            v-if="currentLibraries.length < fillterLibraries.length"
            @click="pageNumber++"
            >عرض المزيد</v-btn
          >
        </div>

        <v-alert class="ma-3" type="info" v-if="currentLibraries.length === 0"
          >لا يوجد ملفات لعرضها</v-alert
        >
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
          <div class="">أنت لا تستطيع إضافة ملف يجب عليك تسجيل الدخول أولا</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="flat" color="success" @click="dialog = false"
            >موافق</v-btn
          >
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
const filterSelect = ref("newest");
const route = useRoute();
const categoryInfo = ref();
const pageNumber = ref(1);
const dialog = ref();
const search = ref();
const itemPerPage = ref(10);
const libraries = ref();

const fillterLibraries = computed(() => {
  if (filterSelect.value === "newest") {
    return libraries.value.sort(function (a: any, b: any): number {
      if (a.created_at < b.created_at) return 1;
      return -1;
    });
  } else if (filterSelect.value === "oldest") {
    return libraries.value.sort(function (a: any, b: any): number {
      if (a.created_at > b.created_at) return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostViews") {
    return libraries.value.sort(function (a: any, b: any): number {
      if (a.library_view.views_count < b.library_view.views_count) return 1;
      return -1;
    });
  } else if (filterSelect.value === "leastViews") {
    return libraries.value.sort(function (a: any, b: any): number {
      if (a.library_view.views_count > b.library_view.views_count) return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostFavioret") {
    return libraries.value.sort(function (a: any, b: any): number {
      if (
        a.library_wish_list_count.wish_list_count <
        b.library_wish_list_count.wish_list_count
      )
        return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostCommentCount") {
    return libraries.value.sort(function (a: any, b: any): number {
      if (
        a.library_comment_count.comment_count <
        b.library_comment_count.comment_count
      )
        return 1;
      return -1;
    });
  } else if (filterSelect.value === "leastCommentCount") {
    return libraries.value.sort(function (a: any, b: any): number {
      if (
        a.library_comment_count.comment_count >
        b.library_comment_count.comment_count
      )
        return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostDownload") {
    return libraries.value.sort(function (a: any, b: any): number {
      if (
        a.library_download_count.download_count <
        b.library_download_count.download_count
      )
        return 1;
      return -1;
    });
  } else if (filterSelect.value === "leastRating") {
    return libraries.value.sort(function (a: any, b: any): number {
      if (a.library_point_count.point_count > b.library_point_count.point_count)
        return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostRating") {
    return libraries.value.sort(function (a: any, b: any): number {
      if (a.library_point_count.point_count < b.library_point_count.point_count)
        return 1;
      return -1;
    });
  }
  return libraries.value;
});

const currentLibraries = computed(() => {
  return fillterLibraries.value.slice(0, itemPerPage.value * pageNumber.value);
});

const { data, error } = await useSendRequest<responseReturn>(
  "/library/search/" + route.params.search,
  {}
);
if (error.value) {
  setToastMessage("حدث خطا ما");
} else {
  if (data.value?.status) {
    libraries.value = data.value.data;
  }
}

function tryGoToAddFile() {
  if (authStore.isLogin) return navigateTo("/library/files/add");
  dialog.value = true;
}

function goToSearch() {
  if (search.value) {
    navigateTo("/library/search/" + search.value);
  }
}

useHead({
  title:'مكتبة - نتائج بحث| ' + route.params.search,
  meta: [
    { name: "description", content: 'نتائج البحث عن: ' + route.params.search },
    { property: "og:description", content: 'نتائج البحث عن: ' + route.params.search },
    { property: "og:image", content: '/images/المكتبة.png' },
    { name: "twitter:card", content: "summay_large_image" },
    { property:'og:locale',content:'ar_ar'},
    { property:'og:url',content:'https://alqanoni.com/'},
    { property:'og:type',content:'website'}
  ],
  link:[{rel:'canonical',href:'https://alqanoni.com/'}],
});
</script>
          
    <style></style>