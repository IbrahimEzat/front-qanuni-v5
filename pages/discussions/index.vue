<template>
  <div class="bg-blue-grey-lighten-5">
    <v-row class="">
      <v-col md="2" sm="0">
        <bannar-slide></bannar-slide>
      </v-col>
      <v-col md="8" cols="12" class="bg-white my-8 pa-5">
        <v-row
          style="background-color: #fdf8ef"
          class="mx-3 d-flex justify-space-between"
        >
          <v-col
            sm="5"
            cols="12"
            class="d-flex justify-space-between pe-xs-12 pe-1"
          >
            <span class="font-weight-bold pt-2">مناقشات/تصنيفات</span>

            <div class="imageHolder mt-2 pointer" @click="tryGoToAddDiscussion">
              <v-btn
                rounded="xl"
                prepend-icon="mdi-pencil-circle-outline"
                color="black"
                >افتح مناقشة</v-btn
              >
            </div>
          </v-col>
          <v-col sm="7" cols="12" class="d-flex justify-space-between">
            <p class="font-weight-bold mt-3">
              يحتوي على :
              <span style="color: red"> {{ discussionNumber }} مناقشات</span>
            </p>
            <v-text-field
              clearable
              style="max-width: 250px; min-width: 150px; max-height: 40px"
              class="rounded-pill mt-1"
              label="ابحث"
              density="compact"
              v-model="search"
              @keyup.enter.prevent="goToSearch"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>

        <bannar-center></bannar-center>
        <div class="ma-3 pa-5">
          <div class="d-flex flex-wrap align-center">
            <div
              v-for="category in categories"
              :key="category.id"
              v-show="category.discussions_count != 0"
            >
              <v-sheet
                @click="$router.push('/discussions/' + category.slug)"
                :color="category.background"
                style="position: relative; max-width: 230px"
                class="text-center mb-3 me-3 pa-3 rounded-lg text-h6 pointer"
                :style="{ color: category.color + '' }"
                ><p>{{ category.name }}</p>
                <v-badge
                  color="red"
                  :content="category.discussions_count"
                  style="position: absolute; top: 0; right: 0"
                ></v-badge>
              </v-sheet>
            </div>
          </div>
          <!-- <v-row>
            <v-col v-show="category.discussions_count != 0" sm="4" md="3" cols="6" v-for="(category) in categories" :key="category.id">
              <v-sheet @click="$router.push('/discussions/' + category.slug)"
                :color="category.background" class="text-center pa-3 rounded-pill text-h6 pointer"
                :style="{ color: category.color + '' }">{{ category.name }}({{ category.discussions_count }}) </v-sheet>
            </v-col>
          </v-row> -->
          <v-alert v-if="discussionNumber == 0" type="info"
            >لا يوجد تصنيفات فالموقع</v-alert
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
          <div class="">
            أنت لا تستطيع إضافة مناقشة يجب عليك تسجيل الدخول أولا
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
const discussionNumber = ref(-1);
const search = ref();
const authStore = useAuthStore();
const categories =
  ref<
    {
      name: string;
      color: string;
      background: string;
      slug: string;
      discussions_count: number;
    }[]
  >();
const { setToastMessage } = useSettingsStore();
const { data, error } = await useSendRequest<responseReturn>(
  "/categories/CategotiesWithDiscussions",
  {}
);
if (error.value) {
  setToastMessage(error.value.message);
} else {
  if (data.value?.status) {
    categories.value = data.value.data as {
      name: string;
      color: string;
      background: string;
      slug: string;
      discussions_count: number;
    }[];
  } else {
    const msg = data.value?.message as string;
    setToastMessage(msg);
  }
}
const { data: countData, error: errorCount } =
  await useSendRequest<responseReturn>("/discussions/count", {});

if (!errorCount.value && countData.value?.status)
  discussionNumber.value = countData.value.data as number;

function tryGoToAddDiscussion() {
  if (authStore.isLogin) return (window.location.href = "/discussions/add");
  dialog.value = true;
}
function goToSearch() {
  if (search.value) {
    return navigateTo("/discussions/search/" + search.value);
  }
}

useHead({
  title: "القانوني - تصنيفات|مناقشات",
  meta: [
    {
      name: "description",
      content: "تحتوي هذه الصفحة على التصنيفات الخاصة بأهم المناقشات",
    },
    {
      property: "og:description",
      content: "تحتوي هذه الصفحة على التصنيفات الخاصة بأهم المناقشات",
    },
    { property: "og:image", content: "/images/مناقشات.png" },
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
</style>
