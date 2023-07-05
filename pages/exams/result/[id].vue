<template>
  <div>
    <div v-if="validate">
      <v-card min-height="100vh" color="#f4f4f4" class="">
        <div>
          <v-row class="mx-1">
            <v-col md="2" sm="0">
              <!-- <bannar-slide></bannar-slide> -->
            </v-col>
            <v-col
              style="border: 1px solid #999"
              class="bg-white mb-5 mt-sm-8 pb-16"
              md="8"
              sm="11"
              cols="12"
            >
              <div v-show="!tableResultShown">
                <div
                  style="background-color: #fdf8ef; width: 100%"
                  class="pa-3"
                >
                  <div>
                    <span>
                      <nuxt-link
                        class="text-decoration-none font-weight-bold"
                        to="/exams"
                        >اختبارات</nuxt-link
                      >
                    </span>
                    <span> / </span>
                    <span class="font-weight-bold pt-2 ml-5">
                      {{ result.examInfo.name }} - نتيجتك</span
                    >
                  </div>
                </div>
                <div class="my-5">
                  <div class="text-center">
                    <h2 class="mb-2">
                      <span>نتيجة: </span
                      ><span class="text-primary">{{ result.user.name }}</span>
                    </h2>
                    <h2>
                      <span>في اختبار: </span
                      ><span class="text-primary">{{
                        result.examInfo.name
                      }}</span>
                    </h2>
                    <v-avatar
                      class="my-4"
                      color="white"
                      style="border: 3px solid #999"
                      size="150"
                    >
                      <v-img :src="result.user.image"></v-img>
                    </v-avatar>
                  </div>

                  <div
                    class="px-8 py-6 mx-auto font-weight-bold"
                    style="
                      width: 320px;
                      border: 3px solid #aaa;
                      border-radius: 20px;
                    "
                  >
                    <div class="d-flex mb-2 justify-space-between">
                      <span>العدد الاجمالي لاسئلة الاختبار</span>
                      <span class="text-primary">{{ totalQuestion }}</span>
                    </div>
                    <div class="d-flex mb-2 justify-space-between">
                      <span>عدد الأسئلة التي إجاباتها صحيحة</span>
                      <span class="text-success">{{
                        countCorrectQuestion
                      }}</span>
                    </div>
                    <div class="d-flex mb-2 justify-space-between">
                      <span>عدد الأسئلة التي تركت بدون إجابة</span>
                      <span class="text-orange">{{
                        countUnAnsweredQuestion
                      }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span>عدد الأسئلة التي إجاباتها خاطئة</span>
                      <span class="text-error">{{ countWrongQuestion }}</span>
                    </div>
                  </div>

                  <div class="my-10">
                    <h4 class="text-info text-center mb-8">النقطة على 20</h4>
                    <v-row class="justify-space-around">
                      <v-col
                        style="border-radius: 20px"
                        class="bg-orange-lighten-4 mb-2 py-8 text-center"
                        md="3"
                        cols="5"
                      >
                        <p class="text-h5 font-weight-black">النظام الكندي</p>

                        <p class="my-2 text-h4 font-weight-black">
                          {{ candyResult }}
                        </p>
                        <p
                          class="mx-auto mb-2 text-h4 font-weight-black"
                          style="width: 80%; height: 5px; background: black"
                        ></p>
                        <p class="text-h4 font-weight-black">20</p>
                      </v-col>
                      <v-col
                        style="border-radius: 20px"
                        class="bg-light-blue-accent-1 mb-2 py-8 text-center"
                        md="3"
                        cols="5"
                      >
                        <p class="text-h5 font-weight-black">النظام العادي</p>

                        <p class="my-2 text-h4 font-weight-black">
                          {{ normalResult }}
                        </p>
                        <p
                          class="mx-auto mb-2 text-h4 font-weight-black"
                          style="width: 80%; height: 5px; background: black"
                        ></p>
                        <p class="text-h4 font-weight-black">20</p>
                      </v-col>
                      <v-col
                        style="border-radius: 20px"
                        class="bg-deep-orange-lighten-4 mb-2 py-8 text-center"
                        md="3"
                        cols="5"
                      >
                        <p class="text-h5 font-weight-black">النظام الكندي 2</p>

                        <p class="my-2 text-h4 font-weight-black">
                          {{ candy2Result }}
                        </p>
                        <p
                          class="mx-auto mb-2 text-h4 font-weight-black"
                          style="width: 80%; height: 5px; background: black"
                        ></p>
                        <p class="text-h4 font-weight-black">20</p>
                      </v-col>
                    </v-row>
                  </div>
                  <div class="my-10">
                    <v-row class="justify-space-around">
                      <v-col
                        style="border-radius: 20px"
                        class="bg-orange-lighten-4 mb-2 py-8 text-center"
                        md="3"
                        cols="5"
                      >
                        <p class="text-h5 font-weight-black">النظام الكندي</p>
                        <p
                          class="my-2 text-h5 font-weight-black d-flex justify-center"
                        >
                          <span>الرتبة: </span>
                          <span>{{ normalRank }}</span>
                        </p>
                      </v-col>
                      <v-col
                        style="border-radius: 20px"
                        class="bg-light-blue-accent-1 mb-2 py-8 text-center"
                        md="3"
                        cols="5"
                      >
                        <p class="text-h5 font-weight-black">النظام العادي</p>
                        <p
                          class="my-2 text-h5 font-weight-black d-flex justify-center"
                        >
                          <span>الرتبة: </span>
                          <span>{{ canadyRank }}</span>
                        </p>
                      </v-col>
                      <v-col
                        style="border-radius: 20px"
                        class="bg-deep-orange-lighten-4 mb-2 py-8 text-center"
                        md="3"
                        cols="5"
                      >
                        <p class="text-h5 font-weight-black">النظام الكندي 2</p>
                        <p
                          class="my-2 text-h5 font-weight-black d-flex justify-center"
                        >
                          <span>الرتبة: </span>
                          <span>{{ canady2Rank }}</span>
                        </p>
                      </v-col>
                    </v-row>
                  </div>

                  <div>
                    <div class="text-center">
                      <v-btn
                        @click="showArrangementTable"
                        style="
                          background: linear-gradient(
                            to right,
                            #1dce44,
                            #04680c
                          );
                          border-radius: 25px;
                          color: white;
                        "
                      >
                        رؤية جدول الترتيب لهذا الاختبار
                      </v-btn>
                    </div>
                    <hr class="my-5" />

                    <div>
                      <p class="text-info text-center font-weight-bold my-10">
                        شرح أساليب التنقيط
                      </p>
                      <v-row class="justify-space-around">
                        <v-col
                          style="border-radius: 20px; border: 3px solid #ffe0b2"
                          class="mb-2 py-8 text-center"
                          md="3"
                          cols="5"
                        >
                          <p class="text-h5 font-weight-black">النظام الكندي</p>
                          <p class="my-2 text-success font-weight-black">
                            إجابة صحيحة: +1
                          </p>
                          <p class="my-2 text-warning font-weight-black">
                            تخطي السؤال: 0
                          </p>
                          <p class="my-2 text-erorr font-weight-black">
                            إجابة خاطئة: -1
                          </p>
                        </v-col>
                        <v-col
                          style="border-radius: 20px; border: 3px solid #80d8ff"
                          class="mb-2 py-8 text-center"
                          md="3"
                          cols="5"
                        >
                          <p class="text-h5 font-weight-black">النظام العادي</p>
                          <p class="my-2 text-success font-weight-black">
                            إجابة صحيحة: +1
                          </p>
                          <p class="my-2 text-warning font-weight-black">
                            تخطي السؤال: 0
                          </p>
                          <p class="my-2 text-erorr font-weight-black">
                            إجابة خاطئة: 0
                          </p>
                        </v-col>
                        <v-col
                          style="border-radius: 20px; border: 3px solid #ffccbc"
                          class="mb-2 py-8 text-center"
                          md="3"
                          cols="5"
                        >
                          <p class="text-h5 font-weight-black">
                            النظام الكندي 2
                          </p>
                          <p class="my-2 text-success font-weight-black">
                            إجابة صحيحة: +2
                          </p>
                          <p class="my-2 text-warning font-weight-black">
                            تخطي السؤال: 0
                          </p>
                          <p class="my-2 text-erorr font-weight-black">
                            إجابة خاطئة: -1
                          </p>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-show="tableResultShown"
                style="background-color: #fdf8ef; width: 100%"
                class="pa-3"
              >
                <div>
                  <span>
                    <span
                      class="text-decoration-underline pointer font-weight-bold"
                      @click="tableResultShown = false"
                      >نتيجتك</span
                    >
                  </span>
                  <span> / </span>
                  <span class="font-weight-bold pt-2 ml-5">
                    {{ result.examInfo.name }} - الترتيب</span
                  >
                </div>
              </div>
              <bannar-center></bannar-center>
              <div v-show="tableResultShown">
                <div class="my-10">
                  <div class="d-flex mb-3">
                    <v-select
                      label="Select"
                      style="max-width: 200px;min-width: 200px; height: 45px"
                      variant="outlined"
                      density="compact"
                      v-model="filterSelect"
                      item-title="name"
                      item-value="value"
                      :items="[
                        { name: 'النظام الكندي', value: 'canday' },
                        { name: 'النطام الكندي 2', value: 'canday2' },
                        { name: 'النظام العادي', value: 'normal' },
                      ]"
                    >
                      <template v-slot:item="{ props }">
                        <v-list-item
                          v-bind="props"
                          class="text-end"
                        ></v-list-item>
                      </template>
                    </v-select>
                  </div>
                  <div class="overflow-auto">
                    <v-table
                      height="600"
                      class="overflow-auto text-center"
                      hover
                      density="comfortable"
                    >
                      <thead>
                        <tr>
                          <th class="font-weight-bold text-center">#</th>
                          <th class="font-weight-bold text-center">المستخدم</th>
                          <th class="font-weight-bold text-center">
                            النظام الكندي
                          </th>
                          <th class="font-weight-bold text-center">
                            النظام العادي
                          </th>
                          <th class="font-weight-bold text-center">
                            النظام الكندي 2
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(user, index) in sortUsers" :key="user.id">
                          <td>
                            <v-avatar
                              color="#f1f1f1"
                              class="text-black font-weight-medium"
                              size="25"
                              >{{ index + 1 }}</v-avatar
                            >
                          </td>
                          <td>
                            <span class="text-md-subtitle-1 text-body-2"
                              ><span class="d-md-inline d-none">
                                <v-avatar
                                  size="30"
                                  :image="user.user.image"
                                ></v-avatar>
                              </span>

                              {{ user.user.name }}</span
                            >
                          </td>

                          <td class="text-orange">
                            {{ user.canady_mark <= 0 ? 0 : user.canady_mark }}
                          </td>
                          <td class="text-info">{{ user.normal_mark }}</td>
                          <td class="text-error">
                            {{ user.canady2_mark <= 0 ? 0 : user.canady2_mark }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </div>
                </div>
              </div>
              <div class="d-md-none d-block">
                <bannar-center></bannar-center>
              </div>
            </v-col>
            <v-col md="2" sm="0">
              <!-- <bannar-slide></bannar-slide> -->
            </v-col>
          </v-row>
        </div>
      </v-card>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";
const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const validate = ref(true);
const result = ref();
const tableResultShown = ref(false);
const countCorrectQuestion = ref();
const countWrongQuestion = ref();
const countUnAnsweredQuestion = ref();
const totalQuestion = ref();
const filterSelect = ref();
const allUsersInExam = ref();
const normalRank = ref();
const canadyRank = ref();
const canady2Rank = ref();

const normalResult = computed(() => {
  let res = (countCorrectQuestion.value * 20) / totalQuestion.value;
  return res.toFixed(2);
});
const candyResult = computed(() => {
  let res =
    ((countCorrectQuestion.value - countWrongQuestion.value) * 20) /
    totalQuestion.value;
  if (res <= 0) return 0;
  return res.toFixed(2);
});
const candy2Result = computed(() => {
  let res =
    ((countCorrectQuestion.value * 2 - countWrongQuestion.value) * 10) /
    totalQuestion.value;
  if (res <= 0) return 0;
  return res.toFixed(2);
});

definePageMeta({
  middleware: ["auth"],
});

const { data, error } = await useSendRequest<responseReturn>(
  "/exams/getUserResult",
  {
    token: authStore.token,
    id: route.params.id,
  }
);
if (error.value) {
  setToastMessage(error.value.message);
} else if (data.value?.status) {
  result.value = data.value.data;
  totalQuestion.value = result.value.examInfo.exam_question_count;
  countCorrectQuestion.value = result.value.totalResults.results;
  countUnAnsweredQuestion.value = totalQuestion.value - result.value.allAnswers;
  countWrongQuestion.value =
    totalQuestion.value -
    countCorrectQuestion.value -
    countUnAnsweredQuestion.value;
} else {
  setToastMessage(data.value?.message as string);
  validate.value = false;
  router.push("/exams");
}

(async () => {
  const { data: data2, error: error2 } = await useSendRequest<responseReturn>(
    "/exams/getExamUsers",
    {
      token: authStore.token,
      exam_id: route.params.id,
    }
  );
  if (error2.value) {
    setToastMessage(error2.value.message);
  } else if (data2.value?.status) {
    allUsersInExam.value = data2.value.data;
    calculateRank();
  } else {
    setToastMessage(data2.value?.message as string);
  }
})();

function calculateRank() {
  filterSelect.value = "canday";
  canadyRank.value =
    sortUsers.value.findIndex((item: any) => {
      return item.user.id == authStore.token.user_id;
    }) + 1;
  filterSelect.value = "canday2";
  canady2Rank.value =
    sortUsers.value.findIndex((item: any) => {
      return item.user.id == authStore.token.user_id;
    }) + 1;
  filterSelect.value = "normal";
  normalRank.value =
    sortUsers.value.findIndex((item: any) => {
      return item.user.id == authStore.token.user_id;
    }) + 1;
}

const sortUsers = computed(() => {
  if (!allUsersInExam.value) return [];
  if (filterSelect.value == "normal") {
    allUsersInExam.value.sort((a: any, b: any) => {
      if (a.normal_mark < b.normal_mark) return 1;
      return -1;
    });
  } else if (filterSelect.value == "canday") {
    allUsersInExam.value.sort((a: any, b: any) => {
      if (a.canady_mark < b.canady_mark) return 1;
      return -1;
    });
  } else if (filterSelect.value == "canday2") {
    allUsersInExam.value.sort((a: any, b: any) => {
      if (a.canady2_mark < b.canady2_mark) return 1;
      return -1;
    });
  }
  return allUsersInExam.value;
});

const showArrangementTable = () => {
  tableResultShown.value = true;
  window.scrollTo(0, 0);
};
useHead({
  title: result.value.examInfo.name + " - النتيجة",
  meta: [
    {
      name: "description",
      content:
        "تحتوي هذه الصفحة على نتيجةاختبار  " + result.value.examInfo.name,
    },
    {
      name: "description",
      content:
        "تحتوي هذه الصفحة على نتيجةاختبار  " + result.value.examInfo.name,
    },
    { property: "og:image", content: "/images/اختبارات.png" },
    { name: "twitter:card", content: "summay_large_image" },
    { property: "og:locale", content: "ar_ar" },
    { property: "og:url", content: "https://alqanoni.com/" },
    { property: "og:type", content: "website" },
  ],
  link: [{ rel: "canonical", href: "https://alqanoni.com/" }],
});
</script>
  
  <style>
</style>