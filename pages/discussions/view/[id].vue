<template>
  <div v-if="discussion" dir="rtl" class="bg-blue-grey-lighten-5">
    <v-row>
      <v-col cols="2" class="ma-0">
        <!-- <bannar-slide></bannar-slide> -->
      </v-col>
      <v-col
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
            <nuxt-link to="/discussions">مناقشات</nuxt-link> /
            {{ discussion.title }}
          </p>
          <div class="imageHolder mt-2 pointer" @click="tryGoToAddDiscussion">
            <v-btn
              rounded="xl"
              prepend-icon="mdi-pencil-circle-outline"
              color="black"
              >افتح مناقشة</v-btn
            >
          </div>
        </div>
        <bannar-center></bannar-center>

        <div class="ma-3" style="width: 97.5%">
          <user-header
            :userId="discussion.user_id"
            :userName="discussion.user.name"
            :userImage="discussion.user.image"
            :userJob="discussion.user.job"
            :userPoints="discussion.user.points"
          />

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
            <p class="text-md-h4 text-h5 align-self-center">
              {{ discussion.title }}
            </p>
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
                  new Date(discussion.created_at).toLocaleDateString([
                    "ban",
                    "id",
                  ])
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
                {{ discussion.discussion_views.count_views }}
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
                {{ opinions.length }}
              </p>
            </div>
          </div>
        </div>
        <div class="ma-3">
          <div>
            <div
              class="pa-5 content"
              id="discussionContent"
              style="border-bottom: 2px solid black"
              v-html="discussion.content"
            ></div>
          </div>

          <div
            v-show="
              authStore.isLogin &&
              discussion.user_id !== authStore.token.user_id
            "
            class="px-5 pt-5 bg-blue-grey-lighten-5"
            style="border-bottom: 2px solid black"
          >
            <div id="summernote"></div>

            <div class="mt-2">
              <input v-model="checkbox" type="checkbox" name="" id="check" />
              <label for="check" class="mr-2 font-weight-bold"
                >اوافق على <span style="color: red">الشروط والاحكام</span> بخصوص
                النشر بمنصة القانوني</label
              >
            </div>
            <div style="text-align: end">
              <v-btn
                :disabled="!readyToSend"
                :loading="addOpinionLoading"
                variant="outlined"
                class="rounded-pill my-5"
                @click="addOpinion"
                style="color: white; background-color: #333"
              >
                <p class="text-h6">اضف رأيك</p>
              </v-btn>
            </div>
          </div>
          <div v-if="discussion.user_id === authStore.token.user_id">
            <v-alert class="ma-10" type="info"
              >لا يمكنك التعليق على المناقشة الخاصة بك</v-alert
            >
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
            <p v-if="opinions" class="text-sm-h5 text-h6">
              الآراء ({{ opinions.length }})
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
                  { name: 'الاقل تقييما', value: 'leastRating' },
                  { name: 'الأكثر تقييما', value: 'mostRating' },
                ]"
              >
                <template v-slot:item="{ props }">
                  <v-list-item v-bind="props" class="text-end"></v-list-item>
                </template>
              </v-select>
            </div>
          </div>
        </div>
        <div
          class="mx-4 mb-5"
          style="border: 1px solid #333"
          v-if="bestOpinion"
        >
          <div class="d-flex justify-space-between ps-3 bg-grey-darken-4">
            <div class="d-flex">
              <p class="align-self-center me-3">أفضل رأي</p>
              <v-img
                class="my-2 me-3 align-self-center pointer"
                cover
                :src="bestOpinion.user.image"
                @click="$router.push('/profile/' + bestOpinion.user_id)"
                style="width: 40px; height: 40px; border-radius: 50%"
              ></v-img>
              <p class="align-self-center me-3">{{ bestOpinion.user.name }}</p>
              <span
                style="font-size: 25px"
                class="mdi mdi-calendar-range align-self-center me-2"
              ></span>
              <p class="align-self-center">
                {{
                  new Date(bestOpinion.created_at).toLocaleDateString([
                    "ban",
                    "id",
                  ])
                }}
              </p>
            </div>
            <div>
              <div class="d-flex">
                <div class="imageHolder mx-2 align-self-center">
                  <v-img
                    style="width: 40px; height: 40px"
                    src="/images/قائمة-المفضلة-بعد-الضغط.png"
                  ></v-img>
                </div>

                <div
                  class="d-flex flex-column py-1 px-5 bg-white"
                  style="border-bottom: 1px solid #333"
                >
                  <div
                    class="imageHolder align-self-center pointer"
                    @click="addOpinionPoint(bestOpinion.id)"
                  >
                    <v-img :width="20" src="/images/زائد-كبير.png"></v-img>
                  </div>
                  <p class="justify-self-center text-center">
                    {{ bestOpinion.opinion_points.count_points }}
                  </p>
                  <div
                    class="imageHolder align-self-center pointer"
                    @click="minusOpinionPoint(bestOpinion.id)"
                  >
                    <v-img :width="20" src="/images/ناقص-كبير.png"></v-img>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-html="bestOpinion.content" class="px-5 py-3 content"></div>
          <div style="border-top: #333 1px solid" v-if="authStore.isLogin">
            <!-- <div v-if="isRegistered && blog.user_id !== authStore.token.user_id" -->
            <div class="px-5 pt-5 pb-5" v-if="bestOpinion.id == tryAddComment">
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
                v-model="contentReply"
              ></textarea>
              <div class="text-end">
                <v-btn class="bg-black" @click="addReply(bestOpinion)"
                  >أضف ردك
                </v-btn>
              </div>
            </div>
            <div class="">
              <div class="py-3 pe-5 text-end">
                <v-btn
                  v-if="
                    bestOpinion.comments.length > 0 &&
                    isShowComments != bestOpinion.id
                  "
                  class="bg-black me-4"
                  @click="ShowComments(bestOpinion.id)"
                  >عرض الردور</v-btn
                >
                <v-btn
                  v-if="
                    bestOpinion.id != tryAddComment &&
                    bestOpinion.user_id != authStore.token.user_id
                  "
                  class="bg-primary me-4"
                  @click="OpenAddComment(bestOpinion.id)"
                  >أضف ردا على هذا الرأي</v-btn
                >

                <v-btn
                  v-if="
                    bestOpinion.user_id == authStore.token.user_id ||
                    authStore.isAdmin
                  "
                  class="bg-error"
                  @click="showDeleteOpinionDialog(bestOpinion.id)"
                  >حذف الرأي</v-btn
                >
              </div>
            </div>
            <div
              v-if="
                bestOpinion.comments.length > 0 &&
                isShowComments == bestOpinion.id
              "
            >
              <div
                style="border: 1px #333 solid"
                class="my-3 mx-5"
                v-for="(comment, index) in bestOpinion.comments"
                :key="comment.id"
              >
                <div
                  class="d-flex justify-space-between ps-3 bg-grey-lighten-1"
                >
                  <div class="d-flex">
                    <p class="align-self-center me-3">
                      الرد رقم {{ index + 1 }}
                    </p>
                    <v-img
                      class="my-2 me-3 align-self-center pointer"
                      cover
                      :src="comment.user.image"
                      @click="$router.push('/profile/' + comment.user_id)"
                      style="width: 40px; height: 40px; border-radius: 50%"
                    ></v-img>
                    <p class="align-self-center me-3">
                      {{ comment.user.name }}
                    </p>
                    <span
                      style="font-size: 25px"
                      class="mdi mdi-calendar-range align-self-center me-2"
                    ></span>
                    <p class="align-self-center">
                      {{
                        new Date(comment.created_at).toLocaleDateString(
                          "ban",
                          "id"
                        )
                      }}
                    </p>
                  </div>
                  <div>
                    <div class="d-flex">
                      <div
                        class="d-flex flex-column py-1 px-5 bg-white"
                        style="border-bottom: 1px solid #333"
                      >
                        <div class="imageHolder align-self-center pointer">
                          <v-img
                            :width="20"
                            src="/images/زائد-كبير.png"
                            @click="addCommentRate(bestOpinion, comment)"
                          ></v-img>
                        </div>
                        <p class="justify-self-center text-center">
                          {{ comment.comment_point.count_points }}
                        </p>
                        <div class="imageHolder align-self-center pointer">
                          <v-img
                            :width="20"
                            src="/images/ناقص-كبير.png"
                            @click="minusCommentRate(bestOpinion, comment)"
                          ></v-img>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-html="comment.content" class="px-5 py-3 content"></div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="mx-4 mb-5"
          v-for="(opinion, index) in currentOpinions"
          :key="opinion.id"
        >
          <div
            v-if="opinion.id != bestOpinionId"
            style="border: 1px solid #333"
          >
            <div class="d-flex justify-space-between ps-3 bg-grey-darken-4">
              <div class="d-flex">
                <p class="align-self-center me-3">الرأي رقم {{ index + 1 }}</p>
                <v-img
                  class="my-2 me-3 align-self-center pointer"
                  cover
                  :src="opinion.user.image"
                  @click="$router.push('/profile/' + opinion.user.id)"
                  style="width: 40px; height: 40px; border-radius: 50%"
                ></v-img>
                <p class="align-self-center me-3">{{ opinion.user.name }}</p>
                <span
                  style="font-size: 25px"
                  class="mdi mdi-calendar-range align-self-center me-2"
                ></span>
                <p class="align-self-center">
                  {{
                    new Date(opinion.created_at).toLocaleDateString([
                      "ban",
                      "id",
                    ])
                  }}
                </p>
              </div>
              <div>
                <div class="d-flex">
                  <div
                    v-if="opinion.id == bestOpinionId"
                    class="imageHolder mx-2 align-self-center"
                  >
                    <v-img
                      style="width: 40px; height: 40px"
                      src="/images/قائمة-المفضلة-بعد-الضغط.png"
                    ></v-img>
                  </div>
                  <div
                    class="imageHolder mx-2 align-self-center pointer"
                    v-if="
                      opinion.id != bestOpinionId &&
                      discussion.user_id == authStore.token.user_id
                    "
                    @click="setBestOpinion(opinion.id)"
                  >
                    <v-img
                      style="width: 40px; height: 40px"
                      src="/images/قائمة-المفضلة-قبل-الضغط.png"
                    ></v-img>
                  </div>

                  <div
                    class="d-flex flex-column py-1 px-5 bg-white"
                    style="border-bottom: 1px solid #333"
                  >
                    <div
                      class="imageHolder align-self-center pointer"
                      @click="addOpinionPoint(opinion.id)"
                    >
                      <v-img :width="20" src="/images/زائد-كبير.png"></v-img>
                    </div>
                    <p class="justify-self-center text-center">
                      {{ opinion.opinion_points.count_points }}
                    </p>
                    <div
                      class="imageHolder align-self-center pointer"
                      @click="minusOpinionPoint(opinion.id)"
                    >
                      <v-img :width="20" src="/images/ناقص-كبير.png"></v-img>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-html="opinion.content" class="px-5 py-3 content"></div>
            <div style="border-top: #333 1px solid" v-if="authStore.isLogin">
              <!-- <div v-if="isRegistered && blog.user_id !== authStore.token.user_id" -->
              <div class="px-5 pt-5 pb-5" v-if="opinion.id == tryAddComment">
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
                  v-model="contentReply"
                ></textarea>
                <div class="text-end">
                  <v-btn class="bg-black" @click="addReply(opinion)"
                    >أضف ردك
                  </v-btn>
                </div>
              </div>
              <div class="py-3 text-end">
                <v-btn
                  v-if="
                    opinion.comments.length > 0 && isShowComments != opinion.id
                  "
                  class="bg-black me-4"
                  @click="ShowComments(opinion.id)"
                  >عرض الردور</v-btn
                >
                <v-btn
                  v-if="
                    opinion.id != tryAddComment &&
                    opinion.user_id != authStore.token.user_id
                  "
                  class="bg-primary me-4"
                  @click="OpenAddComment(opinion.id)"
                  >أضف ردا على هذا الرأي</v-btn
                >
                <v-btn
                  v-if="
                    opinion.user_id == authStore.token.user_id ||
                    authStore.isAdmin
                  "
                  class="bg-error me-4"
                  @click="showDeleteOpinionDialog(opinion.id)"
                  >حذف الرأي</v-btn
                >
              </div>
              <!-- <div class="text-center">
                                <v-btn class="bg-black">عرض الردور على هذا الراي</v-btn>
                            </div> -->
              <div
                v-if="
                  opinion.comments.length > 0 && isShowComments == opinion.id
                "
              >
                <div
                  style="border: 1px #333 solid"
                  class="my-3 mx-5"
                  v-for="(comment, index) in opinion.comments"
                  :key="comment.id"
                >
                  <div
                    class="d-flex justify-space-between ps-3 bg-grey-lighten-1"
                  >
                    <div class="d-flex">
                      <p class="align-self-center me-3">
                        الرد رقم {{ index + 1 }}
                      </p>
                      <v-img
                        class="my-2 me-3 align-self-center pointer"
                        cover
                        :src="comment.user.image"
                        @click="$router.push('/profile/' + comment.user_id)"
                        style="width: 40px; height: 40px; border-radius: 50%"
                      ></v-img>
                      <p class="align-self-center me-3">
                        {{ comment.user.name }}
                      </p>
                      <span
                        style="font-size: 25px"
                        class="mdi mdi-calendar-range align-self-center me-2"
                      ></span>
                      <p class="align-self-center">
                        {{
                          new Date(comment.created_at).toLocaleDateString([
                            "ban",
                            "id",
                          ])
                        }}
                      </p>
                    </div>
                    <div>
                      <div class="d-flex">
                        <div
                          class="d-flex flex-column py-1 px-5 bg-white"
                          style="border-bottom: 1px solid #333"
                        >
                          <div class="imageHolder align-self-center pointer">
                            <v-img
                              :width="20"
                              src="/images/زائد-كبير.png"
                              @click="addCommentRate(opinion, comment)"
                            ></v-img>
                          </div>
                          <p class="justify-self-center text-center">
                            {{ comment.comment_point.count_points }}
                          </p>
                          <div class="imageHolder align-self-center pointer">
                            <v-img
                              :width="20"
                              src="/images/ناقص-كبير.png"
                              @click="minusCommentRate(opinion, comment)"
                            ></v-img>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-html="comment.content" class="px-5 py-3 content"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center" v-if="opinions">
          <v-btn
            variant="tonal"
            color="black"
            v-if="currentOpinions.length < opinions.length"
            @click="pageNumber++"
            >عرض المزيد</v-btn
          >
        </div>
      </v-col>
      <v-col cols="2">
        <!-- <bannar-slide></bannar-slide> -->
      </v-col>
      <v-dialog
        v-model="dialog"
        transition="dialog-top-transition"
        width="auto"
      >
        <v-card elevation="4" class="text-center" max-width="300">
          <v-card-text class="text-h6">
            <v-card-title class="text-error text-h4">عفوا</v-card-title>
            <div class="">
              أنت لا تستطيع اجراء هذة العملية يجب عليك تسجيل الدخول أولا
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
        v-model="deleteOpinionDialog"
        transition="dialog-top-transition"
        width="auto"
      >
        <v-card elevation="4" class="text-center" max-width="300">
          <v-card-text class="text-h6">
            <div class="">هل انت متاكد من حذف هذا الرأي</div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              variant="flat"
              color="black"
              @click="deleteOpinionDialog = false"
              >اغلاق</v-btn
            >
            <v-btn
              :loading="deleteLoading"
              variant="flat"
              color="success"
              @click="deleteOpinion"
              >تأكيد</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
    
<script setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";

const route = useRoute();
const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();

const discussion = ref();

const opinions = ref([]);
const badge = ref("لاشي");
const points = ref(0);

const loadWishlist = ref(true);
const loadPoint = ref(true);

const addOpinionLoading = ref(false);
const dialog = ref();

const isShowComments = ref(-1);

function ShowComments(id) {
  isShowComments.value = id;
}

const checkbox = ref(false);
const readyToSend = computed(() => {
  return checkbox.value;
});
const isFavarite = ref(false);
const addDiscussionview = useCookie("addDiscussionview", {
  maxAge: 60 * 60 * 24,
});
const filterSelect = ref("newest");
const pageNumber = ref(1);
const itemPerPage = ref(8);
const bestOpinionId = ref(-1);
const tryAddComment = ref(-1);
const contentReply = ref("");

const deleteLoading = ref(false);
const opinionIdWantDelete = ref();
const deleteOpinionDialog = ref(false);

function showDeleteOpinionDialog(opinionId) {
  opinionIdWantDelete.value = opinionId;
  deleteOpinionDialog.value = true;
}

const bestOpinion = computed(() => {
  return opinions.value.find((opinion) => {
    return opinion.id == bestOpinionId.value;
  });
});

//تمام
async function setBestOpinion(opinionId) {
  const { data, error } = await useSendRequest("/discussions/setBestOpinion", {
    opinion_id: opinionId,
    discussion_id: discussion.value.id,
    token: authStore.token,
  });
  if (error.value) {
    setToastMessage(data.value.message);
    return;
  }
  if (data.value.status) {
    bestOpinionId.value = opinionId;
    setToastMessage(data.value.message);
  } else {
    setToastMessage(data.value.message);
  }
}

function OpenAddComment(id) {
  tryAddComment.value = id;
  contentReply.value = "";
}

useHead({
  link: [
    {
      rel: "stylesheet",
      type: "text/css",
      href: "https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css",
    },
    {
      rel: "stylesheet",
      type: "text/css",
      href: "https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css",
    },
  ],
  script: [
    {
      src: "https://code.jquery.com/jquery-3.5.1.min.js",
    },
    {
      src: "https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js",
    },
  ],
});


//تمام
const { data, error } = await useSendRequest("/discussions/getDiscussion ", {
  discussion_id: route.params.id,
  // token: authStore.token,
});
if (error.value) {
  setToastMessage(error.value.message);
} else if (data.value?.status) {
  discussion.value = data.value.data;
  points.value = data.value.data.discussion_points.count_points;
  checkWishList();
  increaseView();
} else {
  setToastMessage(data.value?.message);
  console.log(data.value);
}

//تمام
const { data: data2, error: error2 } = await useSendRequest(
  "/discussions/getAllOpinionsDiscussion",
  {
    discussion_id: route.params.id,
    // token: authStore.token,
  }
);
if (error2.value) {
  setToastMessage("حدث خظا ما");
} else if (data2.value?.status) {
  opinions.value = data2.value.data;
} else {
  setToastMessage(data2.value?.message);
  console.log(data2.value);
}

const fillterOpinions = computed(() => {
  if (filterSelect.value === "newest") {
    return opinions.value.sort(function (a, b) {
      if (a.created_at < b.created_at) return 1;
      return -1;
    });
  } else if (filterSelect.value === "oldest") {
    return opinions.value.sort(function (a, b) {
      if (a.created_at > b.created_at) return 1;
      return -1;
    });
  } else if (filterSelect.value === "leastRating") {
    return opinions.value.sort(function (a, b) {
      if (a.opinion_points.count_points > b.opinion_points.count_points)
        return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostRating") {
    return opinions.value.sort(function (a, b) {
      if (a.opinion_points.count_points < b.opinion_points.count_points)
        return 1;
      return -1;
    });
  }
  return opinions.value;
});

const currentOpinions = computed(() => {
  return fillterOpinions.value?.slice(0, itemPerPage.value * pageNumber.value);
});

async function checkBestOpinion() {
  //تمام
  const { data, error } = await useSendRequest(
    "/discussions/checkBestOpinion",
    {
      discussion_id: discussion.value.id,
    }
  );
  if (error.value) {
    setToastMessage(error.value.message);
    return;
  }
  if (data.value?.status) {
    bestOpinionId.value = data.value.data;
  }
}

async function increaseView() {
  //تمام
  if (
    !addDiscussionview.value ||
    addDiscussionview.value.indexOf(discussion.value.id) == -1
  ) {
    const { data, error } = await useSendRequest("/discussions/addview", {
      discussion_id: discussion.value.id,
    });
    if (error.value) {
      setToastMessage(error.value.message);
      return;
    }
    if (data.value?.status) {
      if (!addDiscussionview.value) {
        addDiscussionview.value = [discussion.value.id];
      } else {
        addDiscussionview.value.push(discussion.value.id);
      }
    }
  }
}
async function toggleWishlist() {
  //تمام
  if (!loadWishlist.value) return;
  if (authStore.isLogin) {
    loadWishlist.value = false;
    const { data, error } = await useSendRequest("/discussions/addWishlist", {
      discussion_id: discussion.value.id,
      token: authStore.token,
    });
    loadWishlist.value = true;
    if (error.value) {
      setToastMessage(error.value.message);
      return;
    }
    if (data.value?.status) {
      isFavarite.value = data.value.data;
    }
  } else {
    dialog.value = true;
  }
}
async function checkWishList() {
  //تمام
  const { data, error } = await useSendRequest("/discussions/checkWishList", {
    discussion_id: discussion.value.id,
    token: authStore.token,
  });
  if (error.value) {
    setToastMessage(error.value.message);
    return;
  }
  if (data.value?.status) {
    isFavarite.value = data.value.data;
  }
}

//تمام
async function addOpinion() {
  if (authStore.isLogin) {
    addOpinionLoading.value = true;
    let content = document.getElementsByClassName("note-editable")[0].innerHTML;
    const { data, error } = await useSendRequest(
      "/discussions/addOpinionDiscussion",
      {
        content: content,
        token: authStore.token,
        discussion_id: discussion.value.id,
      }
    );
    addOpinionLoading.value = false;
    if (error.value) {
      setToastMessage(error.value.message);
      return;
    }
    if (data.value?.status) {
      opinions.value.unshift(data.value.data.opinion);
      setToastMessage(data.value?.message);
      sendCommentNotification(data.value.data.dataNotify);
      let content2 = document.getElementById("editor")?.firstChild;
      content2.innerHTML = " ";
    } else {
      setToastMessage(data.value.message);
    }
  } else {
    dialog.value = true;
  }
}
checkBestOpinion();
//تمام
function sendCommentNotification(dataNotify) {
  useSendRequest("/notificatoin/comment-discussion", {
    dataNotify: dataNotify,
  });
}
//تمام
async function deleteOpinion() {
  deleteLoading.value = true;
  const { data, error } = await useSendRequest("/discussions/deleteOpinion", {
    opinion_discussion_id: opinionIdWantDelete.value,
    token: authStore.token,
  });
  deleteLoading.value = false;

  if (error.value) {
    setToastMessage(error.value.message);
    return;
  }
  if (data.value?.status) {
    opinions.value = opinions.value.filter((item) => {
      return item.id !== opinionIdWantDelete.value;
    });
    deleteOpinionDialog.value = false;
  } else {
    setToastMessage(data.value?.message);
    console.log(data.value);
  }
}

async function addPoint() {
  //تمام
  if (!loadPoint.value) return;
  if (authStore.isLogin) {
    loadPoint.value = false;
    const { data, error } = await useSendRequest("/discussions/addPoint", {
      discussion_id: discussion.value.id,
      token: authStore.token,
    });
    loadPoint.value = true;

    if (error.value) {
      setToastMessage(error.value.message);
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
  //تمام
  if (!loadPoint.value) return;

  if (authStore.isLogin) {
    loadPoint.value = false;

    const { data, error } = await useSendRequest("/discussions/minusPoint", {
      discussion_id: discussion.value.id,
      token: authStore.token,
    });
    loadPoint.value = true;
    if (error.value) {
      setToastMessage(error.value.message);
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

//تمام
async function addOpinionPoint(id) {
  if (!loadPoint.value) return;
  if (authStore.isLogin) {
    loadPoint.value = false;
    const { data, error } = await useSendRequest(
      "/discussions/addPointOpinionDiscussion",
      {
        opinion_discussion_id: id,
        token: authStore.token,
      }
    );
    loadPoint.value = true;
    if (error.value) {
      setToastMessage(error.value.message);
      return;
    }
    if (data.value.status) {
      opinions.value.forEach((opinion) => {
        if (opinion.id == id) {
          opinion.opinion_points.count_points = data.value.data;
          return;
        }
      });
    } else {
      setToastMessage(data.value?.message);
    }
  } else {
    dialog.value = true;
  }
}
//تمام
async function minusOpinionPoint(id) {
  if (!loadPoint.value) return;

  if (authStore.isLogin) {
    loadPoint.value = false;

    const { data, error } = await useSendRequest(
      "/discussions/muinsePointOpinionDiscussion",
      {
        opinion_discussion_id: id,
        token: authStore.token,
      }
    );
    loadPoint.value = true;

    if (error.value) {
      setToastMessage(error.value.message);
      return;
    }
    if (data.value.status) {
      opinions.value.forEach((opinion) => {
        if (opinion.id == id) {
          opinion.opinion_points.count_points = data.value.data;
          return;
        }
      });
    } else {
      setToastMessage(data.value?.message);
    }
  } else {
    dialog.value = true;
  }
}
//تمام
async function addReply(opinion) {
  if (authStore.isLogin) {
    const { data, error } = await useSendRequest(
      "/discussions/addCommentOpinionDiscussion",
      {
        content: contentReply.value,
        token: authStore.token,
        opinion_id: opinion.id,
      }
    );
    if (error.value) {
      setToastMessage(error.value.message);
      return;
    }
    if (data.value.status) {
      setToastMessage("تم الرد على الراي");
      const opinionIndex = opinions.value.indexOf(opinion);

      opinions.value[opinionIndex].comments.push({
        id: data.value.data.comment.id,
        content: contentReply.value,
        opinion_discussion_id: opinion.id,
        created_at: data.value.data.comment.created_at,
        user: {
          image: data.value.data.user.image,
          name: data.value.data.user.name,
        },
        comment_point: {
          count_points: 0,
        },
      });
      tryAddComment.value = -1;
      contentReply.value = "";
    }
  } else {
    dialog.value = true;
  }
}
function tryGoToAddDiscussion() {
  if (authStore.isLogin) return (window.location.href = "/discussions/add");
  dialog.value = true;
}

async function addCommentRate(opinion, comment) {
  if (!loadPoint.value) return;

  if (authStore.isLogin) {
    loadPoint.value = false;
    const { data, error } = await useSendRequest(
      "/discussions/addPointCommentOpinion",
      {
        comment_id: comment.id,
        token: authStore.token,
      }
    );
    loadPoint.value = true;
    if (error.value) {
      setToastMessage(error.value.message);
      return;
    }
    if (data.value.status) {
      const opinionIndex = opinions.value.indexOf(opinion);
      const commentIndex =
        opinions.value[opinionIndex].comments.indexOf(comment);

      opinions.value[opinionIndex].comments[
        commentIndex
      ].comment_point.count_points = data.value.data;

      setToastMessage("تم تقييم الرد");
    } else {
      setToastMessage(data.value?.message);
    }
  } else {
    dialog.value = true;
  }
}
async function minusCommentRate(opinion, comment) {
  if (!loadPoint.value) return;
  if (authStore.isLogin) {
    loadPoint.value = false;
    const { data, error } = await useSendRequest(
      "/discussions/muinseCommentPointOpinion",
      {
        comment_id: comment.id,
        token: authStore.token,
      }
    );
    loadPoint.value = true;
    if (error.value) {
      setToastMessage(error.value.message);
      return;
    }
    if (data.value.status) {
      const opinionIndex = opinions.value.indexOf(opinion);
      const commentIndex =
        opinions.value[opinionIndex].comments.indexOf(comment);

      opinions.value[opinionIndex].comments[
        commentIndex
      ].comment_point.count_points = data.value.data;
    } else {
      setToastMessage(data.value?.message);
    }
  } else {
    dialog.value = true;
  }
}


onMounted(() => {
  $(document).ready(function () {
    $("#summernote").summernote();
  });
});
const decriptionMeta = computed(() => {
  if (process.client)
    return document.getElementById("discussionContent")?.textContent;
  return discussion.value.title;
});

useHead({
  title: discussion.value.title,
  meta: [
    { name: "description", content: decriptionMeta.value },
    { property: "og:description", content: decriptionMeta.value },
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

.content img {
  max-width: 100%;
  max-height: 500px;
}

.ql-editor {
  min-height: 100px;
}
.modal-backdrop {
  position: relative !important;
}
.note-editor.note-frame .note-editing-area .note-editable {
 
    direction: rtl !important;
}
</style>