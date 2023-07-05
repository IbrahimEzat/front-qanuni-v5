<template>
  <div>
    <div v-if="validate">
      <v-card min-height="100vh" color="#f4f4f4" class="">
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
            <div style="background-color: #fdf8ef; width: 100%" class="pa-3">
              <div class="d-flex justify-space-between">
                <span class="font-weight-bold pt-2 ml-5"> {{ examName }}</span>
              </div>
            </div>

            <hr class="mb-5" />

            <v-row class="justify-center my-8">
              <v-col sm="3" cols="6">
                <div class="d-flex align-center ms-10">
                  <span>سؤال رقم: </span>
                  <span class="text-warning text-h6 font-weight-bold">{{
                    currentIndex + 1
                  }}</span>
                </div>
                <div
                  @click="confirmAcceptExamDialog = true"
                  style="
                    border-radius: 10px;
                    background: linear-gradient(to right, #ac4747, #5a0505);
                  "
                  class="d-flex align-center justify-center py-8 px-12 pointer bg-error my-3"
                >
                  انتهاء
                </div>
                <div
                  style="
                    border: 2px solid black;
                    border-radius: 10px;
                    color: #333;
                  "
                  class="text-center py-3 font-weight-bold"
                >
                  <v-icon size="large" icon="mdi-timer-sand"></v-icon>
                  <div class="my-2">المؤقت</div>
                  <div
                    class=""
                    :class="[
                      { 'text-success': hoursRemain > 0 || minutesRemain > 1 },
                      { 'text-error': minutesRemain <= 1 && hoursRemain == 0 },
                    ]"
                  >
                    {{ timer }}
                  </div>
                </div>
              </v-col>
              <v-col sm="8" cols="12" class="font-weight-bold mt-10 ms-2">
                <div v-show="loading" class="h-100">
                  <div class="h-100 d-flex justify-center align-center">
                    <span>جاري تحميل السؤال...</span>
                  </div>
                </div>
                <div v-show="!loading">
                  <div style="font-size: 24px;">{{ currentQuestion.content }}:</div>
                  <div class="text-body-1" v-if="currentQuestion.answer_type == 'multi_choices'">
                    <div class="mt-3">
                      <input
                        :value="currentQuestion.answer[0]?.id"
                        v-model="currentAnswer"
                        type="checkbox"
                        class="me-2"
                        :disabled="isCurrentQuestionAnswered"
                      />
                      <span>{{ currentQuestion.answer[0]?.content }}</span>
                    </div>
                    <div class="mt-3">
                      <input
                        :value="currentQuestion.answer[1]?.id"
                        v-model="currentAnswer"
                        type="checkbox"
                        class="me-2"
                        :disabled="isCurrentQuestionAnswered"
                      />
                      <span>{{ currentQuestion.answer[1]?.content }}</span>
                    </div>
                    <div class="mt-3">
                      <input
                        :value="currentQuestion.answer[2]?.id"
                        v-model="currentAnswer"
                        type="checkbox"
                        class="me-2"
                        :disabled="isCurrentQuestionAnswered"
                      />
                      <span>{{ currentQuestion.answer[2]?.content }}</span>
                    </div>
                    <div class="mt-3">
                      <input
                        :value="currentQuestion.answer[3]?.id"
                        v-model="currentAnswer"
                        type="checkbox"
                        class="me-2"
                        :disabled="isCurrentQuestionAnswered"
                      />
                      <span>{{ currentQuestion.answer[3]?.content }}</span>
                    </div>
                  </div>
                  <div v-else>
                    <div class="mt-3">
                      <input
                        v-model="currentAnswer"
                        name="answers"
                        type="radio"
                        class="me-2"
                        :value="currentQuestion.answer[0]?.id"
                      />
                      <span>{{ currentQuestion.answer[0]?.content }}</span>
                    </div>
                    <div class="mt-3">
                      <input
                        v-model="currentAnswer"
                        name="answers"
                        type="radio"
                        class="me-2"
                        :value="currentQuestion.answer[1]?.id"
                      />
                      <span>{{ currentQuestion.answer[1]?.content }}</span>
                    </div>
                    <div class="mt-3">
                      <input
                        v-model="currentAnswer"
                        name="answers"
                        type="radio"
                        class="me-2"
                        :value="currentQuestion.answer[2]?.id"
                      />
                      <span>{{ currentQuestion.answer[2]?.content }}</span>
                    </div>
                    <div class="mt-3">
                      <input
                        v-model="currentAnswer"
                        name="answers"
                        type="radio"
                        class="me-2"
                        :value="currentQuestion.answer[3]?.id"
                      />
                      <span>{{ currentQuestion.answer[3]?.content }}</span>
                    </div>
                  </div>
                  <div class="mt-5">
                    <v-btn
                      @click="markUnCompleteQuestion"
                      :disabled="isCurrentQuestionAnswered"
                      size="large"
                      style="
                        color: white;
                        background: linear-gradient(to right, #555252, #333);
                      "
                      >الرجوع اليه لاحقا</v-btn
                    >
                    <v-btn
                      :disabled="
                        !currentAnswer ||
                        (currentQuestion.answer_type == 'multi_choices' &&
                          currentAnswer.length == 0) || isCurrentQuestionAnswered
                      "
                      @click="acceptQuestionAnswer"
                      :loading="loadingAcceptAnswer"
                      size="large"
                      style="
                        background: linear-gradient(to right, #097909, #034903);
                      "
                      color="success"
                      class="ms-3"
                      >تاكيد الاجابة</v-btn
                    >
                  </div>
                </div>
              </v-col>
            </v-row>
            <div
              class="d-sm-flex mx-1 my-8 py-4 align-center justify-center"
              style="background: linear-gradient(to right, #222, #555)"
            >
              <div class="text-white me-8 ps-2" style="width: 300px">
                <p class="mb-2 d-flex">
                  <v-icon
                    class="me-3"
                    color="red"
                    icon="mdi-lightbulb-on-outline"
                  ></v-icon>
                  <span
                    >- انتبه لا يمكنك تغيير إجابتك بعد تأكيدها
                  </span>
                </p>
                <p class="mb-2 d-flex">
                  <v-icon
                    class="me-3"
                    color="yellow"
                    icon="mdi-lightbulb-on-outline"
                  ></v-icon>
                  <span>- يمكنك التنقل بين الاسئلة بالضغط على رقم السؤال</span>
                </p>
                
                <p class="mb-5 d-flex">
                  <v-icon
                    class="me-3"
                    color="yellow"
                    icon="mdi-lightbulb-on-outline"
                  ></v-icon>
                  <span
                    >- لا تنسى اعتماد الاجابة قبل الانتقال الى سؤال اخر
                  </span>
                </p>
              </div>
              <div
                class="d-flex ma-2 flex-wrap text-white"
                style="width: 200px"
              >
                <div
                  v-for="(answer, index) in userAnswers"
                  :key="index"
                  :class="[
                    { 'bg-red': answer.answerState == 'back' },
                    { 'bg-success': answer.answerState == 'answered' },
                  ]"
                  class="px-3 py-1 me-1 mb-2 pointer"
                  style="border: 1px solid white; border-radius: 5px"
                  @click="goToQuestion(index)"
                >
                  {{ index + 1 }}
                </div>
              </div>
            </div>
            <hr class="mb-5" />

            <bannar-center></bannar-center>
            <div class="d-md-none d-block">
              <bannar-center></bannar-center>
            </div>
          </v-col>
          <v-col md="2" sm="0">
            <!-- <bannar-slide></bannar-slide> -->
          </v-col>
        </v-row>
      </v-card>
      <v-dialog
        v-model="confirmAcceptExamDialog"
        transition="dialog-top-transition"
        width="auto"
      >
        <v-card elevation="4" class="text-center" max-width="300">
          <v-card-text class="text-h6">
            <div class="">هل أنت متأكد من انهاء الاختبار</div>
            <div class="">يرجى التاكد من اجابة جميع الاسئلة</div>
          </v-card-text>
          <v-card-actions class="justify-center mb-3">
            <v-btn
              variant="flat"
              :loading="loadingAcceptExam"
              color="success"
              @click="acceptExam"
              >موافق</v-btn
            >
            <v-btn
              variant="flat"
              color="error"
              @click="confirmAcceptExamDialog = false"
              >تراجع</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="expireTimeDialog"
        persistent
        transition="dialog-top-transition"
        width="auto"
      >
        <v-card elevation="4" class="text-center" max-width="300">
          <v-card-text class="text-h6">
            <div class="">انتهى الاختبار</div>
            <div class="">يمكنك عرض نتيجتك الان</div>
          </v-card-text>
          <v-card-actions class="justify-center mb-3">
            <v-btn
              variant="flat"
              color="success"
              @click="$router.push('/exams/result/' + $route.params.id)"
              >موافق</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
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
const examName = ref();
const currentIndex = ref(0);
const questions = ref();
const userAnswers = ref<any>([]);
const currentAnswer = ref();
const loading = ref(false);
const loadingAcceptAnswer = ref(false);
const confirmAcceptExamDialog = ref(false);
const loadingAcceptExam = ref(false);
const expireTimeDialog = ref(false);
const duration = ref();
const hoursRemain = ref();
const minutesRemain = ref();
const secondsRemain = ref();
const validate = ref(false);
const timerInterval = ref();
const hourFormat = ref();
const minuteFormat = ref();
const secondFormat = ref();
const isCurrentQuestionAnswered = computed(()=>{
  return userAnswers.value[currentIndex.value].answerState == 'answered';
})

definePageMeta({
  middleware: ["auth"],
});
const { data: dataVlidate, error: errorValidate } =
  await useSendRequest<responseReturn>("/exams/validateUser", {
    token: authStore.token,
    id: route.params.id,
  });
if (errorValidate.value) {
  setToastMessage(errorValidate.value.message);
} else if (!dataVlidate.value?.status) {
  setToastMessage(dataVlidate.value?.message as string);
  router.push("/exams");
} else {
  validate.value = true;
}
const timer = computed(() => {
  hourFormat.value =
    hoursRemain.value < 10 ? "0" + hoursRemain.value : hoursRemain.value;
  minuteFormat.value =
    minutesRemain.value < 10 ? "0" + minutesRemain.value : minutesRemain.value;
  secondFormat.value =
    secondsRemain.value < 10 ? "0" + secondsRemain.value : secondsRemain.value;
  return hourFormat.value + ":" + minuteFormat.value + ":" + secondFormat.value;
});

watch(currentIndex, (newValue, oldValue) => {
  userAnswers.value[oldValue].answer = currentAnswer.value;
  currentAnswer.value = userAnswers.value[newValue].answer;
});

onMounted(() => {
  timerInterval.value = setInterval(() => {
    if (secondsRemain.value > 0) {
      secondsRemain.value--;
    } else {
      if (minutesRemain.value > 0) {
        minutesRemain.value--;
        secondsRemain.value += 59;
      } else {
        if (hoursRemain.value > 0) {
          hoursRemain.value--;
          minutesRemain.value += 59;
          secondsRemain.value += 59;
        } else {
          acceptExam();
          expireTimeDialog.value = true;
          clearInterval(timerInterval.value);
        }
      }
    }
  }, 1000);
});
onUnmounted(() => {
  clearInterval(timerInterval.value);
});

const currentQuestion = computed(() => {
  return questions.value[currentIndex.value];
});
const setDuration = (remainDuration: any) => {
  duration.value = remainDuration;
  if (duration.value <= 0) {
    expireTimeDialog.value = true;
    return;
  }
  hoursRemain.value = parseInt(duration.value / 3600 + "");
  duration.value = duration.value % 3600;
  minutesRemain.value = parseInt(duration.value / 60 + "");
  secondsRemain.value = parseInt((duration.value % 60) + "");
};
const { data, error } = await useSendRequest<responseReturn>(
  "/exams/question/get",
  {
    token: authStore.token,
    id: route.params.id,
  }
);
if (error.value) {
  setToastMessage(error.value.message);
} else if (data.value?.status) {
  const dataReturend = data.value.data as any;
  setDuration(dataReturend.remainingDuration);
  examName.value = dataReturend.exam.name;
  questions.value = dataReturend.exam.exam_question;
  let arr = <any>[];
  questions.value.forEach((element: any) => {
    if (element.answer_type == "multi_choices") {
      dataReturend.userAnswers.forEach((answer: any) => {
        if (answer.question_id == element.id) {
          arr.push(answer.answer_id);
        }
      });
      userAnswers.value.push({
        answerState: arr.length > 0 ? "answered" : "yet",
        answer: arr,
      });
      arr = [];
    } else {
      let answerId = null;
      for (let item of dataReturend.userAnswers) {
        if (item.question_id == element.id) {
          answerId = item.answer_id;
          break;
        }
      }
      userAnswers.value.push({
        answerState: answerId ? "answered" : "yet",
        answer: answerId,
      });
    }
  });
  currentAnswer.value = userAnswers.value[0].answer;
} else {
  setToastMessage(data.value?.message as string);
}

const markUnCompleteQuestion = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    userAnswers.value[currentIndex.value].answerState = "back";
    if (currentIndex.value < userAnswers.value.length - 1) currentIndex.value++;
  }, 500);
};

const goToQuestion = (index: any) => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    currentIndex.value = index;
  }, 500);
};

const acceptQuestionAnswer = async () => {
  loadingAcceptAnswer.value = true;
  let answers = currentAnswer.value;
  if (currentQuestion.value.answer_type != "multi_choices") {
    answers = [currentAnswer.value];
  }
  const { data, error } = await useSendRequest<responseReturn>(
    "/exams/question/acceptAnswer",
    {
      token: authStore.token,
      exam_id: route.params.id,
      question_id: currentQuestion.value.id,
      answers: answers,
    }
  );
  loadingAcceptAnswer.value = false;
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    userAnswers.value[currentIndex.value].answerState = "answered";
    if (currentIndex.value < userAnswers.value.length - 1) currentIndex.value++;
  } else {
    setToastMessage(data.value?.message as string);
  }
};

const acceptExam = async () => {
  loadingAcceptExam.value = true;

  const { data, error } = await useSendRequest<responseReturn>(
    "/exams/question/acceptExam",
    {
      token: authStore.token,
      exam_id: route.params.id,
    }
  );
  loadingAcceptExam.value = false;
  confirmAcceptExamDialog.value = false;
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    router.push("/exams/result/" + route.params.id);
  } else {
    setToastMessage(data.value?.message as string);
  }
};
useHead({
  title: examName.value,
  meta: [
    {
      name: "description",
      content: "تحتوي هذه الصفحة على اختبار  " + examName.value,
    },
    {
      name: "description",
      content: "تحتوي هذه الصفحة على اختبار  " + examName.value,
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

<style scopde>
.pointer {
  cursor: pointer;
}
</style>