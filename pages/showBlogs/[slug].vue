<template>
  <v-card
    v-if="categoryInfo"
    min-height="100vh"
    color="#f4f4f4"
    dir="rtl"
    class=""
  >
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
                to="/blogs"
                >مقالات</nuxt-link
              >
              <span>/ {{ categoryInfo.name }}</span></span
            >

            <div class="imageHolder mt-2 pointer" @click="goToAddBlog">
              <nuxt-link
                ><v-img :width="100" src="/images/أضف-مقالة.png"></v-img
              ></nuxt-link>
            </div>
          </div>
          <div class="d-flex justify-space-between mt-5">
            <p class="font-weight-bold mt-3 ml-8 d-md-block d-none">
              يحتوي على :
              <span style="color: red"> {{ blogs.length }} مقالات</span>
            </p>
            <div class="d-flex">
              <!-- <span class="font-weight-bold pt-2">ترتيب حسب : </span> -->
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
              v-model="search"
              clearable
              style="max-width: 200px; max-height: 9px"
              class="rounded-pill"
              label="ابحث"
              density="compact"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
            ></v-text-field>
          </div>
          <p class="font-weight-bold mt-3 ml-8 d-md-none d-block">
            يحتوي على :
            <span style="color: red"> {{ blogs.length }} مقالات</span>
          </p>
        </div>
        <bannar-center></bannar-center>
        <v-card
          border
          class="mx-2 my-10 pa-3 justify-center d-flex"
          style="border-radius: 20px"
          v-for="blog in currentBlogs"
          :key="blog.id"
        >
          <v-row class="pointer justify-center" @click="$router.push('/blog/' + blog.slug)">
            <v-col sm="10" cols="12">
              <div>
                <h6 class="text-h5 d-flex justify-center ">
                  <p
                  class="text-center"
                    style="
                      display: -webkit-box;
                      -webkit-line-clamp: 2;
                      -webkit-box-orient: vertical;
                      width: 340px;
                      overflow: hidden;
                    "
                  >
                    {{ blog.title }}
                  </p>
                </h6>
                <div class="d-flex">
                  <div class="imageHolder" style="width: 40px; height: 40px">
                    <v-avatar>
                      <v-img cover :src="blog.user.image"></v-img>
                    </v-avatar>
                  </div>
                  <p class="align-self-center font-weight-bold mr-2">
                    {{ blog.user.name }}
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
                      new Date(blog.created_at).toLocaleString([], {
                        hour12: false,
                      })
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
                    {{ blog.blog_views.blog_views }}
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
                    {{ blog.blog_comment_counts.blog_comments }}
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
                    {{ blog.blog_wish_list_counts.count }}
                  </p>
                </div>
              </div>
            </v-col>
            <v-col sm="2" cols="7" class="font-weight-bold" align-self="center">
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
                  {{ blog.blog_points.blog_points }}
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
            v-if="currentBlogs.length < searchBlogs.length"
            @click="pageNumber++"
            >عرض المزيد</v-btn
          >
        </div>

        <v-alert class="ma-3" type="info" v-if="currentBlogs.length === 0"
          >لا يوجد مقالات لعرضها</v-alert
        >
        <div class="d-md-none d-block">
          <!-- <bannar-center></bannar-center> -->
          <!-- <bannar-center></bannar-center> -->
        </div>
      </v-col>
      <v-col md="2" sm="0">
        <bannar-slide></bannar-slide>
      </v-col>
    </v-row>
  </v-card>
</template>
    
<script setup lang="ts">
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";
const { setToastMessage } = useSettingsStore();
const filterSelect = ref("newest");
const route = useRoute();
const categoryInfo = ref();
const pageNumber = ref(1);

const itemPerPage = ref(10);
const blogs = ref();
const search = ref();
const fillterBlogs = computed(() => {
  if (filterSelect.value === "newest") {
    return blogs.value.sort(function (a: any, b: any): number {
      if (a.created_at < b.created_at) return 1;
      return -1;
    });
  } else if (filterSelect.value === "oldest") {
    return blogs.value.sort(function (a: any, b: any): number {
      if (a.created_at > b.created_at) return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostViews") {
    return blogs.value.sort(function (a: any, b: any): number {
      if (a.blog_views.blog_views < b.blog_views.blog_views) return 1;
      return -1;
    });
  } else if (filterSelect.value === "leastViews") {
    return blogs.value.sort(function (a: any, b: any): number {
      if (a.blog_views.blog_views > b.blog_views.blog_views) return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostFavioret") {
    return blogs.value.sort(function (a: any, b: any): number {
      if (a.blog_wish_list_counts.count < b.blog_wish_list_counts.count)
        return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostCommentCount") {
    return blogs.value.sort(function (a: any, b: any): number {
      if (
        a.blog_comment_counts.blog_comments <
        b.blog_comment_counts.blog_comments
      )
        return 1;
      return -1;
    });
  } else if (filterSelect.value === "leastCommentCount") {
    return blogs.value.sort(function (a: any, b: any): number {
      if (
        a.blog_comment_counts.blog_comments >
        b.blog_comment_counts.blog_comments
      )
        return 1;
      return -1;
    });
  } else if (filterSelect.value === "leastRating") {
    return blogs.value.sort(function (a: any, b: any): number {
      if (a.blog_points.blog_points > b.blog_points.blog_points) return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostRating") {
    return blogs.value.sort(function (a: any, b: any): number {
      if (a.blog_points.blog_points < b.blog_points.blog_points) return 1;
      return -1;
    });
  }
  return blogs.value;
});
const searchBlogs = computed(() => {
  if (search.value)
    return fillterBlogs.value.filter((item: any) => {
      return item.title.includes(search.value);
    });
  return fillterBlogs.value;
});
const currentBlogs = computed(() => {
  return searchBlogs.value.slice(0, itemPerPage.value * pageNumber.value);
});

const { data, error } = await useSendRequest<responseReturn>(
  "/blogs/getBolgsInCategiory",
  { slug: route.params.slug }
);
if (error.value) {
  setToastMessage("Failed Fetching");
} else {
  if (data.value?.status) {
    categoryInfo.value = data.value.data;
    blogs.value = categoryInfo.value.blogs;
  }
}

function goToAddBlog() {
  window.location.href = "/addBlog";
}
useHead({
  title: "مقالات - " + categoryInfo.value.name,
  meta: [
    {
      name: "description",
      content:
        "تحتوي هذه الصفحة على أهم المقالات المتعلقة بتصنيف " +
        categoryInfo.value.name,
    },
    {
      property: "og:description",
      content:
        "تحتوي هذه الصفحة على أهم المقالات المتعلقة بتصنيف " +
        categoryInfo.value.name,
    },
    { property: "og:image", content: "/images/مقالات.png" },
    { name: "twitter:card", content: "summay_large_image" },
    { property: "og:locale", content: "ar_ar" },
    { property: "og:url", content: "https://alqanouni.com/" },
    { property: "og:type", content: "website" },
  ],
  link: [{ rel: "canonical", href: "https://alqanouni.com/" }],
});
</script>
    
  <style></style>
