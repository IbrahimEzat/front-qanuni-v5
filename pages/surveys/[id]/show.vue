<template>
  <div v-if="surveyInfo" style="min-height: 100vh" class="bg-blue-grey-lighten-5">
    <v-row>
      <v-col cols="2" class="ma-0">
        <bannar-slide></bannar-slide>
      </v-col>
      <v-col class="bg-white mt-sm-8 my-8 pa-0 mx-auto pb-10" md="8" sm="11" cols="11">
        <div style="background-color: #fdf8ef; width: 100%" class="d-flex justify-space-between px-3">
          <p style="width: 80%" class="font-weight-bold pa-4">
            <nuxt-link class="text-decoration-none font-weight-bold" to="/surveys"> استطلاعات</nuxt-link>
            / {{ surveyInfo.question_name }}
          </p>
          <div class="imageHolder pointer mt-3" @click="tryGoToAddSurvey">
            <v-btn rounded="xl" prepend-icon="mdi-pencil-circle-outline" color="black">أضف استطلاعاً</v-btn>
          </div>
        </div>
        <bannar-center></bannar-center>

        <div class="ma-3" style="width: 97.5%">
          <user-header :userId="surveyInfo.user.id" :userImage="surveyInfo.user.image" 
          :userName="surveyInfo.user.name" :userPoints="surveyInfo.user.points"
          :userJob="surveyInfo.user.job"/>
          
         
          <div class="d-flex justify-space-between px-sm-7 px-2 py-3">
            <div v-if="!isFavarite" @click="addToWishlist" class="imageHolder align-self-center pointer">
              <v-img style="width: 55px; height: 55px" src="/images/قائمة-المفضلة-قبل-الضغط.png"></v-img>
            </div>
            <div @click="deleteFromWishlist" v-else class="imageHolder align-self-center pointer">
              <v-img style="width: 55px; height: 55px" src="/images/قائمة-المفضلة-بعد-الضغط.png"></v-img>
            </div>
            <p class="text-md-h4 text-h5 align-self-center">
              {{ surveyInfo.question_name }}
            </p>
            <div>
              <div @click="addPoint" class="imageHolder align-self-center pointer">
                <v-img :width="40" src="/images/زائد-كبير.png"></v-img>
              </div>
              <p class="mr-3">
                {{ surveyInfo.question_points.question_points }}
              </p>
              <div @click="subPoint" class="imageHolder align-self-center pointer">
                <v-img :width="40" src="/images/ناقص-كبير.png"></v-img>
              </div>
            </div>
          </div>
          <div class="d-flex justify-center bg-blue-grey-lighten-5 py-4 rounded-b-xl">
            <div class="d-flex">
              <div class="imageHolder ml-1" style="width: 30px; height: 30px">
                <v-img src="/images/تاريخ.png" style="width: 100%; height: 100%"></v-img>
              </div>
              <p class="text-sm-h6 ml-4 align-self-center">
                {{ new Date(surveyInfo.created_at).toLocaleDateString(['ban','id']) }}
              </p>
            </div>
            <div class="d-flex align-self-center-center">
              <div class="imageHolder ml-1" style="width: 30px; height: 30px">
                <v-img src="/images/عدد-المشاهدات.png" style="width: 100%; height: 100%"></v-img>
              </div>
              <p class="text-sm-h6 ml-4 align-self-center">
                {{ surveyInfo.question_views.question_views }}
              </p>
            </div>
            <div class="d-flex">
              <div class="imageHolder ml-1 align-self-center" style="width: 30px; height: 30px">
                <v-img src="/images/عدد-التعليقات.png" style="width: 100%; height: 100%"></v-img>
              </div>
              <p class="text-sm-h6 ml-4 align-self-center">
                {{ surveyInfo.question_user_voit_count.number_user_voit }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="surveyInfo.survey_type === 'one_choice'" class="ms-10 mt-10">
          <h2 class="mb-4">{{ surveyInfo.question_name }}</h2>
          <v-radio-group v-model="userAnswer">
            <v-radio v-for="answer in answers" :key="answer.id" :value="answer.id" :label="answer.survey_asnwer">
              <template v-slot:label="{ props }">
                <strong style="font-size: 18px" v-bind="props">{{
                  answer.survey_asnwer
                }}</strong>
              </template>
            </v-radio>
          </v-radio-group>
        </div>
        <div v-else class="ms-10 mt-10">
          <h2 class="mb-4">{{ surveyInfo.question_name }}</h2>
          <div class="mb-2" v-for="answer in answers" :key="answer.id">
            <input class="me-3" v-model="userAnswer" type="checkbox" :value="answer.id" />
            <label style="font-weight: 700; font-size: 18px">{{
              answer.survey_asnwer
            }}</label>
          </div>
        </div>
        <div class="d-flex justify-center my-10">
          <v-btn :disabled="isAnswerd" @click="confirmAnswer" rounded="xl" class="me-5" color="success" size="x-large"
            :loading="confirmAnswerLoading">تأكيد رأيي</v-btn>
          <v-btn @click="$router.push('/surveys/' + $route.params.id + '/results')" rounded="xl" color="orange"
            size="x-large">نتيجة الاستطلاع</v-btn>
        </div>
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
const dialog = ref(false);
const isFavarite = ref(false);

const answers = ref();
const userAnswer = ref([]);
const surveyInfo = ref() as any;
const isAnswerd = ref(false);
const confirmAnswerLoading = ref(false);
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

    // checkActive();

    // const dataReturned = data.value.data as any;
    surveyInfo.value = dataReturned.question;
    answers.value = dataReturned.answers;
    isFavarite.value = dataReturned.userfavioret;
    isAnswerd.value = dataReturned.isAnswerd;

  }
}


async function confirmAnswer() {
  if (!authStore.isLogin) return setToastMessage("يلزمك تسجيل الدخول للاجابة");
  if (isAnswerd.value)
    return setToastMessage("لقد قمت بالاجابة مسبقا على هذا الاستطلاع");
  confirmAnswerLoading.value = true;
  let answersSend = <any>[];
  if (surveyInfo.value.survey_type === "one_choice") {
    answersSend.push(userAnswer.value);
  } else answersSend = userAnswer.value;

  const { data, error } = await useSendRequest<responseReturn>(
    "/surveys/confirm",
    {
      token: authStore.token,
      question_id: surveyInfo.value.id,
      answers: answersSend,
    }
  );
  confirmAnswerLoading.value = false;

  if (error.value) {
    setToastMessage('حدث خطأ ما');
  } else {
    if (data.value?.status) {
      isAnswerd.value = true;
      setToastMessage("تم ارسال اجابتك");
    } else {
      setToastMessage(data.value?.message as string);
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

function tryGoToAddSurvey() {
  if (authStore.isLogin) return navigateTo("/surveys/add");
  setToastMessage('عفوا يجب تسجيل الدخول');
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
  if (data.value?.status){
    surveyInfo.value.question_points.question_points = data.value.data;
    return;
  }
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
  if (data.value?.status){
    surveyInfo.value.question_points.question_points = data.value.data;
    return;
  }
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

useHead({
  title:surveyInfo.value.question_name,
  meta: [
    { name: "description", content: surveyInfo.value.question_name },
    { property: "og:description", content: surveyInfo.value.question_name },
    { property: "og:image", content: '/images/استطلاعات.png' },
    { name: "twitter:card", content: "summay_large_image" },
    { property:'og:locale',content:'ar_ar'},
    { property:'og:url',content:'https://alqanoni.com/'},
    { property:'og:type',content:'website'}
  ],
  link:[{rel:'canonical',href:'https://alqanoni.com/'}],
});
</script>
    
<style>
.pointer {
  cursor: pointer;
}

.content img {
  max-width: 100%;
}
</style>