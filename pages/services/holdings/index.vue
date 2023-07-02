<template>
  <div class="bg-blue-grey-lighten-5">
    <v-row style="min-height: 100vh;">
      <v-col md="2" sm="0">
        <bannar-slide :banner="rightBanner"></bannar-slide>
      </v-col>
      <v-col md="8" cols="12"  class="bg-white mb-10 mt-8 pa-5">
        <div
          style="background-color: #fdf8ef; width: 100%"
          class="pa-3 d-flex justify-space-between"
        >
          <p class="font-weight-bold pt-2">
            <NuxtLink to="/services">الخدمات</NuxtLink>
            <span> / مشترياتي</span>
          </p>
        </div>
        <bannar-center :banner="topBanner"></bannar-center>
        <div >
          <v-row>
            <v-col
              md="6"
              cols="12"
              class="mb-10"
              v-for="item in subscribtions"
              :key="item.id"
            >
              <v-card
                @click="
                  $router.push('/services/holdings/' + item.id + '/details')
                "
                max-width="400"
                class="pointer mx-auto rounded-xl"
              >
               
                <v-img
                  class="align-end text-white"
                  height="200"
                  :src="item.service.cover"
                  cover
                >
                  <v-card-title class="bg-grey-lighten-3 text-center">{{
                    item.service.title
                  }}</v-card-title>
                </v-img>
                <div
                  class="d-flex justify-space-between bg-blue-grey-darken-4"
                  style="height: 60px"
                >
                  <div class="d-flex justify-space-between py-1 ps-5 flex-column">
                    <div class="d-flex align-center  font-weight-bold">
                      <v-icon
                        color="success"
                        v-if="item.status"
                        icon="mdi-check-circle-outline"
                      ></v-icon>
                      <v-icon
                        color="warning"
                        v-else
                        icon="mdi-timer-sand-complete"
                      ></v-icon>
                      <span>{{ item.status ? "مكتملة" : "قيد التنفيذ" }}</span>
                    </div>
                    <p style="font-size: 14px;">{{ new Date(item.created_at).toLocaleString(['ban','id'],{
                      minute:'2-digit',
                      hour:'2-digit',
                      day:'2-digit',
                      month:'2-digit',
                      year:'2-digit'
                    }) }}</p>
                  </div>
                  <div
                    class="font-weight-medium text-h6 bg-amber-accent-4 text-center"
                    style="width: 30%"
                  >
                    <p>{{ item.service.points }}</p>
                    <p>نقطة</p>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-alert  v-if="subscribtions.length === 0" type="info" class="mt-5">
          ليس لديك مشتريات بعد اذهب الى صفحة <nuxt-link class="text-black" to="/services">الخدمات</nuxt-link>
          </v-alert>
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

const subscribtions = ref();

const { data, error } = await useSendRequest<responseReturn>(
  "/services/getUserServices",
  { token: authStore.token }
);
if (error.value) {
  setToastMessage(error.value.message);
} else if (data.value?.status) {
  subscribtions.value = data.value.data;
} else {
  setToastMessage(data.value?.message as string);
}

useHead({
  title:'القانوني - مشترياتي',
  meta: [
    { name: "description", content: 'هذه قائمة المشتريات التي تحصلت عليها من داخل الموقع' },
    { property: "og:description", content: 'هذه قائمة المشتريات التي تحصلت عليها من داخل الموقع' },
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