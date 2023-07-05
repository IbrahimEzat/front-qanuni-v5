<template>
  <div
    v-if="surveyInfo"
    style="min-height: 100vh"
    class="bg-blue-grey-lighten-5"
  >
    <v-row>
      <v-col cols="2" class="ma-0">
        <bannar-slide></bannar-slide>
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
            <NuxtLink to="/surveys" class="pointer" style="text-decoration: none;">استطلاعات / </NuxtLink>
            <span class="pointer" style="color: rgb(89, 21, 153);" @click="$router.push('/surveys/' + route.params.id + '/show')">{{ surveyInfo.question_name }}</span> / النتائج
          </p>
          <div class="imageHolder pointer mt-3" @click="tryGoToAddSurvey">
            <v-btn
              rounded="xl"
              prepend-icon="mdi-pencil-circle-outline"
              color="black"
              >أضف استطلاعاً</v-btn
            >
          </div>
        </div>
        <banner-center></banner-center>

        <div class="mx-3 my-10" style="width: 97.5%">
          <v-card
            color="black"
            class="d-md-flex bg-blue-grey-darken-5 rounded-t-xl"
          >
            <div class="text-h5 d-flex align-center ps-sm-10 ps-16">
              <follow :id="surveyInfo.user.id"/>
              <div class="imageHolder d-flex ms-1">
                <v-avatar size="100">
                  <v-img cover :src="surveyInfo.user.image"></v-img>
                </v-avatar>
              </div>
              <p class="text-h5 mr-3">
                {{ surveyInfo.user.name }}
              </p>
            </div>
            <v-divider class="mt-5 d-md-none d-block"></v-divider>
            <div class="pr-1 d-flex mr-sm-11 mr-0 py-5">
              <div
                class="text-h6 mr-sm-5 mr-8 align-self-center d-md-none d-flex"
                style="width: 100%"
              >
                <div
                  class="d-flex justify-space-between pl-5"
                  style="width: 100%"
                >
                  <span> {{ surveyInfo.user.job }}</span>
                  <span
                    >الأوسمة التي حصل عليها :
                    <span class="text-blue">لا شي</span></span
                  >
                  <span>
                    نقاط الكتاب :
                    <span class="text-blue">{{
                      surveyInfo.user.points
                    }}</span></span
                  >
                </div>
              </div>
              <div
                class="text-h6 mr-sm-5 mr-8 align-self-center d-md-flex d-none"
              >
                <div>
                  <p>{{ surveyInfo.user.job }}</p>
                  <p>
                    الأوسمة التي حصل عليها :
                    <span class="text-blue">لا شي</span>
                  </p>
                  <p>
                    نقاط الكتاب :
                    <span class="text-blue">{{ surveyInfo.user.points }}</span>
                  </p>
                </div>
              </div>
            </div>
          </v-card>
          <div class="d-flex justify-space-between px-sm-7 px-2 py-3">
            <div
              v-if="!isFavarite"
              @click="addToWishlist"
              class="imageHolder align-self-center pointer"
            >
              <v-img
                style="width: 55px; height: 55px"
                src="/images/قائمة-المفضلة-قبل-الضغط.png"
              ></v-img>
            </div>
            <div
              @click="deleteFromWishlist"
              v-else
              class="imageHolder align-self-center pointer"
            >
              <v-img
                style="width: 55px; height: 55px"
                src="/images/قائمة-المفضلة-بعد-الضغط.png"
              ></v-img>
            </div>
            <p class="text-md-h4 text-h5 align-self-center">
              {{ surveyInfo.question_name }}
            </p>
            <div>
              <div
                @click="addPoint"
                class="imageHolder align-self-center pointer"
              >
                <v-img :width="40" src="/images/زائد-كبير.png"></v-img>
              </div>
              <p class="mr-3">
                {{ surveyInfo.question_points.question_points }}
              </p>
              <div
                @click="subPoint"
                class="imageHolder align-self-center pointer"
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
                {{ new Date(surveyInfo.created_at).toLocaleDateString(['ban','id']) }}
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
                {{ surveyInfo.question_views.question_views }}
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
                {{ surveyInfo.question_user_voit_count.number_user_voit }}
              </p>
            </div>
          </div>
        </div>

        <div class="ms-10 mt-10">
          <h2 class="mb-4">{{ surveyInfo.question_name }}</h2>
          <v-list v-model="userAnswer">
            <v-list-item
              v-for="(answer, index) in answers"
              :key="answer.id"
              class="font-weight-bold"
            >
              <span class="me-2">{{ index + 1 }}-</span>
              <span>{{ answer.survey_asnwer }}</span>
            </v-list-item>
          </v-list>
        </div>

        <v-container>
          <div class="mt-5 mb-15">
            <div class="mx-auto">
              <div
                rounded="xl"
                class="font-weight-bold text-center pt-1 mb-5"
                style="border: 1px solid #555; border-radius: 15px"
              >
                نتيجة التصويت:
              </div>
              <v-table density="comfortable" class="text-center">
                <thead>
                  <th style="width: 20px">الاختيار</th>
                  <th>المصوتون</th>
                  <th>ذكور</th>
                  <th>إناث</th>
                </thead>
                <tbody>
                  <tr :key="answer.id" v-for="(answer, index) in answersResult">
                    <td style="width: 20px">
                      <v-avatar size="25" color="black">{{
                        index + 1
                      }}</v-avatar>
                    </td>
                    <td>
                      <span
                        class="d-block py-1 bg-blue-grey-lighten-5"
                        style="border-radius: 25px"
                        >{{ answer.answer_result }}</span
                      >
                    </td>
                    <td>
                      <span
                        class="d-block py-1 bg-blue-lighten-3"
                        style="border-radius: 25px"
                        >{{ answer.male_gender }}</span
                      >
                    </td>
                    <td>
                      <span
                        class="d-block py-1 bg-blue-grey-lighten-5"
                        style="border-radius: 25px"
                        >{{ answer.female_gender }}</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>المجموع</td>
                    <td>
                      <span
                        class="d-block py-1 bg-blue-grey-lighten-5"
                        style="border-radius: 25px"
                        >{{ totalVoit }}</span
                      >
                    </td>
                    <td>
                      <span
                        class="d-block py-1 bg-blue-lighten-3"
                        style="border-radius: 25px"
                        >{{ maleVoit }}</span
                      >
                    </td>
                    <td>
                      <span
                        class="d-block py-1 bg-blue-grey-lighten-5"
                        style="border-radius: 25px"
                        >{{ femaleVoit }}</span
                      >
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </div>

          <div class="mx-auto">
            <div
              rounded="xl"
              class="font-weight-bold text-center pt-1 mb-5"
              style="border: 1px solid #555; border-radius: 15px"
            >
              نتيجة التصويت بالنسبة المئوية:
            </div>
            <v-table density="comfortable" class="text-center">
              <thead>
                <th style="width: 20px">الاختيار</th>
                <th class="text-start ps-10"><span>المصوتون</span></th>
              </thead>
              <tbody>
                <tr :key="index" v-for="(ratio, index) in voitAnswersRatio">
                  <td style="width: 20px">
                    <v-avatar size="25" color="black">{{ index + 1 }}</v-avatar>
                  </td>
                  <td>
                    <span
                      class="d-block py-1 bg-blue-grey-lighten-5"
                      style="border-radius: 25px; width: 100px"
                      >{{ ratio }} % </span
                    >
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-container>
      </v-col>
      <v-col cols="2">
        <bannar-slide></bannar-slide>
      </v-col>
    </v-row>
  </div>
</template>
      
    <script setup lang="ts">
import { set } from "nuxt/dist/app/compat/capi";
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";

const route = useRoute();
const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();
const isFavarite = ref(false);
const answers = ref();
const userAnswer = ref([]);
const surveyInfo = ref() as any;
const isAnswerd = ref(false);

const totalVoit = ref(0);
const maleVoit = ref(0);
const femaleVoit = ref(0);
const answersResult = ref();

const voitAnswersRatio = computed(() => {
  const arr = <any>[];
  let totalVoit = 0;
  answersResult.value.forEach((item: any) => {
    totalVoit += parseInt(item.answer_result);
  });
  answersResult.value.forEach((item: any) => {
    let ratio = (item.answer_result * 100) / (totalVoit == 0 ? 1 : totalVoit);
    let formatRatio =
      parseInt(ratio.toFixed(2)) == parseFloat(ratio.toFixed(2))
        ? parseInt(ratio.toFixed(2))
        : parseFloat(ratio.toFixed(2));
    arr.push(formatRatio);
  });
  return arr;
});

const { data, error } = await useSendRequest<responseReturn>("/surveys/show", {
  survey_id: route.params.id,
  token: authStore.token,
});
if (error.value) {
  setToastMessage('حدث خطأ ما');
} else {
  if (data.value?.status) {

    const dataReturned = data.value.data as any;
    if(dataReturned.question.status == 'pending'){
      setToastMessage('لا يمكنك الوصول إلى هذه الصفحة')
      navigateTo('/surveys')
    }

    surveyInfo.value = dataReturned.question;
    answers.value = dataReturned.answers;
    isFavarite.value = dataReturned.userfavioret;
    isAnswerd.value = dataReturned.isAnswerd;
  }
}
const surveyAnswers = computed(() => {
  const arr = <any>[];
  answers.value.forEach((element: any) => {
    arr.push(element.id);
  });
  return arr;
});
const { data: results, error: erorrResults } =
  await useSendRequest<responseReturn>("/surveys/getResults", {
    survey_answers: surveyAnswers.value,
  });
if (error.value) {
  setToastMessage('حدث خطأ ما');
} else {
  if (data.value?.status) {
    checkActive();
    answersResult.value = results.value?.data;

    answersResult.value.forEach((item: any) => {
      totalVoit.value += parseInt(item.answer_result);
      maleVoit.value += parseInt(item.male_gender);
      femaleVoit.value += parseInt(item.female_gender);
    });
  }
}

async function checkActive() {
  const { data, error } = await useSendRequest<responseReturn>("/surveys/checkSurveyActive", {
      survey_id: route.params.id,
      token: authStore.token,
    })
    if(error.value) {
      setToastMessage('حدث خطأ ما')
    } else {
      if(!data.value?.status) {
        surveyInfo.value = null;
        answersResult.value = null;
        setToastMessage('لا يمكنك الوصول إلى هذه الصفحة')
        navigateTo('/surveys')
      }
    }
}

async function addToWishlist() {
  if (!authStore.isLogin) return setToastMessage("يلزمك تسجيل دخول لفعل ذلك");
  const { data, error } = await useSendRequest<responseReturn>(
    "/surveys/wishlist/add",
    {
      question_id: route.params.id,
      token: authStore.token,
    }
  );
  if (error.value) return setToastMessage('حدث خطأ ما');
  if (data.value?.status) isFavarite.value = true;
  setToastMessage(data.value?.message as string);
}
async function deleteFromWishlist() {
  if (!authStore.isLogin) return setToastMessage("يلزمك تسجيل دخول لفعل ذلك");
  const { data, error } = await useSendRequest<responseReturn>(
    "/surveys/wishlist/delete",
    {
      question_id: route.params.id,
      token: authStore.token,
    }
  );
  if (error.value) return setToastMessage('حدث خطأ ما');
  if (data.value?.status) isFavarite.value = false;
  setToastMessage(data.value?.message as string);
}

async function addPoint() {
  if (!authStore.isLogin) return setToastMessage("يلزمك تسجيل دخول");
  const { data, error } = await useSendRequest<responseReturn>(
    "/surveys/points/add",
    {
      question_id: route.params.id,
      token: authStore.token,
    }
  );
  if (error.value) return setToastMessage('حدث خطأ ما');
  if (data.value?.status)
    return surveyInfo.value.question_points.question_points++;
  setToastMessage(data.value?.message as string);
}
async function subPoint() {
  if (!authStore.isLogin) return setToastMessage("يلزمك تسجيل دخول");
  const { data, error } = await useSendRequest<responseReturn>(
    "/surveys/points/delete",
    {
      question_id: route.params.id,
      token: authStore.token,
    }
  );
  if (error.value) return setToastMessage('حدث خطأ ما');
  if (data.value?.status)
    return surveyInfo.value.question_points.question_points--;
  setToastMessage(data.value?.message as string);
}

(async () => {
  const surveyesViews = useCookie<Array<string>>("surveyesViews", {
    maxAge: 60 * 60 * 24,
  });
  if (!surveyesViews.value) {
    surveyesViews.value = [];
  }
  if (!surveyesViews.value.includes(route.params.id as string)) {
    const { data, error } = await useSendRequest<responseReturn>(
      "/surveys/views/add",
      {
        question_id: route.params.id,
      }
    );
    if (error.value) return;
    if (data.value?.status) {
      surveyesViews.value.push(route.params.id as string);
    }
  }
})();
function tryGoToAddSurvey() {
  if (authStore.isLogin) return navigateTo("/surveys/add");
  setToastMessage("عفوا يجب تسجيل الدخول");
}

useHead({
  title:'نتائج استطلاع: ' + surveyInfo.value.question_name,
  meta: [
    { name: "description", content: 'نتائج استطلاع: ' + surveyInfo.value.question_name, },
    { property: "og:description", content: 'نتائج استطلاع: ' + surveyInfo.value.question_name, },
    { property: "og:image", content: '/images/استطلاعات.png' },
    { name: "twitter:card", content: "summay_large_image" },
    { property:'og:locale',content:'ar_ar'},
    { property:'og:url',content:'https://alqanoni.com/'},
    { property:'og:type',content:'website'}
  ],
  link:[{rel:'canonical',href:'https://alqanoni.com/'}],
});
</script>
      
    <style >
td {
  border: none !important;
}
.pointer {
  cursor: pointer;
}
.content img {
  max-width: 100%;
}
</style>
