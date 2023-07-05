<template>
  <div class="bg-blue-grey-lighten-5">
    <v-row style="min-height: 100vh;">
      <v-col md="2" sm="0">
        <bannar-slide :banner="rightBanner"></bannar-slide>
      </v-col>
      <v-col md="8" cols="12" class="bg-white my-8 pa-5">
        <div
          style="background-color: #fdf8ef; width: 100%"
          class="pa-3 d-flex justify-space-between"
        >
          <p
            class="font-weight-bold text-h5 pt-2 pointer"
            @click="$router.push('/services')"
          >
            الخدمات
          </p>
        </div>
        <bannar-center :banner="topBanner"></bannar-center>
        <div v-if="service">
          <div
            class="d-flex justify-space-between pa-5 mt-4"
            style="border-bottom: 2px solid black"
          >
            <p class="text-h4">{{ service.title }}</p>
            <p class="text-h4">{{ service.points }} نقطة</p>
          </div>
          <div class="my-5 text-center text-h5">
            <p>
              لقد صرحت بأنك تسلمت خدمتك يا سيدي الكريم ❤️ الآن يمكن لك ترك تقييم
              لخدمتنا
            </p>
          </div>
          <div class="">
            <div class="my-5">
              <v-textarea
                variant="outlined"
                label="الرأي الخاص بك"
                auto-grow
                v-model="message"
              ></v-textarea>
            </div>

            <div class="d-flex my-5 justify-space-between">
              <v-rating
                class="mt-4"
                v-model="rating"
                color="orange"
              ></v-rating>

              <div class="mt-5">
                <v-btn
                  :disabled="!message || !rating"
                  class="me-5 rounded-xl"
                  color="black"
                  :loading="confirmLoading"
                  append-icon="mdi-comment-processing-outline"
                  @click="submitReview()"
                  >أضف تقييمك</v-btn
                >
                <v-btn
                  class="rounded-xl"
                  color="error"
                  append-icon="mdi-close"
                  @click="$router.push('/services/holdings')"
                  >تخطي</v-btn
                >
              </div>
            </div>
          </div>
        </div>
      </v-col>

      <v-col md="2" sm="0">
        <bannar-slide :banner="leftBanner"></bannar-slide>
      </v-col>
    </v-row>
  </div>
</template>
      
<script setup lang="ts">
import { responseReturn } from "~/types/tpes";
import { useSettingsStore } from "~/stores/useSettings";
import { useAuthStore } from "~/stores/useAuthStore";

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();
const route = useRoute();

const rightBanner = ref();
const leftBanner = ref();
const topBanner = ref();

const service = ref();
const rating = ref(0);
const message = ref();
const confirmLoading = ref(false);

(async () => {
  const { data, error } = await useSendRequest<responseReturn>(
    "/services/checkSubscription",
    {
      id: route.params.id,
      token: authStore.token,
    }
  );
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    const dataReturend = data.value.data as any;
    service.value = dataReturend.service;
  } else {
    setToastMessage("لا يمكن الوصول الى هذه الصفحة");
    navigateTo("/");
  }
})();

async function submitReview() {
  confirmLoading.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/services/submitReview",
    {
      id: route.params.id,
      token: authStore.token,
      message: message.value,
      rating: rating.value,
    }
  );
  confirmLoading.value = false;

  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    setToastMessage(data.value?.message as string);
    navigateTo("/services/holdings");
  } else {
    setToastMessage(data.value?.message as string);
  }

  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    service.value = data.value.data;
  } else {
  }
}

useHead({
  title:'مشترياتي - صفحة التقييم',
  meta: [
    { name: "description", content: ' صفحة التقييم للخدمات' },
    { property: "og:description", content: ' صفحة التقييم للخدمات' },
    { property: "og:image", content: '/images/market.png' },
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

.v-rating__wrapper {
  min-width: 20px !important;
}

.v-rating__item {
  display: inline-flex;
  position: relative;
  min-width: 30px !important;
}

.custom-rating .v-rating__item {
  width: 30px !important;
  /* Adjust the value as per your desired spacing */
}
</style>