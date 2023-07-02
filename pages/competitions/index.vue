<template>
  <div class="bg-blue-grey-lighten-5">
    <v-row class="">
      <v-col md="2" sm="0">
        <bannar-slide></bannar-slide>
      </v-col>
      <v-col md="8" cols="12" class="bg-white my-8 pa-5">
        <div style="background-color: #fdf8ef; " class="mx-3 pa-3 d-flex justify-space-between">
          <span class="font-weight-bold pt-2">مسابقات/تصنيفات</span>
          <p class="font-weight-bold mt-3">
            يحتوي على :
            <span style="color: red"> {{ competitionNumber }} مسابقات</span>
          </p>
          <v-text-field clearable style="max-width: 250px; min-width: 150px; max-height: 40px" class="rounded-pill mt-1"
            label="ابحث" density="compact" v-model="search" @keyup.enter.prevent="goToSearch"
            prepend-inner-icon="mdi-magnify" variant="outlined"></v-text-field>

        </div>

        <bannar-center></bannar-center>
        <div class="ma-3 pa-5">
          <v-row>
            <v-col v-show="category.competitions_count != 0" sm="4" md="3" cols="6" v-for="(category) in categories"
              :key="category.id">
              <v-sheet @click="$router.push('/competitions/' + category.slug)" :color="category.background"
                class="text-center pa-3 rounded-pill text-h6 pointer" :style="{ color: category.color + '' }">{{
                  category.name }}({{ category.competitions_count }}) </v-sheet>
            </v-col>
          </v-row>
          <v-alert v-if="competitionNumber == 0" type="info">لا يوجد تصنيفات فالموقع</v-alert>
        </div>
      </v-col>
      <v-col md="2" sm="0">
        <bannar-slide></bannar-slide>
      </v-col>
    </v-row>
    
  </div>
</template>
        
<script setup >
import { useSettingsStore } from "~/stores/useSettings";
import { useAuthStore } from "~/stores/useAuthStore";

const competitionNumber = ref(-1);
const search = ref();
const authStore = useAuthStore();
const categories = ref();
const { setToastMessage } = useSettingsStore();
const { data, error } = await useSendRequest("/competitions/categories", {});
if (error.value) {
  setToastMessage(error.value.message);
} else {
  if (data.value?.status) {
    categories.value = data.value.data;
  } else {
    const msg = data.value?.message;
    setToastMessage(msg);
  }
}
const { data: countData, error: errorCount } = await useSendRequest('/competitions/count', {});

if (!errorCount.value && countData.value?.status)
  competitionNumber.value = countData.value.data;

function goToSearch() {
  if (search.value) {
    return navigateTo('/competitions/search/' + search.value);
  }
}

useHead({
  title: 'القانوني - تصنيفات|مسابقات',
  meta: [
    { name: "description", content: 'تحتوي هذه الصفحة على التصنيفات الخاصة بأهم المسابقات' },
    { property: "og:description", content: 'تحتوي هذه الصفحة على التصنيفات الخاصة بأهم المسابقات' },
    { property: "og:image", content: '/images/مسابقات.png' },
    { name: "twitter:card", content: "summay_large_image" },
    { property: 'og:locale', content: 'ar_ar' },
    { property: 'og:url', content: 'https://alqanouni.com/' },
    { property: 'og:type', content: 'website' }
  ],
  link: [{ rel: 'canonical', href: 'https://alqanouni.com/' }],
});
</script>
        
<style scoped>
.pointer {
  cursor: pointer;
}
</style>
  