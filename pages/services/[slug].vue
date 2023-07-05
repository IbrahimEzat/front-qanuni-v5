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
          <div class="d-flex justify-space-between px-5 mt-4">
            <p class="text-h4">{{ service.title }}</p>
            <p class="text-h4">{{ service.points }} نقطة</p>
          </div>
          <div
            class="bg-blue-grey-lighten-5 d-flex justify-space-between px-5 mt-4 text-center"
          >
            <div class="my-5 d-flex justify-space-between">
              <!-- <v-rating class="custom-rating" style="display: inline-block;" size="large" v-model="rate" readonly half-increments
                            color="amber-accent-4"></v-rating> -->
              <rating-stars :rating="service.reviews_avg_rating"></rating-stars>
              <div class="text-black me-2 text-h5 font-weight-medium">
                ({{ service.reviews_count }})
              </div>
            </div>
            <div v-if="!authStore.isAdmin" class="my-4 d-flex text-center">
              <!-- <v-btn
                class="mx-2 rounded-pill bg-blue-grey-darken-3 text-h5 font-weight-medium"
                prepend-icon="mdi-email-outline"
                >تواصل معنا</v-btn
              > -->
              <v-btn
                @click="checkUserPoints"
              :disabled="checkPointsLoading"
                class="mx-2 d-md-flex d-none rounded-pill text-h5 font-weight-medium"
                style="color: white; background-color: rgb(28, 173, 76)"
                prepend-icon="mdi-cart-outline"
                >إشتري الخدمة</v-btn
              >
            </div>
          </div>
          <div class="my-5">
            <v-carousel hide-delimiters>
              <template v-slot:prev="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-arrow-right"
                  color="white"
                ></v-btn>
              </template>
              <template v-slot:next="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-arrow-left"
                  color="white"
                ></v-btn>
              </template>
              <v-carousel-item
                v-for="item in service.images"
                :key="item.service_id"
                :src="item.file_name"
              ></v-carousel-item>
            </v-carousel>
          </div>
          <div class="my-5 pa-5">
            <p class="text-h6">{{ service.details }}</p>
          </div>

          <div class="mx-auto text-center my-5">
            <v-btn
              v-if="!authStore.isAdmin"
              @click="checkUserPoints"
              :disabled="checkPointsLoading"
              class="mx-2 rounded-pill text-h5 font-weight-medium"
              style="color: white; background-color: rgb(28, 173, 76)"
              prepend-icon="mdi-cart-outline"
              >إشتري الخدمة</v-btn
            >
          </div>

          <div v-if="reviews">
            <div class="d-flex justify-space-between px-5 py-2">
              <p class="text-lg-h5 font-weight-bold">آراء المشترين</p>
            </div>
            <div
              v-for="item in reviews"
              :key="item.id"
              class="bg-blue-grey-darken-4 px-2 pt-2 pb-2 ma-5"
            >
              <div class="d-flex justify-space-between mb-2">
                <div class="d-flex">
                  <v-img
                  class="pointer"
                  @click="$router.push('/profile/'+item.user.id)"
                    cover
                    style="border-radius: 50%; width: 50px; height: 50px"
                    :src="item.user.image"
                  ></v-img>
                  <p class="text-sm-h5 text-h6 align-self-center ms-3">
                    {{ item.user.name }}
                  </p>
                </div>
                <div class="d-flex">
                  <div
                    class="imageHolder align-self-center"
                    style="width: 25px; height: 25px"
                  >
                    <v-img
                      src="/images/تاريخ.png"
                      style="width: 100%; height: 100%"
                    ></v-img>
                  </div>
                  <div class="d-md-flex d-block">
                    <p class="my-1 mx-2 align-self-center">
                      {{
                        new Date(item.created_at).toLocaleString(['ban','id'], {
                          hour12: false,

                        })
                      }}
                    </p>
                    <rating-stars :rating="item.rating"></rating-stars>
                  </div>
                </div>
              </div>
              <div class="bg-white pa-2">
                <p>{{ item.message }}</p>
              </div>
            </div>
            <v-card v-if="reviews.length === 0" class="my-5 pa-3" elevation="2">
              <v-icon icon="mdi-alert-circle"></v-icon> لا يوجد اراء</v-card
            >
          </div>
          <!-- <div class="text-center">
                        <v-btn variant="tonal" color="black" v-if="currentReviews.length < reviews.length"
                            @click="pageNumber++"> اعرض المزيد من التقييمات </v-btn>
                    </div> -->
        </div>
      </v-col>

      <v-col md="2" sm="0">
        <bannar-slide :banner="leftBanner"></bannar-slide>
      </v-col>
    </v-row>
    <v-dialog
      v-model="showConfirmDialog"
      transition="dialog-top-transition"
      width="auto"
    >
      <v-card elevation="4" class="text-center" max-width="800">
        <v-card-text class="text-h6">
          <v-card-title class="text-h5">يرجى تأكيد عملية الشراء</v-card-title>
          <!-- <div class="">
                        يرجى تأكيد عملية الشراء
                    </div> -->
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="red" @click="showConfirmDialog = false">إغلاق</v-btn>
          <v-btn
            :loading="confirmLoading"
            variant="flat"
            color="success"
            @click="confirmSubscribtion()"
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
const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();
const route = useRoute();

const rightBanner = ref();
const leftBanner = ref();
const topBanner = ref();

// const rate = ref();

const service = ref();
const id = ref();
const reviews = ref();

const showConfirmDialog = ref(false);
const checkSubscription = ref(false);
const confirmLoading = ref(false);
const checkPointsLoading = ref(false);
const subscribeId = ref<any>();
const { data, error } = await useSendRequest<responseReturn>(
  "/services/getServiceInfo",
  {
    slug: route.params.slug,
  }
);

if (error.value) {
  setToastMessage(error.value.message);
} else if (data.value?.status) {
  service.value = data.value.data;
  id.value = service.value.id;
} else {
  setToastMessage(data.value?.message as string);
}

(async () => {
  const { data, error } = await useSendRequest<responseReturn>(
    "/services/getServiceReview",
    {
      slug: route.params.slug,
    }
  );
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    reviews.value = data.value.data;
  } else {
    setToastMessage(data.value?.message as string);
  }
})();

(async () => {
  const { data, error } = await useSendRequest<responseReturn>(
    "/services/checkSubscription",
    {
      slug: route.params.slug,
      token: authStore.token,
    }
  );
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    checkSubscription.value = true;
    subscribeId.value = data.value.data.id;
  } else {
    checkSubscription.value = false;
  }
})();

async function checkUserPoints() {
  if (!authStore.isLogin) return setToastMessage("يلزمك تسجيل الدخول للشراء");
  checkPointsLoading.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/services/checkServicePoints",
    {
      user_id: authStore.token.user_id,
      service_id: service.value.id,
      token: authStore.token,
    }
  );
  checkPointsLoading.value = false;
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    showConfirmDialog.value = true;
  } else {
    setToastMessage(data.value?.message as string);
  }
}

async function confirmSubscribtion() {
  confirmLoading.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/services/confirmSubscribe",
    {
      service_id: service.value.id,
      token: authStore.token,
    }
  );
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    checkSubscription.value = true;
    showConfirmDialog.value = false;
    setToastMessage(data.value?.message as string);
    useSendRequest("/notificatoin/admin/new-subscribe", {
      dataNotify: data.value.data,
    });
    navigateTo("/services/holdings");
  } else {
    setToastMessage(data.value?.message as string);
  }
  confirmLoading.value = false;
}

useHead({
  title:service.value.title,
  meta: [
    { name: "description", content: service.value.details },
    { property: "og:description", content: service.value.details },
    { property: "og:image", content: '/images/مناقشات.png' },
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