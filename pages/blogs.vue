<template>
  <div style="min-height: 100vh;" class="bg-blue-grey-lighten-5">
    <v-row class="">
      <v-col md="2" sm="0">
        <bannar-slide></bannar-slide>
      </v-col>
      <v-col style="border: 1px solid #999" md="8" cols="12" class="bg-white mt-8 pa-5">
        <div
          style="background-color: #fdf8ef; width: 100%"
          class="pa-3 d-flex justify-space-between"
        >
          <span class="font-weight-bold pt-2"> <nuxt-link>مقالات</nuxt-link> / التصنيفات</span>

          <div class="imageHolder mt-2 pointer" @click="tryGoToAddBlog">
            <v-img :width="100" src="/images/أضف-مقالة.png"></v-img>
          </div>
          <p class="font-weight-bold mt-3 d-sm-block d-none">
            يحتوي على : <span style="color: red"> {{ blogNumber }} مقالات</span>
          </p>
          <v-text-field
            clearable
            v-model="search"
            @keyup.enter.prevent="goToSearchPage"
            style="max-width: 170px; min-width: 150px; max-height: 40px"
            class="rounded-pill mt-1 d-sm-block d-none"
            label="ابحث"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
          ></v-text-field>
        </div>
        <div class="d-sm-none justify-space-between d-flex">
          <p class="font-weight-bold mt-3">
            يحتوي على : <span style="color: red"> {{ blogNumber }} مقالات</span>
          </p>
          <v-text-field
            clearable
            style="max-width: 170px; min-width: 150px; max-height: 40px"
            class="rounded-pill mt-1"
            label="ابحث"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
          ></v-text-field>
        </div>
        <bannar-center></bannar-center>
        <div class="ma-3 pa-5">
          <v-row>
            <v-col
              v-show="category.blogs_count != 0"
              sm="4"
              md="3"
              cols="6"
              v-for="(category) in categories"
              :key="category.id"
            >
              <v-sheet
                @click="$router.push('/showBlogs/' + category.slug)"
                :color="category.background"
                class="text-center pa-3 rounded-pill text-h6 pointer"
                :style="{ color: category.color + '' }"
                >{{ category.name }} ({{ category.blogs_count }})</v-sheet
              >
            </v-col>
          </v-row>
          <v-alert v-if="blogNumber == 0" type="info"
            >لا يوجد تصنيفات فالموقع</v-alert>
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
            أنت لا تستطيع إضافة مقالة يجب عليك تسجيل الدخول أولا
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
const blogNumber = ref(0);
const authStore = useAuthStore();
const search = ref();
const categories =
  ref<{ name: string; color: string; background: string; slug: string ;blogs_count:number;}[]>();
const { setToastMessage } = useSettingsStore();
const { data, error } = await useSendRequest<responseReturn>("/categories/blog", {
});
if (error.value) {
  setToastMessage('حدث خطا ما');
} else {
  if (data.value?.status) {
    categories.value = data.value.data as {
      name: string;
      color: string;
      background: string;
      slug: string;
      blogs_count:number
    }[];
  } else {
    setToastMessage(data.value?.message + '');
  }
}


const {data:countData,error:errorCount} = await useSendRequest<responseReturn>('/blogs/count',{});

if(!errorCount.value && countData.value?.status)
  blogNumber.value = countData.value.data as number;
  

function tryGoToAddBlog() {
  if (authStore.isLogin) return window.location.href = "/addBlog";
  dialog.value = true;
}

function goToSearchPage(){
  if(search.value)
    navigateTo('/blog/search/'+search.value);
}

useHead({
  title:'القانوني - تصنيفات|مقالات',
  meta: [
    { name: "description", content: 'تحتوي هذه الصفحة على التصنيفات الخاصة بأهم المقالات' },
    { property: "og:description", content: 'تحتوي هذه الصفحة على التصنيفات الخاصة بأهم المقالات' },
    { property: "og:image", content: '/images/مقالات.png' },
    { name: "twitter:card", content: "summay_large_image" },
    { property:'og:locale',content:'ar_ar'},
    { property:'og:url',content:'https://alqanouni.com/'},
    { property:'og:type',content:'website'}
  ],
  link:[{rel:'canonical',href:'https://alqanouni.com/'}],
});
</script>
    
  <style scoped>
.pointer {
  cursor: pointer;
}
</style>
