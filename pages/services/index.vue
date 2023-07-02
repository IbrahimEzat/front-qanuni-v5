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
          <p class="font-weight-bold text-h5 pt-2">الخدمات</p>
        </div>
        <bannar-center :banner="topBanner"></bannar-center>
        <div class="">
          <v-row>
            <v-col md="6" cols="12" v-for="item in services" :key="item.id">
              <v-card
                @click="$router.push('/services/' + item.slug)"
                max-width="400"
                class="pointer mx-auto rounded-xl"
                style="position: relative"
              >
                <!-- <div v-if="!isFavarite" class="imageHolder align-self-center pointer"
                                    style="position: absolute; top: 0; right: 0; z-index: 1;" @click="addToWishlist()">
                                    <v-img style="width: 55px; height: 55px"
                                        src="/images/قائمة-المفضلة-قبل-الضغط.png"></v-img>
                                </div>
                                <div v-if="isFavarite" class="imageHolder align-self-center pointer"
                                    style="position: absolute; top: 0; right: 0; z-index: 1;" @click="removeFromWishlist()">
                                    <v-img style="width: 55px; height: 55px"
                                        src="/images/قائمة-المفضلة-بعد-الضغط.png"></v-img>
                                </div> -->
                <v-img
                  class="align-end text-white"
                  height="200"
                  :src="item.cover"
                  cover
                >
                  <v-card-title class="bg-grey-lighten-3 text-center">{{
                    item.title
                  }}</v-card-title>
                </v-img>
                <div
                  class="d-flex justify-space-between bg-blue-grey-darken-4"
                  style="height: 60px"
                >
                  <span class="my-4 ms-10 font-weight-medium">
                    <RatingStars
                      :rating="item.reviews_avg_rating"
                    ></RatingStars>
                    <!-- <v-rating size="small" v-model="item.reviews_avg_rating" readonly half-increments
                                            color="amber-accent-4"></v-rating> -->
                    <!-- <stars :ratingValue="item.reviews_avg_rating ? item.reviews_avg_rating : 0" :numberOfRate="item.reviews_count"></stars> -->
                  </span>
                  <span class="mt-4">
                    <p class="font-weight-medium">
                      {{ item.reviews_count }} تقييم
                    </p>
                  </span>
                  <div
                    class="font-weight-medium text-h6 bg-amber-accent-4 text-center"
                    style="width: 30%"
                  >
                    <p>{{ item.points }}</p>
                    <p>نقطة</p>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
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
import RatingStars from "~/components/rating-stars.vue";

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();

const rightBanner = ref();
const leftBanner = ref();
const topBanner = ref();

const services = ref();

const isFavarite = ref(false);

(async () => {
  const { data, error } = await useSendRequest<responseReturn>(
    "/services/getServices",
    { token: authStore.token }
  );
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    services.value = data.value.data;
  } else {
    setToastMessage(data.value?.message as string);
  }
})();

function addToWishlist() {
  isFavarite.value = true;
}

function removeFromWishlist() {
  isFavarite.value = false;
}

useHead({
  title:'القانوني - خدمات',
  meta: [
    { name: "description", content: 'هذه أهم الخدمات التي يقدمها الموقع' },
    { property: "og:description", content: 'هذه أهم الخدمات التي يقدمها الموقع' },
    { property: "og:image", content: '/images/market.png' },
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

.v-rating__wrapper {
  width: 30px !important;
}
</style>