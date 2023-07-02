<template>
    <div class="bg-blue-grey-lighten-5">
      <v-row class="">
        <v-col md="2" sm="0">
          <bannar-slide></bannar-slide>
        </v-col>
        <v-col md="8" cols="12" class="bg-white my-8 pa-5">
          <v-row style="background-color: #fdf8ef; " class="mx-3 d-flex justify-space-between">
            <v-col sm="5" cols="12"  class="d-flex justify-space-between pe-xs-12 pe-1">
              <span class="font-weight-bold pt-2">اختبارات/تصنيفات</span>
            </v-col>
            <v-col sm="7" cols="12"  class="d-flex justify-space-between">
              <p class="font-weight-bold mt-3">
                يحتوي على :
                <span style="color: red"> {{ examsNumber }} اختبارات</span>
              </p>
              <v-text-field clearable style="max-width: 250px; min-width: 150px; max-height: 40px" class="rounded-pill mt-1"
                label="ابحث" density="compact" v-model="search"
                @keyup.enter.prevent="goToSearch" prepend-inner-icon="mdi-magnify"
                variant="outlined"></v-text-field>
            </v-col>
          </v-row>
  
          <bannar-center></bannar-center>
          <div class="ma-3 pa-5">
            <v-row>
              <v-col v-show="category.exams_count != 0" sm="4" md="3" cols="6" v-for="(category) in categories" :key="category.id">
                <v-sheet @click="$router.push('/exams/' + category.slug)"
                  :color="category.background" class="text-center pa-3 rounded-pill text-h6 pointer"
                  :style="{ color: category.color + '' }">{{ category.name }}({{ category.exams_count }}) </v-sheet>
              </v-col>
            </v-row>
            <v-alert v-if="examsNumber == 0"  type="info">لا يوجد تصنيفات فالموقع</v-alert>
          </div>
        </v-col>
        <v-col md="2" sm="0">
          <bannar-slide></bannar-slide>
        </v-col>
      </v-row>
      
    </div>
  </template>
        
  <script setup lang="ts">
  import { responseReturn } from "~/types/tpes";
  import { useSettingsStore } from "~/stores/useSettings";
  import { useAuthStore } from "~/stores/useAuthStore";
  const authStore = useAuthStore();

  const examsNumber = ref(-1);
  const search = ref();
  const categories =
    ref<{ name: string; color: string; background: string; slug: string;exams_count: number; }[]>();
  const { setToastMessage } = useSettingsStore();
  const { data, error } = await useSendRequest<responseReturn>("/categories/CategotiesWithExams", {});
  if (error.value) {
    setToastMessage(error.value.message);
  } else {
    if (data.value?.status) {
      categories.value = data.value.data as {
        name: string;
        color: string;
        background: string;
        slug: string;
        exams_count: number;
      }[];
    } else {
      const msg = data.value?.message as string;
      setToastMessage(msg);
    }
  }
  const {data:countData,error:errorCount} = await useSendRequest<responseReturn>('/exams/count',{});
  
  if(!errorCount.value && countData.value?.status)
    examsNumber.value = countData.value.data as number;
  
  
  function goToSearch() {
    if(search.value){  
      return navigateTo('/discussions/search/' + search.value);
    } 
  }
  
  useHead({
    title:'القانوني - تصنيفات|اختبارات',
    meta: [
      { name: "description", content: 'تحتوي هذه الصفحة على التصنيفات الخاصة بأهم الاختبارات' },
      { property: "og:description", content: 'تحتوي هذه الصفحة على التصنيفات الخاصة بأهم الاختبارات' },
      { property: "og:image", content: '/images/اختبارات.png' },
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
  