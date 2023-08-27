<template>
  <div>
    <div class="bg-white">
      <div v-if="!authStore.isLogin" class="text-center py-5" style="background-color: #fcc628">
        <h4>قم بتسجيل الدخول لكي تستطيع إضافة مقالة أو التفاعل مع الاخرين</h4>
        <div class="d-flex justify-center mt-5">
          <NuxtLink to="/signup?redirect=/blogs"><v-btn class="bg-green" style="border-radius: 0">أنشئ حساب مجانا</v-btn>
          </NuxtLink>
          <NuxtLink to="/login?redirect=/blogs">
            <v-btn class="ms-3 bg-blue" style="border-radius: 0">تسجيل دخول</v-btn>
          </NuxtLink>
        </div>
      </div>
      <div v-else class="text-center py-5 text-white" style="background-color: #27343a">
        <h4>
          مرحبا
          <span v-if="authStore.user_gender == 'male'">سيدي
            <span style="color: #10b7d5">{{ authStore.user_name }}</span>
            نتمنى أن تشاركنا بمقالة من إنجازك

          </span>
          <span v-else>سيدتي
            <span style="color: #a63ab8">{{ authStore.user_name }}</span>
            نتمنى أن تشاركينا بمقالة من إنجازك

          </span>
        </h4>
        <div class="d-flex justify-center mt-5">
          <v-btn class="rounded-pill d-flex align-center" style="background-color: #fcc628" @click="tryGoToAddBlog"><img
              style="object-fit: cover; width: 24px; height: 24px" src="/images/add-blog.png" /><span class="ms-3">إضافة
              مقالة</span></v-btn>
        </div>
      </div>
      <div class="text-center my-8">
        <h4>
          مجموع عدد المقالات المنشورة بمنصة القانوني يبلغ:
          <span class="text-green">{{ blogNumber }}</span>مقالة
        </h4>
        <div>
          <v-text-field clearable v-model="search" @keyup.enter.prevent="goToSearchPage"
            style="width: 250px; max-height: 40px;" class="mx-auto mt-3" label="ابحث عن مقالة" density="compact"
            prepend-inner-icon="mdi-magnify" variant="outlined"></v-text-field>
        </div>
      </div>

      <div class="py-5" style="background-color: #f0f0f0">
        <h2 class="text-center mb-2">تصنيفات المقالات:</h2>
        <div dir="ltr" class="slider-topics">
          <div class="swiper-button image-swiper-button-prev">
            <v-icon size="x-large" color="#27343a" icon="mdi-arrow-left-bold-circle"></v-icon>
          </div>
          <div class="swiper-button image-swiper-button-next">
            <v-icon size="x-large" color="#27343a" icon="mdi-arrow-right-bold-circle"></v-icon>
          </div>
          <Swiper :modules="[SwiperEffectCreative, SwiperNavigation]" :slides-per-view="1" :space-between="20"
            class="mySwiper" :navigation="{
              nextEl: '.image-swiper-button-prev',
              prevEl: '.image-swiper-button-next',
              disabledClass: 'swiper-button-disabled',
            }">
            <SwiperSlide v-for="slide in Math.ceil(topics.length / 6) " :key="slide"
              class="d-flex justify-center flex-wrap gab-2" style="width: 100%;">

              <div v-for="item in 6" :key="topics.length + item * 6">
                <div @click="$router.push('/showBlogs/' + topics[(item - 1) + ((slide - 1) * 6)].slug)">
                  <v-card v-if="topics[(item - 1) + ((slide - 1) * 6)]" class="slide pointer ma-3 " style="width: 300px;">
                    <div class="imageHolder">
                      <img style="" :src="topics[(item - 1) + ((slide - 1) * 6)].image" alt="" />
                    </div>
                    <div style="border-radius: 0 0 10px 10px" class="bg-white text-center py-2">
                      {{ topics[(item - 1) + ((slide - 1) * 6)].name }}

                    </div>
                  </v-card>
                </div>

              </div>


            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <div class="py-5 px-2">
        <h2 class="text-center mb-5">الكلمات المفتاحية:</h2>
        <div class="d-flex flex-wrap justify-center align-center">
          <div v-for="category in categories" :key="category.id" v-show="category.blogs_count != 0">
            <v-sheet @click="$router.push('/showBlogs/' + category.slug)" :color="category.background"
              style="position: relative" class="text-center mb-3 me-3 pa-3 rounded-lg pointer"
              :style="[{ color: category.color + '' }, { 'font-weight': 500 }]">
              <p>{{ category.name }}</p>
              <v-badge color="red" :content="category.blogs_count" style="position: absolute; top: 0; right: 0"></v-badge>
            </v-sheet>
          </div>
        </div>

        <v-alert v-if="blogNumber == 0" type="info">لا يوجد تصنيفات فالموقع</v-alert>
      </div>
    </div>
    <v-dialog v-model="dialog" transition="dialog-top-transition" width="auto">
      <v-card elevation="4" class="text-center" max-width="300">
        <v-card-text class="text-h6">
          <v-card-title class="text-error text-h4">عفوا</v-card-title>
          <div class="">
            أنت لا تستطيع إضافة مقالة يجب عليك تسجيل الدخول أولا
          </div>
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
const blogNumber = ref(0);
const authStore = useAuthStore();
const search = ref();
const categories = ref<
  {
    name: string;
    color: string;
    background: string;
    slug: string;
    blogs_count: number;
  }[]
>();
const topics = ref([]);
const slideLength = ref(Math.ceil(topics.value.length / 2) > 2 ? 3 : (Math.ceil(topics.value.length / 2) > 1) ? 2 : 1);

const { setToastMessage } = useSettingsStore();

const { data: topicData, error: topicError } = await useSendRequest<responseReturn>('/blogs/getTopic', {});
if (topicError.value) {
  setToastMessage("حدث خطا ما");
} else {
  if (topicData.value?.status) {
    topics.value = topicData.value.data;
  } else {
    setToastMessage(topicData.value?.message + "");
  }
}

const { data, error } = await useSendRequest<responseReturn>(
  "/categories/blog",
  {}
);
if (error.value) {
  setToastMessage("حدث خطا ما");
} else {
  if (data.value?.status) {
    categories.value = data.value.data as {
      name: string;
      color: string;
      background: string;
      slug: string;
      blogs_count: number;
    }[];
  } else {
    setToastMessage(data.value?.message + "");
  }
}

const { data: countData, error: errorCount } =
  await useSendRequest<responseReturn>("/blogs/count", {});

if (!errorCount.value && countData.value?.status)
  blogNumber.value = countData.value.data as number;

function tryGoToAddBlog() {
  if (authStore.isLogin) return (window.location.href = "/addBlog");
  dialog.value = true;
}

function goToSearchPage() {
  if (search.value) navigateTo("/blog/search/" + search.value);
}

useHead({
  title: "القانوني - تصنيفات|مقالات",
  meta: [
    {
      name: "description",
      content: "تحتوي هذه الصفحة على التصنيفات الخاصة بأهم المقالات",
    },
    {
      property: "og:description",
      content: "تحتوي هذه الصفحة على التصنيفات الخاصة بأهم المقالات",
    },
    { property: "og:image", content: "/images/مقالات.png" },
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

.imageHolder {
  height: 200px;
}

.imageHolder img {
  width: 100%;
  height: 100%;
  transition: all 0.25s;
}

.slider-topics {
  width: 80%;
  margin: auto;
  position: relative;
}

.swiper-button {
  display: flex;
  position: absolute;
  top: calc(50% - 12px);
  z-index: 10;
  cursor: pointer;
}

.swiper-button {
  width: 1.5rem;
  height: 1.5rem;
}

.image-swiper-button-prev {
  left: -25px;
}

.image-swiper-button-next {
  right: -25px;
}

.swiper-button-disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* .slide{
  max-width: 500px;
  min-width: 32%;
} */
.slide:hover {
  transform: scale(1.05);
  box-shadow: 0px 0px 20px #aaa;
}
</style>
