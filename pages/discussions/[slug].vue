<template>
  <v-card min-height="100vh" color="#f4f4f4" class="">
    <v-row class="mx-1">
      <v-col md="2" sm="0">
        <bannar-slide></bannar-slide>
      </v-col>
      <v-col
        style="border: 1px solid #999"
        class="bg-white mb-5 mt-sm-8 pa-0 pb-16"
        md="8"
        sm="11"
        cols="12"
      >
        <div style="background-color: #fdf8ef; width: 100%" class="pa-3">
          <div class="d-flex justify-space-between">
            <span class="font-weight-bold pt-2 ml-5"
              ><nuxt-link
                class="text-decoration-none font-weight-bold"
                to="/discussions"
                >مناقشات</nuxt-link
              >
              <span>/ {{ categoryInfo.name }}</span></span
            >

            <div class="imageHolder mt-2 pointer" @click="tryGoToAddDiscussion">
              <v-btn
                rounded="xl"
                prepend-icon="mdi-pencil-circle-outline"
                color="black"
                >افتح مناقشة</v-btn
              >
            </div>
          </div>
          <div class="d-flex justify-space-between mt-5">
            <p class="font-weight-bold mt-3 ml-8 d-md-block d-none">
              يحتوي على :
              <span style="color: red"> {{ discussions.length }} مناقشات</span>
            </p>
            <div class="d-flex">
              <v-select
                label="Select"
                style="min-width: 200px; height: 45px"
                variant="outlined"
                class="pa-0 ml-10"
                density="compact"
                v-model="filterSelect"
                item-title="name"
                item-value="value"
                :items="[
                  { name: 'الاحدث اولا', value: 'newest' },
                  { name: 'الاقدم اولا', value: 'oldest' },
                  { name: 'الاكثر مشاهدة', value: 'mostViews' },
                  { name: 'الاقل مشاهدة', value: 'leastViews' },
                  { name: 'الاكثر تفضيلا', value: 'mostFavioret' },
                  { name: 'الاكثر تعليقا', value: 'mostCommentCount' },
                  { name: 'الاقل تعليقا', value: 'leastCommentCount' },
                  { name: 'الاقل تقييما', value: 'leastRating' },
                  { name: 'الأكثر تقييما', value: 'mostRating' },
                ]"
              >
                <template v-slot:item="{ props }">
                  <v-list-item v-bind="props" class="text-end"></v-list-item>
                </template>
              </v-select>
            </div>
            <v-text-field
              clearable
              style="max-width: 200px; max-height: 9px"
              class="rounded-pill"
              label="ابحث"
              density="compact"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
            ></v-text-field>
          </div>
          <p class="font-weight-bold mt-3 ml-8 d-md-none d-block">
            يحتوي على :
            <span style="color: red"> {{ discussions.length }} مناقشات</span>
          </p>
        </div>
        <bannar-center></bannar-center>
        <v-card
          border
          class="mx-2 my-10 pa-5 justify-center d-flex"
          style="width: 97.5%; border-radius: 20px"
          v-for="discussion in currentDiscussions"
          :key="discussion.id"
        >
          <v-row
            class="pointer justify-center"
            @click="goToUrl('/discussions/view/' + discussion.id)"
          >
            <v-col sm="10" cols="12">
              <h6 class="d-flex justify-center">
                <p
                  class="text-h5 text-center"
                  style="
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    width: 345px;
                    overflow: hidden;
                  "
                >
                  {{ discussion.title }}
                </p>
              </h6>
              <div class="d-flex">
                <div class="imageHolder" style="width: 40px; height: 40px">
                  <v-avatar>
                    <v-img cover :src="discussion.user.image"></v-img>
                  </v-avatar>
                </div>
                <p class="align-self-center font-weight-bold mr-2">
                  {{ discussion.user.name }}
                </p>

                <!-- <v-banner border="none" lines="one" :text="blog.content" class="font-weight-black" >
                    </v-banner> -->
                <hr
                  style="border-top: 1px solid black"
                  class="align-self-center flex-grow-1 ms-3"
                />
                <!-- <v-divider class="border-opacity-100 align-self-center mr-3 " style="max-width: 75%; min-width: 75%;"></v-divider> -->
              </div>
              <div class="d-flex justify-end">
                <div
                  class="imageHolder ml-1 align-self-center"
                  style="width: 15px; height: 15px"
                >
                  <v-img
                    src="/images/تاريخ.png"
                    style="width: 100%; height: 100%"
                  ></v-img>
                </div>
                <p class="text-body-2 ml-4 mt-1 align-self-center">
                  {{
                    new Date(discussion.created_at).toLocaleDateString(
                      ["ban", "id"],
                      {
                        hour12: false,
                      }
                    )
                  }}
                </p>
                <div
                  class="imageHolder ml-1 align-self-center"
                  style="width: 15px; height: 15px"
                >
                  <v-img
                    src="/images/عدد-المشاهدات.png"
                    style="width: 100%; height: 100%"
                  ></v-img>
                </div>
                <p class="text-body-2 ml-4 mt-1 align-self-center">
                  {{ discussion.discussion_views.count_views }}
                </p>
                <div
                  class="imageHolder ml-1 align-self-center"
                  style="width: 15px; height: 15px"
                >
                  <v-img
                    src="/images/عدد-التعليقات.png"
                    style="width: 100%; height: 100%"
                  ></v-img>
                </div>
                <p class="text-body-2 ml-4 mt-1 align-self-center">
                  {{ discussion.discussion_opinion_count.count_opinions }}
                </p>
                <div
                  class="imageHolder ml-1 align-self-center"
                  style="width: 15px; height: 15px"
                >
                  <v-img
                    src="/images/قائمة-المفضلة-قبل-الضغط.png"
                    style="width: 100%; height: 100%"
                  ></v-img>
                </div>
                <p class="text-body-2 mt-1 align-self-center">
                  {{ discussion.discussion_stars.count_stars }}
                </p>
              </div>
            </v-col>
            <v-col sm="2" cols="7" align-self="center">
              <p
                style="
                  border: 2px solid #333;
                  border-radius: 10px;
                  text-align: center;
                  background-color: white;
                "
                class="py-5"
              >
                <span class="text-body-1 text-md-h6">
                  {{ discussion.discussion_points.count_points }}
                </span>
                <span class="text-body-1 text-md-h6"> نقطة</span>
              </p>
            </v-col>
          </v-row>
        </v-card>
        <div class="text-center">
          <v-btn
            variant="tonal"
            color="black"
            v-if="currentDiscussions.length < discussionsSearch.length"
            @click="pageNumber++"
            >عرض المزيد</v-btn
          >
        </div>

        <v-alert class="ma-3" type="info" v-if="discussionsSearch.length === 0"
          >لا يوجد مناقشات لعرضها</v-alert
        >
        <div class="d-md-none d-block">
          <bannar-center></bannar-center>
          <!-- <bannar-center></bannar-center> -->
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
  </v-card>
</template>
      
  <script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";
const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();
const filterSelect = ref("newest");
const route = useRoute();
const categoryInfo = ref();
const pageNumber = ref(1);
const dialog = ref();
const search = ref();

const itemPerPage = ref(8);
const discussions = ref();

const discussionsSearch = computed(() => {
  if (search.value) {
    return fillterDiscussions.value.filter((item: any) => {
      return item.title.toLowerCase().search(search.value.toLowerCase()) > -1;
    });
  }
  return fillterDiscussions.value;
});
const fillterDiscussions = computed(() => {
  if (filterSelect.value === "newest") {
    return discussions.value.sort(function (a: any, b: any): number {
      if (a.created_at < b.created_at) return 1;
      return -1;
    });
  } else if (filterSelect.value === "oldest") {
    return discussions.value.sort(function (a: any, b: any): number {
      if (a.created_at > b.created_at) return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostViews") {
    return discussions.value.sort(function (a: any, b: any): number {
      if (a.discussion_views.count_views < b.discussion_views.count_views)
        return 1;
      return -1;
    });
  } else if (filterSelect.value === "leastViews") {
    return discussions.value.sort(function (a: any, b: any): number {
      if (a.discussion_views.count_views > b.discussion_views.count_views)
        return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostFavioret") {
    return discussions.value.sort(function (a: any, b: any): number {
      if (a.discussion_stars.count_stars < b.discussion_stars.count_stars)
        return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostCommentCount") {
    return discussions.value.sort(function (a: any, b: any): number {
      if (
        a.discussion_opinion_count.count_opinions <
        b.discussion_opinion_count.count_opinions
      )
        return 1;
      return -1;
    });
  } else if (filterSelect.value === "leastCommentCount") {
    return discussions.value.sort(function (a: any, b: any): number {
      if (
        a.discussion_opinion_count.count_opinions >
        b.discussion_opinion_count.count_opinions
      )
        return 1;
      return -1;
    });
  } else if (filterSelect.value === "leastRating") {
    return discussions.value.sort(function (a: any, b: any): number {
      if (a.discussion_points.count_points > b.discussion_points.count_points)
        return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostRating") {
    return discussions.value.sort(function (a: any, b: any): number {
      if (a.discussion_points.count_points < b.discussion_points.count_points)
        return 1;
      return -1;
    });
  }
  return discussions.value;
});

function goToUrl(url: string) {
  window.location.href = url;
}

const currentDiscussions = computed(() => {
  return discussionsSearch.value.slice(0, itemPerPage.value * pageNumber.value);
});

const { data, error } = await useSendRequest<responseReturn>(
  "/discussions/getDiscussionsInCategory",
  { slug: route.params.slug }
);
if (error.value) {
  setToastMessage("حدث خظأ ما الرجاء اعادة تحميل الصفحة");
} else {
  if (data.value?.status) {
    categoryInfo.value = data.value.data;
    discussions.value = categoryInfo.value.discussions;
  }
}

function tryGoToAddDiscussion() {
  if (authStore.isLogin) return (window.location.href = "/discussions/add");
  dialog.value = true;
}
useHead({
  title: "مناقشات - " + categoryInfo.value.name,
  meta: [
    {
      name: "description",
      content:
        "تحتوي هذه الصفحة على أهم المناقشات المتعلقة بتصنيف " +
        categoryInfo.value.name,
    },
    {
      property: "og:description",
      content:
        "تحتوي هذه الصفحة على أهم المناقشات المتعلقة بتصنيف " +
        categoryInfo.value.name,
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
      
    <style>
.pointer {
  cursor: pointer;
}
</style>