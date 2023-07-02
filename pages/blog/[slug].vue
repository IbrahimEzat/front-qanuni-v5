<template>
  <div
    v-if="blog"
    dir="rtl"
    style="min-height: 100vh"
    class="bg-blue-grey-lighten-5"
  >
    <v-row>
      <v-col cols="2" class="ma-0">
        <bannar-slide></bannar-slide>
      </v-col>
      <v-col
        style="border: 1px solid #999"
        class="bg-white mt-sm-8 my-8 pa-0 mx-auto pb-10"
        md="8"
        sm="11"
        cols="11"
      >
        <div
          style="background-color: #fdf8ef; width: 100%"
          class="d-flex justify-space-between px-3"
        >
          <p style="width: 80%" class="font-weight-bold pa-4">
            <nuxt-link to="/blogs"> مقالات </nuxt-link> / {{ blog.title }}
          </p>
          <div class="imageHolder align-self-center pointer">
            <v-img
              :width="100"
              src="/images/أضف-مقالة.png"
              @click="tryAddBlog"
            ></v-img>
          </div>
        </div>
        <bannar-center></bannar-center>

        <div class="ma-3" style="width: 97.5%">
          <user-header :userId="blog.user.id" :userImage="blog.user.image"
           :userName="blog.user.name" :userJob="blog.user.job" :userPoints="blog.user.points"/>
          <!-- <v-card
            color="black"
            class="d-md-flex bg-blue-grey-darken-5 rounded-t-xl"
          >
            <div
              class="text-h5 mt-md-0 mt-4 d-flex align-center ps-sm-10 ps-16"
            >
              <follow :id="blog.user.id" />

              <div class="imageHolder d-flex ms-1">
                <v-avatar size="80">
                  <v-img
                    class="pointer"
                    cover
                    :src="blog.user.image"
                    @click="$router.push('/profile/' + blog.user.id)"
                  ></v-img>
                </v-avatar>
              </div>
              <p class="text-h5 mr-3">
                {{ blog.user.name }}
              </p>
            </div>
            <v-divider class="mt-5 d-md-none d-block"></v-divider>
            <div class="pr-1 d-flex mr-sm-11 mr-0 py-5">
              <div
                class="mr-sm-5 mr-8 align-self-center d-md-none d-flex"
                style="width: 100%"
              >
                <div
                  class="d-flex justify-space-between px-1"
                  style="width: 100%"
                >
                  <p>({{ blog.user.job }})</p>
                  <span class="mx-1"
                    >الأوسمة التي حصل عليها :
                    <span class="text-blue">لا شي</span></span
                  >
                  <span>
                    نقاط الكاتب :
                    <span class="text-blue">{{ blog.user.points }}</span></span
                  >
                </div>
              </div>
              <div class="mr-sm-5 mr-8 align-self-center d-md-flex d-none">
                <div>
                  <p>({{ blog.user.job }})</p>
                  <p class="mx-1">
                    الأوسمة التي حصل عليها :
                    <span class="text-blue">لا شي</span>
                  </p>
                  <p>
                    نقاط الكاتب :
                    <span class="text-blue">{{ blog.user.points }}</span>
                  </p>
                </div>
              </div>
            </div>
          </v-card> -->

          <div class="d-flex justify-space-between px-sm-7 px-2 py-3">
            <div
              v-if="!isFavarite"
              class="imageHolder align-self-center pointer"
              @click="toggleWishlist()"
            >
              <v-img
                style="width: 55px; height: 55px"
                src="/images/قائمة-المفضلة-قبل-الضغط.png"
              ></v-img>
            </div>
            <div
              v-if="isFavarite"
              class="imageHolder align-self-center pointer"
              @click="toggleWishlist()"
            >
              <v-img
                style="width: 55px; height: 55px"
                src="/images/قائمة-المفضلة-بعد-الضغط.png"
              ></v-img>
            </div>
            <p class="text-md-h4 text-h5 align-self-center">{{ blog.title }}</p>
            <div>
              <div
                class="imageHolder align-self-center pointer"
                @click="addPoint()"
              >
                <v-img :width="40" src="/images/زائد-كبير.png"></v-img>
              </div>
              <p class="text-center">{{ points }}</p>
              <div
                class="imageHolder align-self-center pointer"
                @click="minusPoint()"
              >
                <v-img :width="40" src="/images/ناقص-كبير.png"></v-img>
              </div>
            </div>
          </div>
          <div
            class="d-flex justify-center bg-blue-grey-lighten-5 py-4 rounded-b-xl"
          >
            <div class="d-flex">
              <div class="imageHolder ml-1" style="width: 30px; height: 30px">
                <v-img
                  src="/images/تاريخ.png"
                  style="width: 100%; height: 100%"
                ></v-img>
              </div>
              <p class="text-sm-h6 ml-4 align-self-center">
                {{
                  new Date(blog.created_at).toLocaleDateString(["ban", "id"])
                }}
              </p>
            </div>
            <div class="d-flex align-self-center-center">
              <div class="imageHolder ml-1" style="width: 30px; height: 30px">
                <v-img
                  src="/images/عدد-المشاهدات.png"
                  style="width: 100%; height: 100%"
                ></v-img>
              </div>
              <p class="text-sm-h6 ml-4 align-self-center">
                {{ blog.blog_views.blog_views }}
              </p>
            </div>
            <div class="d-flex">
              <div
                class="imageHolder ml-1 align-self-center"
                style="width: 30px; height: 30px"
              >
                <v-img
                  src="/images/عدد-التعليقات.png"
                  style="width: 100%; height: 100%"
                ></v-img>
              </div>
              <p class="text-sm-h6 ml-4 align-self-center">
                {{ blog.blog_comment_counts.blog_comments }}
              </p>
            </div>
          </div>
        </div>
        <div class="ma-3">
          <div v-if="blog">
            <div
              id="blogContent"
              class="pa-5 content"
              style="border-bottom: 2px solid black"
              v-html="blog.content"
            ></div>
          </div>
          <!-- add comment -->
          <div v-if="authStore.isLogin">
            <div
              v-if="blog.user_id !== authStore.token.user_id"
              class="px-5 pt-5 bg-blue-grey-lighten-5"
              style="border-bottom: 2px solid black"
            >
              <textarea
                name=""
                id=""
                class="pa-3"
                style="
                  border: 1px solid black;
                  height: 200px;
                  width: 100%;
                  border-radius: 20px;
                "
                v-model="commentInput"
              ></textarea>
              <div class="my-3 text-center">
                <v-btn
                  class="bg-black px-6 text-h6"
                  @click="addComment()"
                  :disabled="commentInput.length < 1"
                  >اضف تعليق</v-btn
                >
              </div>
            </div>
            <div v-else>
              <v-alert class="ma-10" type="info"
                >لا يمكنك التعليق على مقالتك</v-alert
              >
            </div>
          </div>

          <!--end add comment -->

          <!-- no comment -->
          <div
            v-if="!authStore.isLogin"
            class="px-2 py-5 bg-blue-grey-lighten-5 justify-center align-center d-flex"
            style="border-bottom: 2px solid black"
          >
            <div class="imageHolder d-md-block d-none">
              <v-img
                class="mb-2"
                src="/images/لا-تستطيع-التعليق.png"
                style="width: 80px; height: 80px; border-radius: 50%"
              ></v-img>
            </div>
            <div class="text-center">
              <p class="text-md-h4 text-h6">للأسف انت مجرد زائر لذلك قم ب :</p>
              <div class="d-flex">
                <nuxt-link
                  :to="'/login?redirect=' + $route.path"
                  class="d-flex px-3 py-2 pontiner"
                >
                  <img
                    src="/images/تسجيل-الدخول.png"
                    alt=""
                    style="height: 40px"
                  />
                </nuxt-link>
                <span class="text-md-h4 text-h6">او </span>
                <nuxt-link
                  :to="'/signup?redirect=' + $route.path"
                  class="d-flex px-3 py-2 pontiner"
                >
                  <img
                    src="/images/حساب-جديد.png"
                    alt=""
                    style="height: 40px; width: 120px"
                  />
                </nuxt-link>
              </div>
              <p class="text-md-h4 text-h6">لكي تستطيع اضافة تعليق</p>
            </div>
          </div>
          <!--end no comment -->
        </div>
        <!-- comments -->
        <div>
          <div class="d-flex justify-space-between px-5 py-2">
            <p class="text-sm-h5 text-h6">التعليقات ( {{ comments.length }})</p>
            <div class="d-flex">
              <p class="text-sm-h5 text-h6 d-md-block d-none">ترتيب حسب :</p>
              <v-select
                label="Select"
                style="
                  max-width: 200px;
                  min-width: 120px;
                  width: 180px;
                  height: 45px;
                "
                variant="outlined"
                density="compact"
                v-model="filterSelect"
                item-title="name"
                item-value="value"
                :items="[
                  { name: 'الاحدث اولا', value: 'newest' },
                  { name: 'الاقدم اولا', value: 'oldest' },
                ]"
              >
                <template v-slot:item="{ props }">
                  <v-list-item v-bind="props" class="text-end"></v-list-item>
                </template>
              </v-select>
            </div>
          </div>
          <div
            v-for="comment in currentComments"
            :key="comment.id"
            class="bg-grey-darken-4 px-2 pt-2 pb-2 ma-3"
          >
            <div class="d-flex justify-space-between mb-2">
              <div class="d-flex">
                <v-img
                  class="pointer"
                  @click="$router.push('/profile/' + comment.user.id)"
                  cover
                  style="border-radius: 50%; width: 40px; height: 40px"
                  :src="comment.user.image"
                ></v-img>
                <p class="text-sm-h6 text-h6 align-self-center ms-3">
                  {{ comment.user.name }}
                </p>
              </div>
              <div class="d-flex">
                <div
                  class="imageHolder align-self-center"
                  style="width: 25px; height: 25px"
                >
                  <v-icon icon="mdi-calendar-month-outline"></v-icon>
                </div>
                <p class="mt-1 mx-1 align-self-center">
                  {{
                    new Date(comment.created_at).toLocaleString(["ban", "id"], {
                      hour12: false,
                      minute: "numeric",
                      hour: "numeric",
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })
                  }}
                </p>
                <v-icon
                  icon="mdi-close"
                  class="pointer"
                  @click="showDialog(comment.id)"
                  v-if="
                    authStore.isAdmin ||
                    comment.user_id == authStore.token.user_id
                  "
                ></v-icon>
              </div>
            </div>
            <div class="bg-white pa-2">
              <p>{{ comment.comment }}</p>
            </div>
          </div>
        </div>
        <div class="text-center">
          <v-btn
            variant="tonal"
            color="black"
            v-if="currentComments.length < comments.length"
            @click="pageNumber++"
            >عرض المزيد</v-btn
          >
        </div>
        <!-- end comment -->
      </v-col>
      <v-col cols="2">
        <bannar-slide></bannar-slide>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" transition="dialog-top-transition" width="auto">
      <v-card elevation="4" class="text-center" max-width="300">
        <v-card-text class="text-h6">
          <v-card-title class="text-error text-h4">عفوا</v-card-title>
          <div class="">
            أنت لا تستطيع اجراء هذة العميلة يجب عليك تسجيل الدخول أولا
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="flat" color="success" @click="dialog = false"
            >موافق</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deleteDialog"
      transition="dialog-top-transition"
      width="auto"
    >
      <v-card elevation="4" class="text-center" max-width="300">
        <v-card-text class="text-h6">
          <div class="">هل انت متاكد من حذف هذا التعليق</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="flat" color="black" @click="deleteDialog = false"
            >اغلاق</v-btn
          >
          <v-btn
            :loading="deleteLoading"
            variant="flat"
            color="success"
            @click="deleteComment"
            >تأكيد</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
  
<script setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
const { setToastMessage } = useSettingsStore();

const route = useRoute();
const authStore = useAuthStore();

const blog = ref();
const dialog = ref();
const commentInput = ref("");
const badge = ref("لاشي");
const points = ref(58);
const comments = ref();
const isFavarite = ref(false);
const blogContent = ref(null);
const addBlogview = useCookie("addBlogview", {
  maxAge: 60 * 60 * 24,
});
const filterSelect = ref("newest");
const pageNumber = ref(1);
const itemPerPage = ref(10);

const loadWishlist = ref(true);
const loadPoint = ref(true);

const deleteDialog = ref(false);
const deleteLoading = ref(false);
const commentIdWantDelete = ref();

function showDialog(commentId) {
  commentIdWantDelete.value = commentId;
  deleteDialog.value = true;
}

const { data, error } = await useSendRequest("/blogs/show", {
  slug: route.params.slug,
  token: authStore.token,
});
if (error.value) {
  setToastMessage("حدث خطا ما");
} else if (data.value?.status) {
  comments.value = data.value.data.comments;
  blog.value = data.value.data.blog;
  points.value = data.value.data.blog.blog_points.blog_points;
  checkWishList();
  increaseView();
} else {
  setToastMessage(data.value?.message);
  console.log(data.value);
}

const fillterComments = computed(() => {
  if (filterSelect.value === "newest") {
    return comments.value.sort(function (a, b) {
      if (a.created_at < b.created_at) return 1;
      return -1;
    });
  } else if (filterSelect.value === "oldest") {
    return comments.value.sort(function (a, b) {
      if (a.created_at > b.created_at) return 1;
      return -1;
    });
  }
  return comments.value;
});

const currentComments = computed(() => {
  return fillterComments.value.slice(0, itemPerPage.value * pageNumber.value);
});
async function toggleWishlist() {
  if (!loadWishlist.value) return;
  if (authStore.isLogin) {
    loadWishlist.value = false;
    const { data, error } = await useSendRequest("/blogs/addBlogWishList", {
      blog_id: blog.value.id,
      user_id: authStore.token.user_id,
    });
    if (error.value) {
      setToastMessage("حدث خطا ما");
      return;
    }
    if (data.value?.status) {
      isFavarite.value = data.value.data;
      loadWishlist.value = true;

      // setToastMessage('منور');
    }
  } else {
    dialog.value = true;
  }
}
async function increaseView() {
  if (!addBlogview.value || addBlogview.value.indexOf(blog.value.id) == -1) {
    const { data, error } = await useSendRequest("/blogs/increaceView", {
      blog_id: blog.value.id,
      token: authStore.token,
    });
    if (error.value) {
      setToastMessage(error.value.message);
      return;
    }
    if (data.value?.status) {
      if (!addBlogview.value) {
        addBlogview.value = [blog.value.id];
      } else {
        addBlogview.value.push(blog.value.id);
      }
    }
  }
}
async function checkWishList() {
  const { data, error } = await useSendRequest("/blogs/checkWishList", {
    blog_id: blog.value.id,
    user_id: authStore.token.user_id,
  });
  if (error.value) {
    setToastMessage("حدث خطا ما");
    return;
  }
  if (data.value?.status) {
    isFavarite.value = data.value.data;
  }
}

async function addComment() {
  const { data, error } = await useSendRequest("/comments/add", {
    comment: commentInput.value,
    token: authStore.token,
    blog_id: blog.value.id,
  });
  if (error.value) {
    setToastMessage("حدث خطا ما");
    return;
  }
  if (data.value?.status) {
    setToastMessage(data.value.message);
    comments.value.unshift(data.value.data);
    commentInput.value = "";
    sendCommentNotification();
  } else {
    setToastMessage(data.value?.message);
    console.log(data.value);
  }
}
function sendCommentNotification() {
  useSendRequest("/notificatoin/comment-blog", {
    blog_id: blog.value.id,
    user_id: authStore.token.user_image,
  });
}
async function addPoint() {
  if (!loadPoint.value) return;
  if (authStore.isLogin) {
    loadPoint.value = false;
    const { data, error } = await useSendRequest("/blogs/increase-points", {
      blog_id: blog.value.id,
      user_id: authStore.token.user_id,
    });
    loadPoint.value = true;

    if (error.value) {
      setToastMessage(error.value?.message);
      return;
    }
    if (data.value?.status) {
      points.value = data.value.data;
    } else {
      setToastMessage(data.value.message);
    }
  } else {
    dialog.value = true;
  }
}

async function minusPoint() {
  if (!loadPoint.value) return;

  if (authStore.isLogin) {
    loadPoint.value = false;
    const { data, error } = await useSendRequest("/blogs/decrease-points", {
      blog_id: blog.value.id,
      user_id: authStore.token.user_id,
    });
    loadPoint.value = true;

    if (error.value) {
      setToastMessage(error.value?.message);
      return;
    }
    if (data.value?.status) {
      points.value = data.value.data;
    } else {
      setToastMessage(data.value.message);
    }
  } else {
    dialog.value = true;
  }
}
function tryAddBlog() {
  if (authStore.isLogin) return navigateTo("/addBlog");
  dialog.value = true;
}
async function deleteComment() {
  deleteLoading.value = true;
  const { data, error } = await useSendRequest("/comments/delete", {
    comment_id: commentIdWantDelete.value,
    token: authStore.token,
  });
  deleteLoading.value = false;

  if (error.value) {
    setToastMessage("حدث خطا ما");
    return;
  }
  if (data.value?.status) {
    comments.value = comments.value.filter((item) => {
      return item.id !== commentIdWantDelete.value;
    });
    deleteDialog.value = false;
  } else {
    setToastMessage(data.value?.message);
    console.log(data.value);
  }
}

const decriptionMeta = computed(() => {
  if (process.client) return document.getElementById("blogContent")?.textContent;
  return blog.value.title;
});
useHead({
  title: blog.value.title,
  meta: [
    { name: "description", content: decriptionMeta.value },
    { property: "og:description", content: decriptionMeta.value },
    { property: "og:image", content: "/images/مقالات.png" },
    { name: "twitter:card", content: "summay_large_image" },
    { property: "og:locale", content: "ar_ar" },
    { property: "og:url", content: "https://alqanouni.com/" },
    { property: "og:type", content: "website" },
  ],
  link: [{ rel: "canonical", href: "https://alqanouni.com/" }],
});
</script>
  
<style>
.pointer {
  cursor: pointer;
}

.content img {
  max-width: 100%;
  max-height: 500px;
}
</style>