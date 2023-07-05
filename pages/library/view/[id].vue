<template>
  <v-card v-if="library" min-height="100vh" color="#f4f4f4" class="">
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
        <div
          style="background-color: #fdf8ef; width: 100%"
          class="pa-3 d-flex justify-space-between"
        >
          <span class="align-self-center font-weight-bold">
            <nuxt-link to="/library">مكتبة / </nuxt-link>
            {{ library.file_name }}
          </span>
          <div class="imageHolder mt-2 pointer" @click="tryGoToAddFile">
            <v-btn
              rounded="xl"
              prepend-icon="mdi-pencil-circle-outline"
              color="black"
              >اضف ملف</v-btn
            >
          </div>
        </div>
        <bannar-center></bannar-center>
        <div class="file">
          <div class="d-flex py-4 px-6 fileHead">
            <div style="width: 300px" class="me-10">
              <v-img  
                width="100%"
                style="max-height:400px;"            
                :src="library.file_cover"
                class="rounded-lg "
              ></v-img>
            </div>
            <div class="text-h5 font-weight-bold text-grey-darken-3">
              <p class="mt-8 mb-8">
                عنوان الملف :
                <span class="font-weight-medium font-weight-medium text-red"
                  >{{ library.file_name }}
                </span>
              </p>
              <p class="mb-8">
                عدد الصفحات :
                <span class="font-weight-medium text-red"
                  >{{ library.num_of_pages }}
                </span>
              </p>
              <p class="mb-8">
                المؤلف :
                <span class="font-weight-medium text-red">{{
                  library.author_name
                }}</span>
              </p>
              <p class="mb-8">
                تاريخ الإصدار :
                <span class="font-weight-medium text-red">{{
                  new Date(library.release_date).toLocaleDateString("ar", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }}</span>
              </p>
              <!-- <p class="mb-8"> تاريخ الإصدار : <span class="font-weight-medium text-red">{{ new
                                Date().toLocaleDateString(["ban", "id"])
                             }}</span></p> -->
              <p class="mb-8">
                لغة الملف :
                <span class="font-weight-medium text-red">{{
                  library.file_language
                }}</span>
              </p>
            </div>
          </div>

          <div
            class="d-sm-flex d-block mx-7 pa-3 rounded-xl"
            style="border: 1px #555 solid"
          >
            <div
              class="text-h5 font-weight-bold text-grey-darken-3"
              style="min-width: 40%"
            >
              <p class="mb-8">
                نوع الملف :
                <span class="font-weight-medium text-red">{{
                  library.file_property.file_type
                }}</span>
              </p>
              <p class="mb-8">
                حجم الملف :
                <span class="font-weight-medium text-red">{{
                  library.file_property.file_size
                }}</span>
              </p>
              <p class="mb-8">
                رفعه بالموقع :
                <span class="font-weight-medium text-red">{{
                  library.user.name
                }}</span>
              </p>
              <p class="mb-8">
                تاريخ الرفع :
                <span class="font-weight-medium text-red">{{
                  new Date(library.created_at).toLocaleDateString("ar", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }}</span>
              </p>
              <!-- <p class="mb-8"> تاريخ الإصدار : <span class="text-red">{{ new
                                Date().toLocaleDateString(["ban", "id"])
                             }}</span></p> -->
            </div>
            <div class="align-self-center">
              <div
                class="text-center text-grey-darken-4 rounded-xl pa-10"
                :class="{
                  'bg-green-lighten-4': fileStatus != 'غير مسموح بنشره',
                  'bg-deep-orange-lighten-4': fileStatus == 'غير مسموح بنشره',
                }"
              >
                <p class="text-h4 font-weight-bold">{{ fileStatus }}</p>
                <p
                  class="text-h6 font-weight-bold"
                  style="font-size: 25px !important"
                >
                  {{ explanaFileStatus }}
                </p>
              </div>
            </div>
          </div>
          <!-- style="background-color: rgb(226, 255, 246);" -->
          <div
            class="d-flex ma-6 pa-3 rounded-xl"
            style="border: 1px #555 solid"
          >
            <v-img
              :src="library.about_library.author_image"
              style="height: 100px; max-width: 100px; min-width: 100px"
              cover
              class="align-self-center rounded-circle mx-10 d-sm-block d-none"
            ></v-img>
            <div>
              <p class="text-h5 font-weight-bold text-grey-darken-4 mb-3">
                نبذة عن المؤلف :
                <span class="font-weight-medium text-red">{{
                  library.author_name
                }}</span>
              </p>
              <div
                v-html="library.about_library.about_author"
                class="content"
              ></div>
            </div>
          </div>
          <div class="ma-6 pa-5 rounded-xl" style="border: 1px #555 solid">
            <p class="text-h5 font-weight-bold text-grey-darken-4 mb-3">
              نبذة عن الملف :
              <span class="font-weight-medium text-red">{{
                library.file_name
              }}</span>
            </p>
            <div
              id="libraryAbout"
              class="content"
              v-html="library.about_library.about_file"
            ></div>
          </div>
          <hr class="mx-5" style="border-top: 2px black solid" />
          <div class="d-flex justify-space-between mx-5 pa-3">
            <div
              v-if="!isFavarite"
              class="imageHolder align-self-center pointer"
              @click="toggleWishlist()"
            >
              <v-img
                style="width: 50px; height: 50px"
                src="/images/قائمة-المفضلة-قبل-الضغط.png"
              ></v-img>
            </div>
            <div
              v-if="isFavarite"
              class="imageHolder align-self-center align-self-center"
            >
              <v-img
                @click="toggleWishlist()"
                class="pointer"
                style="width: 50px; height: 50px"
                src="/images/قائمة-المفضلة-بعد-الضغط.png"
              ></v-img>
            </div>
            <p class="text-md-h4 text-h5 align-self-center">
              {{ library.file_name }}
            </p>
            <div class="mt-n8">
              <p
                style="font-size: 55px; max-height: 25px"
                class="pointer"
                @click="addPoint()"
              >
                <span class="mdi mdi-chevron-up mb-3 text-blue"></span>
              </p>
              <p class="text-center mt-7">
                {{ points }}
              </p>
              <p
                style="font-size: 55px; max-height: 25px"
                class="mt-n8 pointer"
                @click="minusPoint()"
              >
                <span class="mdi mdi-chevron-down text-red"></span>
              </p>
            </div>
          </div>
          <div
            class="text-h6 py-2 d-flex justify-center bg-grey-lighten-3 ma-5 font-weight-bold rounded-b-xl"
          >
            <div class="me-2">
              <span class="mdi mdi-calendar-month-outline me-1"></span>
              <span>{{
                new Date(library.created_at).toLocaleDateString(["ban", "id"])
              }}</span>
            </div>
            <div class="me-2">
              <span class="mdi mdi-eye me-1"></span>
              <span>{{ library.library_view.views_count }}</span>
            </div>
            <div class="me-2">
              <span class="mdi mdi-message-processing me-1"></span>
              <span>{{ comments.length }}</span>
            </div>

            <div class="d-flex">
              <span class="mdi mdi-tray-arrow-down"></span>
              <span>{{ library.library_download_count.download_count }}</span>
            </div>
          </div>

          <div class="justify-center d-flex">
            <div
              style="border: 4px #333 solid; width: 124px; height: 124px"
              class="rounded-circle"
            >
              <v-btn
                :disabled="fileStatus == 'غير مسموح بنشره'"
                @click="downloadFile"
                prepend-icon="mdi-tray-arrow-down"
                class="rounded-circle ma-2"
                width="100"
                height="100"
                stacked
                variant="text"
                :class="{
                  'bg-green': fileStatus != 'غير مسموح بنشره',
                  'bg-red': fileStatus == 'غير مسموح بنشره',
                }"
              >
                <span class="text-h6"> تحميل</span></v-btn
              >
            </div>
          </div>
          <hr class=" mt-6" style="border-top: 2px black solid" />
          <div
            v-if="authStore.isLogin"
            class="mx-5 pt-5 bg-blue-grey-lighten-5 text-center"
            style="border-bottom: 2px solid black"
          >
            <textarea
              name=""
              id=""
              class="py-3 px-5"
              style="
                border: 1px solid black;
                height: 200px;
                width: 92%;
                border-radius: 20px;
              "
              v-model="commentInput"
            ></textarea>
            <div class="text-center ma-5">
              <v-btn
                :loading="addCommentLoading"
                :disabled="!commentInput"
                @click="addComment"
                class="text-h6 pointer bg-grey-darken-4 py-2 px-5"
                >اضف تعليق</v-btn
              >
            </div>
          </div>
          <div
            v-if="!authStore.isLogin"
            class="px-2 mb-5 py-5 bg-blue-grey-lighten-5 justify-center align-center d-flex"
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
          <div>
            <div class="d-flex justify-space-between px-5 py-2">
              <p class="text-sm-h5 text-h6">
                التعليقات ( {{ comments.length }})
              </p>
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
            <!-- commments -->
            <div
              v-for="comment in currentComments"
              :key="comment.id"
              class="bg-blue-grey-lighten-5 px-2 pt-2 pb-2 ma-3 rounded-xl"
            >
              <div class="d-flex justify-space-between mb-2">
                <div class="d-flex">
                  <v-img
                    class="pointer"
                    @click="$router.push('/profile/' + comment.user.id)"
                    cover
                    style="border-radius: 50%; width: 50px; height: 50px"
                    :src="comment.user.image"
                  ></v-img>
                  <p class="text-sm-h5 text-h6 align-self-center ms-3">
                    {{ comment.user.name }}
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
                  <p class="mt-1 mx-2 align-self-center">
                    {{
                      new Date(comment.created_at).toLocaleString(
                        ["ban", "id"],
                        {
                          hour12: false,
                          minute: "2-digit",
                          hour: "2-digit",
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        }
                      )
                    }}
                  </p>
                  <v-icon
                    icon="mdi-trash-can-outline"
                    class="pointer"
                    @click="showDialog(comment.id)"
                    v-if="
                      comment.user.id === authStore.token.user_id ||
                      authStore.isAdmin
                    "
                    size="small"
                  ></v-icon>
                </div>
              </div>
              <div class="bg-white rounded-b-xl pa-2">
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
            أنت لا تستطيع إجراء هذه العملية عليك تسجيل الدخول أولا
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
      v-model="chekPointDialog"
      transition="dialog-top-transition"
      width="auto"
    >
      <v-card elevation="4" class="text-center" max-width="300">
        <v-card-text class="text-h6">
          <div class="">يرجى تأكيد عملية التنزيل</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="flat" color="success" @click="downloadNow"
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
  </v-card>
</template>

<script setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();

const route = useRoute();
const isFavarite = ref(false);
const commentInput = ref("");
const comments = ref();
const library = ref();
const points = ref();
const dialog = ref(false);
const filterSelect = ref("newest");
const pageNumber = ref(1);
const itemPerPage = ref(10);
const deleteDialog = ref(false);
const wishListLoading = ref(false);
const pointsLoading = ref(false);
const addCommentLoading = ref(false);
const deleteLoading = ref(false);
const chekPointDialog = ref(false);

const commentIdWantDelete = ref();
const explanaFileStatus = computed(() => {
  if (library.value?.file_property.property_rights == "author") {
    return " هذا الملف قام برفعه على مكتبة منصة القانوني مؤلف الملف بنفسه , وهو بذلك يعطي صلاحية تحميله لأجل الاستخدام الشخصي فقط , وأي صلاحية اخرى لابد من أخذ إذن المؤلف";
  } else if (library.value?.file_property.property_rights == "public") {
    return "نشر هذا الكتاب برخصة المشاع الابداعي مع ذكر المؤلف والمصدر";
  } else if (library.value?.file_property.property_rights == "allowed") {
    return "تم جلب  هذا الكتاب من موقع على انه برخصة المشاع الإبداعي  وأن المؤلف أو الدار النشر موافقين على نشر الكتاب في حالة الاعتراض على تشر الكتاب الرجاء التواصل معنا";
  } else if (library.value?.file_property.property_rights == "not_allowed") {
    return "هذا الملف لا يمكن تحميله رقميا حفاظا على حقوق  نشر المؤلف ودار النشر وتم نشر معلوماته لاجل تسهيل الحصول عليه ولاجل التقييم والمراجعة";
  }
});
const addLibraryview = useCookie("addLibraryview", {
  maxAge: 60 * 60 * 24,
});

function showDialog(commentId) {
  commentIdWantDelete.value = commentId;
  deleteDialog.value = true;
}

async function deleteComment() {
  deleteLoading.value = true;
  const { data, error } = await useSendRequest("/library/comment/delete", {
    library_id: route.params.id,
    comment_id: commentIdWantDelete.value,
    token: authStore.token,
  });
  deleteLoading.value = false;
  deleteDialog.value = false;

  if (error.value) {
    setToastMessage(error.value.message);
    return;
  }
  if (data.value?.status) {
    comments.value = comments.value.filter((item) => {
      return item.id !== commentIdWantDelete.value;
    });
  } else {
    setToastMessage(data.value?.message);
    console.log(data.value);
  }
}

const { data, error } = await useSendRequest("/library/show", {
  library_id: route.params.id,
});
if (error.value) {
  setToastMessage(error.value.message);
} else if (data.value?.status) {
  library.value = data.value.data;
  comments.value = library.value.library_comments.reverse();
  points.value = library.value.library_point_count.point_count;
  checkWishList();
  increaseView();
} else {
  setToastMessage(data.value?.message);
  console.log(data.value);
}

const fileStatus = computed(() => {
  if (library.value?.file_property.property_rights == "public") {
    return "ملكية عامة";
  } else if (library.value?.file_property.property_rights == "author") {
    return "رفعه المؤلف بنفسه";
  } else if (library.value?.file_property.property_rights == "allowed") {
    return "سمح المؤلف بنشره";
  } else if (library.value?.file_property.property_rights == "not_allowed") {
    return "غير مسموح بنشره";
  }
});

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

async function increaseView() {
  if (
    !addLibraryview.value ||
    addLibraryview.value.indexOf(route.params.id) == -1
  ) {
    const { data, error } = await useSendRequest("/library/increaseView", {
      library_id: route.params.id,
    });
    if (error.value) {
      setToastMessage(error.value.message);
      return;
    }
    if (data.value?.status) {
      if (!addLibraryview.value) {
        addLibraryview.value = [route.params.id];
      } else {
        addLibraryview.value.push(route.params.id);
      }
    }
  }
}

function tryGoToAddFile() {
  if (authStore.isLogin) return navigateTo("/library/files/add");
  dialog.value = true;
}

async function toggleWishlist() {
  if (!authStore.isLogin) return (dialog.value = true);
  if (wishListLoading.value) return;
  wishListLoading.value = true;
  const { data, error } = await useSendRequest("/library/addToWishlist", {
    library_id: route.params.id,
    user_id: authStore.token.user_id,
  });
  wishListLoading.value = false;
  if (error.value) {
    setToastMessage(error.value.message);
    return;
  }
  if (data.value?.status) {
    isFavarite.value = data.value.data;
  }
}

async function checkWishList() {
  const { data, error } = await useSendRequest("/library/checkWishlist", {
    library_id: route.params.id,
    user_id: authStore.token.user_id,
  });
  if (error.value) {
    setToastMessage(error.value.message);
    return;
  }
  if (data.value?.status) {
    isFavarite.value = data.value;
  }
}

async function addPoint() {
  if (authStore.isLogin) {
    if (pointsLoading.value) return;
    pointsLoading.value = true;
    const { data, error } = await useSendRequest("/library/increasePoint", {
      library_id: route.params.id,
      user_id: authStore.token.user_id,
    });
    pointsLoading.value = false;

    if (error.value) {
      setToastMessage(error.value.message);
      return;
    }
    if (data.value?.status) {
      points.value = data.value.data;
    }else{
      setToastMessage(data.value.message);
    }
  } else {
    dialog.value = true;
  }
}
async function minusPoint() {
  if (authStore.isLogin) {
    const { data, error } = await useSendRequest("/library/decreasePoint", {
      library_id: route.params.id,
      user_id: authStore.token.user_id,
    });
    if (error.value) {
      setToastMessage(error.value.message);
      return;
    }
    if (data.value?.status) {
      points.value = data.value.data;
    }else{
      setToastMessage(data.value.message);
    }
  } else {
    dialog.value = true;
  }
}
async function addComment() {
  addCommentLoading.value = true;
  const { data, error } = await useSendRequest("/library/comment/add", {
    comment: commentInput.value,
    token: authStore.token,
    library_id: route.params.id,
  });
  addCommentLoading.value = false;

  if (error.value) {
    setToastMessage(error.value.message);
    return;
  }
  if (data.value?.status) {
    setToastMessage(data.value.message);
    comments.value.unshift(data.value.data.comment);
    commentInput.value = "";
    if (library.value.user.id !== authStore.token.user_id)
      sendAddCommentNotification(data.value.data.dataNotify);
  } else {
    setToastMessage(data.value?.message);
    console.log(data.value);
  }
}

async function sendAddCommentNotification(dataNotify) {
  useSendRequest("/notificatoin/comment-file", {
    dataNotify: dataNotify,
  });
}

async function downloadFile() {
  if (!authStore.isLogin) return (dialog.value = true);

  const { data, error } = await useSendRequest("/library/checkDownload", {
    user_id: authStore.token.user_id,
    library_id: library.value.id,
  });
  if (error.value) return setToastMessage("حدث خطأ ما");
  if (data.value.status) {
    chekPointDialog.value = true;
  } else setToastMessage(data.value.message);
}

function downloadNow() {
  let file = library.value.about_library.file;
  if (!file) return setToastMessage("لا يوجد ملفات لتحميلها");

  const link = document.createElement("a");
  link.href = file;
  link.download = file;
  link.target = "_blank";
  link.click();

  chekPointDialog.value = false;
}
const aboutLibraryMeta = computed(() => {
  if (process.client)
    return document.getElementById("libraryAbout")?.textContent;
  return library.value.file_name;
});

useHead({
  title: library.value.file_name,
  meta: [
    { name: "description", content: aboutLibraryMeta.value },
    { property: "og:description", content: aboutLibraryMeta.value },
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
.mdi-tray-arrow-down::before {
  font-size: 50px !important;
}

.pointer {
  cursor: pointer;
}

.mdi-tray-arrow-down::before {
  font-size: 30px !important;
}
@media screen and (max-width: 750px) {
  .fileHead {
    display: block !important;
  }
}
.content img {
  max-width: 100%;
  max-height: 500px;
}
</style>
