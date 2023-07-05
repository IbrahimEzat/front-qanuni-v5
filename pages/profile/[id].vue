<template>
  <div
    dir="rtl"
    style="min-height: 100vh"
    v-if="info"
    class="bg-blue-grey-lighten-5"
  >
    <v-row>
      <v-col cols="2" class="ma-0">
        <!-- <bannar-slide></bannar-slide> -->
      </v-col>
      <v-col
        class="bg-white my-sm-8 my-8 pa-0 mx-auto pb-10"
        md="8"
        sm="11"
        cols="11"
      >
        <div
          style="background-color: #fdf8ef; width: 100%"
          class="d-flex justify-space-between px-3"
        >
          <p style="width: 80%" class="font-weight-bold pa-4">
            الصفحة الشخصية / {{ info.name }}
          </p>
        </div>
        <bannar-center />
        <div>
          <v-row class="ma-6">
            <v-col
              cols="12"
              md="3"
              class="text-center rounded-xl px-0"
              style="border: 1px #666 solid"
            >
              <div class="d-md-block d-flex align-center mb-2">
                <v-avatar size="80">
                  <v-img class="rounded-circle" cover :src="info.image"></v-img>
                </v-avatar>
                <p class="text-md-h5 mt-md-2 font-weight-bold ms-1">
                  {{ info.name }}
                </p>
              </div>

              <div class="d-flex ms-5 mb-4">
                <v-img
                  v-if="+route.params.id != authStore.token.user_id"
                  class="bg-white pointer mx-2"
                  @click="$router.push('/chat/' + route.params.id)"
                  style="max-width: 40px; height: 40px"
                  src="/images/رسائل.png"
                ></v-img>
                <!-- <v-icon class="bg-white mx-2 pa-1" icon="mdi-email-outline" size="x-large"></v-icon> -->
                <follow class="mx-1" :id="$route.params.id" />
              </div>
              <div class="text-start ms-5">
                <p v-if="info.job" class="font-weight-bold my-1">
                  المهنة: <span class="font-weight-medium">{{ info.job }}</span>
                </p>
                <p v-if="info.about_me" class="font-weight-bold">نبذة:</p>
                <p v-if="info.about_me" class="font-weight-medium">
                  {{ info.about_me }}
                </p>
              </div>
            </v-col>
            <v-col md="9" cols="12" class="ps-5">
              <div class="my-2">
                <p class="font-weight-bold">الاوسمة التي حصل عليها:</p>
                <div class="border pa-2">
                  <user-bades :userId="$route.params.id" />
                </div>
              </div>
              <div class="rounded-xl mb-3" style="background-color: #e1fbde">
                <p class="text-center text-h5 py-2 font-weight-bold">
                  عدد النقاط المتحصل عليها بالموقع : {{ info.points }} نقطة
                </p>
              </div>
              <div class="d-flex justify-center mb-3">
                <div
                  class="d-flex justify-space-between rounded-xl px-3 py-2 holder"
                  style="border: 1px #999 solid"
                >
                  <div class="d-flex">
                    <v-img
                      cover
                      style="width: 80px; height: 80px"
                      src="/images/مقالات.png"
                    ></v-img>
                    <p
                      class="text-h6 font-weight-bold my-2 ms-2 align-self-center"
                    >
                      عدد المقالات التي نشرها :
                    </p>
                  </div>
                  <p
                    class="text-h5 font-weight-bold my-2 pe-6 align-self-center"
                  >
                    {{ info.blogs_count }}
                  </p>
                </div>
              </div>
              <div class="d-flex justify-center mb-3">
                <div
                  class="d-flex justify-space-between rounded-xl px-3 py-2 holder"
                  style="border: 1px #999 solid"
                >
                  <div class="d-flex">
                    <v-img
                      cover
                      style="width: 80px; height: 80px"
                      src="/images/مناقشات.png"
                    ></v-img>
                    <p
                      class="text-h6 font-weight-bold my-2 ms-2 align-self-center"
                    >
                      عدد المناقشات التي فتحها :
                    </p>
                  </div>
                  <p
                    class="text-h5 font-weight-bold my-2 pe-6 align-self-center"
                  >
                    {{ info.discussions_count }}
                  </p>
                </div>
              </div>
              <div class="d-flex justify-center mb-3">
                <div
                  class="d-flex justify-space-between rounded-xl px-3 py-2 holder"
                  style="border: 1px #999 solid"
                >
                  <div class="d-flex">
                    <v-img
                      cover
                      style="width: 80px; height: 80px"
                      src="/images/المكتبة.png"
                    ></v-img>
                    <p
                      class="text-h6 font-weight-bold my-2 ms-2 align-self-center"
                    >
                      عدد الملفات التي رفعها :
                    </p>
                  </div>
                  <p
                    class="text-h5 font-weight-bold my-2 pe-6 align-self-center"
                  >
                    {{ info.libraries_count }}
                  </p>
                </div>
              </div>
              <div class="d-flex justify-center mb-3">
                <div
                  class="d-flex justify-space-between rounded-xl px-3 py-2 holder"
                  style="border: 1px #999 solid"
                >
                  <div class="d-flex">
                    <v-img
                      cover
                      style="width: 80px; height: 80px"
                      src="/images/استطلاعات.png"
                    ></v-img>
                    <p
                      class="text-h6 font-weight-bold my-2 ms-2 align-self-center"
                    >
                      عدد الإستطلاعات التي أضافها :
                    </p>
                  </div>
                  <p
                    class="text-h5 font-weight-bold my-2 pe-6 align-self-center"
                  >
                    {{ info.surveys_count }}
                  </p>
                </div>
              </div>
              <div class="d-flex justify-center mb-3">
                <div
                  class="d-flex justify-space-between rounded-xl px-3 py-2 holder"
                  style="border: 1px #999 solid"
                >
                  <div class="d-flex">
                    <v-img
                      cover
                      style="width: 80px; height: 80px"
                      src="/images/اختبارات.png"
                    ></v-img>
                    <p
                      class="text-h6 font-weight-bold my-2 ms-2 align-self-center"
                    >
                      عدد الاختبارات التي اجتازها بنجاح :
                    </p>
                  </div>
                  <p
                    class="text-h5 font-weight-bold my-2 pe-6 align-self-center"
                  >
                    {{ info.exams_count }}
                  </p>
                </div>
              </div>
              <div class="d-flex justify-center mb-3">
                <div
                  class="d-flex justify-space-between rounded-xl px-3 py-2 holder"
                  style="border: 1px #999 solid"
                >
                  <div class="d-flex">
                    <v-img
                      cover
                      style="width: 80px; height: 80px"
                      src="/images/مسابقات.png"
                    ></v-img>
                    <p
                      class="text-h6 font-weight-bold my-2 ms-2 align-self-center"
                    >
                      عدد المسابقات التي فاز بها :
                    </p>
                  </div>
                  <p
                    class="text-h5 font-weight-bold my-2 pe-6 align-self-center"
                  >
                    {{ info.competition_prizes_count }}
                  </p>
                </div>
              </div>
              <div class="d-flex justify-center mb-3">
                <div
                  class="d-flex justify-space-between rounded-xl px-3 py-2 holder"
                  style="border: 1px #999 solid"
                >
                  <div class="d-flex">
                    <v-img
                      cover
                      style="width: 80px; height: 80px"
                      src="/images/market.png"
                    ></v-img>
                    <p
                      class="text-h6 font-weight-bold my-2 ms-2 align-self-center"
                    >
                      عدد الخدمات التي اقتناها :
                    </p>
                  </div>
                  <p
                    class="text-h5 font-weight-bold my-2 pe-6 align-self-center"
                  >
                    {{ info.subscriptions_count }}
                  </p>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col cols="2">
        <!-- <bannar-slide></bannar-slide> -->
      </v-col>
    </v-row>
  </div>
</template>
  
<script setup lang="ts">
const info = ref();
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";
const { setToastMessage } = useSettingsStore();
const route = useRoute();
const authStore = useAuthStore();

const { data, error } = await useSendRequest<responseReturn>("/profile/info", {
  user_id: route.params.id,
});
if (error.value) {
  setToastMessage("حدث خطأ اثناء جلب البيانات");
} else if (data.value?.status) {
  info.value = data.value.data;
}

useHead({
  title: info.value.name,
  meta: [
    {
      name: "description",
      content: "الصفحة الشخصية للمستخدم: " + info.value.name,
    },
    {
      property: "og:description",
      content: "الصفحة الشخصية للمستخدم: " + info.value.name,
    },
    { property: "og:image", content: info.value.image },
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
.holder {
  width: 80%;
}

@media screen and (max-width: 750px) {
  .holder {
    width: 95%;
  }
}
</style>