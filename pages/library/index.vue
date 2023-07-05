<template>
  <div class="bg-blue-grey-lighten-5">
    <v-row style="min-height: 100vh;" class="">
      <v-col md="2" sm="0">
        <bannar-slide></bannar-slide>
      </v-col>
      <v-col md="8" cols="12" class="bg-white my-8 pa-5">
        <v-row
          style="background-color: #fdf8ef"
          class="align-center justify-space-between"
        >
          <v-col cols="12" md="5" sm="4">
            <div class="d-flex align-center justify-space-between">
              <span class="font-weight-bold mt-2"> المكتبة/تصنيفات</span>
              <div class="imageHolder pointer" @click="tryGoToAddFile">
                <v-btn
                  rounded="xl"
                  prepend-icon="mdi-pencil-circle"
                  color="black"
                  >أضف ملف</v-btn>
              </div>
            </div>
          </v-col>

          <v-col md="7" sm="8" cols="12">
            <div class="d-flex justify-space-between align-center">
              <p class="font-weight-bold me-1">
                يحتوي على:
                <span style="color: red"> {{ filesNumber }} ملف</span>
              </p>
              <v-text-field
              v-model="search"
                clearable
                class="mt-5"
                style="min-width: 250px; max-width: 250px"
                label="ابحث"
                density="compact"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                @keyup.enter.prevent="goToSearch"
              ></v-text-field>
            </div>
          </v-col>
        </v-row>
        <bannar-center></bannar-center>
        <div class="ma-3 pa-5">
          <div class="d-flex flex-wrap align-center">
            <div
             
              v-for="(category) in categories"
              :key="category.id"
              v-show="category.libraries_count != 0"
            >
              <v-sheet

                @click="$router.push('/library/' + category.slug)"
                :color="category.background"
                style="position: relative;max-width: 230px;"
                class="text-center mb-3 me-3 pa-3 rounded-lg text-h6 pointer"
                :style="{ color: category.color + '' }"
                ><p>{{ category.name }}</p> <v-badge color="red" :content="category.libraries_count" style="position:absolute;top: 0;right: 0;"></v-badge> </v-sheet
              >
            </div>
          </div>
          <v-alert v-if="filesNumber == 0" type="info"
            >لا يوجد ملفات فالموقع</v-alert
          >
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
          <v-btn variant="flat" color="success" @click="dialog = false">موافق</v-btn>
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
const filesNumber = ref(-1);
const authStore = useAuthStore();
const search = ref();
const categories =
  ref<{ name: string; color: string; background: string; slug: string;libraries_count:number; }[]>();
const { setToastMessage } = useSettingsStore();
const { data, error } = await useSendRequest<responseReturn>("/categories/withFilesCount", {});
if (error.value) {
  setToastMessage('حدث خطا ما');
} else {
  if (data.value?.status) {
    categories.value = data.value.data as {
      name: string;
      color: string;
      background: string;
      slug: string;
      libraries_count:number;
    }[];
  } else {
    const msg = data.value?.message as string;
    setToastMessage(msg);
  }
}
const {data:countData,error:errorCount} = await useSendRequest<responseReturn>('/library/count',{});

if(!errorCount.value && countData.value?.status)
  filesNumber.value = countData.value.data as number;

function tryGoToAddFile() {
  if (authStore.isLogin) return navigateTo("/library/files/add");
  dialog.value = true;
}

function goToSearch(){
    if(search.value){
        navigateTo('/library/search/'+search.value);
    }
  }

  useHead({
  title:'القانوني - مكتبة',
  meta: [
    { name: "description", content: 'تحتوي هذه الصفحة على التصنيفات الخاصة بأهم الملفات' },
    { property: "og:description", content: 'تحتوي هذه الصفحة على التصنيفات الخاصة بأهم الملفات' },
    { property: "og:image", content: '/images/المكتبة.png' },
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
