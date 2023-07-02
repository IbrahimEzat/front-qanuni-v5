<template>
  <div>
    <v-row class="mt-5">
      <v-col cols="6" md="4" @click="$router.push('/admin/categories')">
        <v-sheet
          class="py-2"
          color=""
          elevation="8"
          style="border-right: 6px solid #0a3442; border-radius: 15px 0 0 15px"
        >
          <v-list-item active-color="primary">
            <template v-slot:prepend>
              <v-img
                style="width: 79px; height: 110px"
                cover
                src="/images/تصنيفات.jpeg"
              >
              </v-img>
            </template>

            <div class="text-center">
              <p class="text-h5 font-weight-bold">التصنيفات</p>
              <p class="text-h6">{{ statistics.categories }}</p>
            </div>
          </v-list-item>
        </v-sheet>
      </v-col>

      <v-col cols="6" md="4" @click="$router.push('/admin/blogs')">
        <v-sheet
          class="pa-2"
          color=""
          elevation="8"
          style="
            border-right: 6px solid rgb(114, 223, 217);
            border-radius: 15px 0 0 15px;
          "
        >
          <v-list-item active-color="primary">
            <template v-slot:prepend>
              <v-img
                style="width: 80px; height: 110px"
                src="/images/مقالات.png"
              >
              </v-img>
            </template>

            <div class="text-center">
              <p class="text-h5 font-weight-bold">مقالات</p>
              <p class="text-h6">{{ statistics.blogs }}</p>
            </div>
          </v-list-item>
        </v-sheet>
      </v-col>

      <v-col cols="6" md="4" @click="$router.push('/admin/discussions')">
        <v-sheet
          class="pa-2"
          color=""
          elevation="8"
          style="border-right: 6px solid #ff6978; border-radius: 15px 0 0 15px"
        >
          <v-list-item active-color="primary">
            <template v-slot:prepend>
              <v-img
                style="width: 80px; height: 110px"
                src="/images/مناقشات.png"
              >
              </v-img>
            </template>

            <div class="text-center ms-2">
              <p class="text-h5 font-weight-bold">مناقشات</p>
              <p class="text-h6">{{ statistics.discussions }}</p>
            </div>
          </v-list-item>
        </v-sheet>
      </v-col>
      <v-col cols="6" md="4" @click="$router.push('/admin/surveys')">
        <v-sheet
          class="py-2"
          color=""
          elevation="8"
          style="border-right: 6px solid #d9d9ff; border-radius: 15px 0 0 15px"
        >
          <v-list-item active-color="primary">
            <template v-slot:prepend>
              <v-img
                style="width: 80px; height: 110px"
                src="/images/استطلاعات.png"
              >
              </v-img>
            </template>

            <div class="text-center">
              <p class="text-h5 font-weight-bold">استطلاعات</p>
              <p class="text-h6">{{ statistics.surveys }}</p>
            </div>
          </v-list-item>
        </v-sheet>
      </v-col>
      <v-col cols="6" md="4" @click="$router.push('/admin/services')">
        <v-sheet
          class="py-2"
          color=""
          elevation="8"
          style="border-right: 6px solid #00bb77; border-radius: 15px 0 0 15px"
        >
          <v-list-item active-color="primary">
            <template v-slot:prepend>
              <v-img
                style="width: 80px; height: 110px"
                src="/images/market.png"
              >
              </v-img>
            </template>

            <div class="text-center">
              <p class="text-h5 font-weight-bold">الخدمات</p>
              <p class="text-h6">{{ statistics.services }}</p>
            </div>
          </v-list-item>
        </v-sheet>
      </v-col>

      <v-col cols="6" md="4" @click="$router.push('/admin/library')">
        <v-sheet
          class="py-2"
          color=""
          elevation="8"
          style="border-right: 6px solid #ffb531; border-radius: 15px 0 0 15px"
        >
          <v-list-item active-color="primary">
            <template v-slot:prepend>
              <v-img
                style="width: 80px; height: 110px"
                src="/images/المكتبة.png"
              >
              </v-img>
            </template>

            <div class="text-center">
              <p class="text-h5 font-weight-bold">المكتبة</p>
              <p class="text-h6">{{ statistics.libraries }}</p>
            </div>
          </v-list-item>
        </v-sheet>
      </v-col>
      <v-col cols="6" md="4" @click="$router.push('/admin/exams')">
        <v-sheet
          class="py-2"
          color=""
          elevation="8"
          style="border-right: 6px solid #ffb531; border-radius: 15px 0 0 15px"
        >
          <v-list-item active-color="primary">
            <template v-slot:prepend>
              <v-img
                style="width: 80px; height: 110px"
                src="/images/اختبارات.png"
              >
              </v-img>
            </template>

            <div class="text-center">
              <p class="text-h5 font-weight-bold">اختبارات</p>
              <p class="text-h6">{{ statistics.exams }}</p>
            </div>
          </v-list-item>
        </v-sheet>
      </v-col>

      <v-list-group
        class="text-black mb-1"
        style="background: #fefefe; border-radius: 5px"
      >
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-group-outline"
            title=" الصفحات الثابتة "
          ></v-list-item>
        </template>
        <v-list-item
          @click="goToUrl('/admin/staticPages/addAboutSite')"
          title="معلومات حول الموقع"
        ></v-list-item>
        <v-list-item
          @click="goToUrl('/admin/staticPages/questions')"
          title="الاسئلة المكررة"
        ></v-list-item>
        <v-list-item
          @click="goToUrl('/admin/staticPages/usage')"
          title=" اتفافية الاستخدام والخصوصية"
        ></v-list-item>
        <v-list-item
          @click="goToUrl('/admin/staticPages/copyrights')"
          title="جميع حقوق النشر محفوطة"
        ></v-list-item>
      </v-list-group>

      <v-col cols="6" md="4" @click="$router.push('/admin/competition')">
        <v-sheet
          class="py-2"
          color=""
          elevation="8"
          style="border-right: 6px solid #154; border-radius: 15px 0 0 15px"
        >
          <v-list-item active-color="primary">
            <template v-slot:prepend>
              <v-img
                style="width: 80px; height: 110px"
                src="/images/مسابقات.png"
              >
              </v-img>
            </template>

            <div class="text-center">
              <p class="text-h5 font-weight-bold">مسابقات</p>
              <p class="text-h6">{{ statistics.comtitions }}</p>
            </div>
          </v-list-item>
        </v-sheet>
      </v-col>
      <v-col cols="6" md="4" @click="$router.push('/admin/users')">
        <v-sheet
          class="py-2"
          color=""
          elevation="8"
          style="border-right: 6px solid #3788aa; border-radius: 15px 0 0 15px"
        >
          <v-list-item active-color="primary">
            <template v-slot:prepend>
              <v-img
                style="width: 79px; height: 110px"
                src="/images/users.jpeg"
              >
              </v-img>
            </template>

            <div class="text-center">
              <p class="text-h5 font-weight-bold">المستخدمين</p>
              <p class="text-h6">{{ statistics.users }}</p>
            </div>
          </v-list-item>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { responseReturn, tokenType } from "~/types/tpes";
import { useSettingsStore } from "~/stores/useSettings";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "is-admin"],
});

const authStore = useAuthStore();
const statistics = ref();

const { data, error } = await useSendRequest<responseReturn>("/getStatistics", {
  token: authStore.token,
});

if (!error.value && data.value?.status) {
  statistics.value = data.value.data;
}
</script>

<style scoped>
.v-sheet:hover {
  opacity: 0.7;
  cursor: pointer;
}
</style>