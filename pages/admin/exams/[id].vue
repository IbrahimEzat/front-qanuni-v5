<template>
  <div>
    <v-card elevation="5" class="pa-3">
      <div class="d-flex justify-space-between align-center">
        <p class="font-weight-bold">{{ examName }}</p>
        <div>
          <v-btn
            v-if="exam.status == 'pending'"
            @click="isAddQuestionDialogShow = true"
            color="success"
            append-icon="mdi-plus"
            >أَضف سؤال</v-btn
          >
          <v-btn
            class="ms-2"
            :disabled="exam.status == 'active'"
            :loading="loadingAccept"
            @click="acceptExam"
            color="primary"
            >اعتماد الاختبار</v-btn
          >
        </div>
      </div>
      <hr class="mb-5 mt-4" />

      <v-expansion-panels color="black" class="mb-5">
        <v-expansion-panel title="معلومات الاختبار">
          <v-expansion-panel-text>
            <div class="my-10">
              <v-text-field
                label="عنوان الاختبار"
                variant="outlined"
                v-model="examName"
              ></v-text-field>
              <v-text-field
                label="مدة الاختبار بالدقيقة"
                variant="outlined"
                v-model="examDuration"
              ></v-text-field>
              <v-text-field
                label="نقاط الاختبار"
                variant="outlined"
                v-model="examPoints"
              ></v-text-field>
              <v-btn
                @click="changeExamInfo"
                :loading="loadingChangeExamInfo"
                color="success"
                >تعديل المعلومات</v-btn
              >
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels color="black" class="mb-5">
        <v-expansion-panel title="تصنيف الاختبار">
          <v-expansion-panel-text>
            <div class="my-2">
              <v-label>اختر التصنيف للاختبار</v-label>
              <v-select
                class="mt-2"
                v-model="categorySelect"
                :items="categories"
                item-title="name"
                item-value="id"
                label="Select"
                variant="outlined"
                multiple
                chips
                closable-chips
                persistent-hint
              >
                <template v-slot:item="{ props }">
                  <v-list-item v-bind="props" class="text-end"></v-list-item>
                </template>
              </v-select>
              <div class="text-end">
                <v-btn
                  @click="changeExamCatgeory"
                  v-model="categorySelect"
                  :loading="loadingChangeExamCategory"
                  :disabled="categorySelect.length == 0"
                  color="success"
                  >تعديل التصنيف</v-btn
                >
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels color="black" class="mb-5">
        <v-expansion-panel title="اسئلة الاختبار">
          <v-expansion-panel-text>
            <div
              :key="item.id"
              v-for="(item, index) in exam.exam_question"
              class="my-3"
            >
              <div class="d-flex justify-space-between">
                <p class="font-weight-bold">
                  {{ index + 1 }}- {{ item.content }}
                  <!-- <span
                    >({{
                      item.answer_type == "one_choice"
                        ? "أجابة واحدة"
                        : "عدة إجابات"
                    }})</span
                  > -->
                </p>
                <div>
                  <v-btn
                    @click="showDeleteDialog(item.id)"
                    color="error"
                    size="small"
                    >حذف السؤال</v-btn
                  >
                  <v-btn
                    @click="showUpdateDialog(item)"
                    color="primary"
                    size="small"
                    class="ms-3"
                    >تعديل السؤال</v-btn
                  >
                </div>
              </div>
              <div>
                <p
                  v-for="(answer, index) in item.answer"
                  :key="answer.id"
                  class="ms-5"
                >
                  {{ index + 1 }}- {{ answer.content
                  }}<v-icon
                    v-if="answer.isCorrect"
                    class="ms-3"
                    icon="mdi-check-circle"
                    color="success"
                  ></v-icon>
                </p>
              </div>
            </div>
            <div v-if="exam.exam_question.length === 0">لا يوجد اسئلة بعد</div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <v-dialog v-model="isAddQuestionDialogShow" persistent width="500px">
      <v-card elevation="10">
        <v-card-title class="text-end mt-5 font-weight-bold">
          <span v-if="questionIdWantUpdate == -1">أضف سؤالا جديدا</span
          ><span v-else>تعديل السؤال</span>
          <v-icon icon="mdi-file-question-outline"></v-icon
        ></v-card-title>
        <v-card-text dir="rtl">
          <v-text-field
            class="mt-3"
            label="محتوى السؤال"
            variant="outlined"
            v-model="questionContent"
          ></v-text-field>
          <!-- <v-select
            v-model="questionType"
            label="نوع السؤال"
            item-title="name"
            item-value="value"
            :items="[
              {
                name: 'اجابة واحدة',
                value: 'one_choice',
              },
              {
                name: 'عدة اجابات',
                value: 'multi_choices',
              },
            ]"
            variant="outlined"
          >
            <template v-slot:item="{ props }">
              <v-list-item class="text-end" v-bind="props"> </v-list-item>
            </template>
          </v-select> -->
          <hr class="my-5" />
          <div class="d-flex justify-space-between">
            <span for="" class="font-weight-bold">أضف الاجابات </span>
            <span for="" class="font-weight-bold text-success"
              >الاجابة الصحيحة
            </span>
          </div>
          <v-text-field
            class="mt-3"
            label="اجابة 1"
            variant="outlined"
            v-model="answer1Content"
          >
            <template v-slot:append="">
              <v-checkbox-btn
                color="success"
                v-model="answer1IsCorrect"
              ></v-checkbox-btn>
            </template>
          </v-text-field>

          <v-text-field
            class="mt-3"
            label="اجابة 2"
            variant="outlined"
            v-model="answer2Content"
          >
            <template v-slot:append="">
              <v-checkbox-btn
                color="success"
                v-model="answer2IsCorrect"
              ></v-checkbox-btn>
            </template>
          </v-text-field>
          <v-text-field
            class="mt-3"
            label="اجابة 3"
            variant="outlined"
            v-model="answer3Content"
          >
            <template v-slot:append="">
              <v-checkbox-btn
                color="success"
                v-model="answer3IsCorrect"
              ></v-checkbox-btn>
            </template>
          </v-text-field>
          <v-text-field
            class="mt-3"
            label="اجابة 4"
            variant="outlined"
            v-model="answer4Content"
          >
            <template v-slot:append="">
              <v-checkbox-btn
                color="success"
                v-model="answer4IsCorrect"
              ></v-checkbox-btn>
            </template>
          </v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="black" variant="outlined" @click="clearQuestion"
            >إغلاق</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="confirmAddQuestion"
            :loading="loadingAddQuestion"
            :disabled="!readyToAddQuestion"
            >تأكيد</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialogShown" persistent width="300px">
      <v-card elevation="10">
        <v-card-text class="text-end">
          هل انت متاكد من حذف هذا السؤال
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="black"
            variant="outlined"
            @click="
              () => {
                deleteDialogShown = false;
                questionIdNeedDelete = -1;
              }
            "
            >إغلاق</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="confirmDelete"
            :loading="loadingDelete"
            >تأكيد</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();
const route = useRoute();

definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "is-admin"],
});
const exam = ref();
const examDuration = ref();
const examPoints = ref();
const examName = ref();
const loadingAccept = ref(false);
const loadingChangeExamCategory = ref(false);
const loadingChangeExamInfo = ref(false);
const loadingAddQuestion = ref(false);
const loadingDelete = ref(false);
const isAddQuestionDialogShow = ref(false);
const deleteDialogShown = ref(false);
const questionIdNeedDelete = ref(-1);
const questionContent = ref("");
const questionType = ref("multi_choices");
const categories = ref();
const categorySelect = ref<any>([]);
const questionIdWantUpdate = ref(-1);
const answer1Content = ref();
const answer1IsCorrect = ref(false);

const answer2Content = ref();
const answer2IsCorrect = ref(false);

const answer3Content = ref();
const answer3IsCorrect = ref(false);

const answer4Content = ref();
const answer4IsCorrect = ref(false);

const { data, error } = await useSendRequest<responseReturn>(
  "/admin/exams/question/get",
  {
    token: authStore.token,
    id: route.params.id,
  }
);
if (error.value) {
  setToastMessage(error.value.message);
} else if (data.value?.status) {
  exam.value = data.value.data;
  examDuration.value = exam.value.duration;
  examPoints.value = exam.value.points;
  examName.value = exam.value.name;
} else {
  setToastMessage(data.value?.message as string);
}

const { data: data2, error: error2 } = await useSendRequest<responseReturn>(
  "/categories",
  {}
);
if (error2.value) {
  setToastMessage(error2.value.message);
} else if (data2.value?.status) {
  categories.value = data2.value.data;
}
const { data: data3, error: error3 } = await useSendRequest<responseReturn>(
  "/admin/exams/examCategory",
  {
    token: authStore.token,
    exam_id: route.params.id,
  }
);
if (error3.value) {
  setToastMessage(error3.value.message);
} else if (data3.value?.status) {
  categorySelect.value = data3.value.data;
}

const readyToAddQuestion = computed(() => {
  return (
    answer1Content.value &&
    answer2Content.value &&
    answer3Content.value &&
    answer4Content.value &&
    questionContent.value
  );
});

const showUpdateDialog = (question: any) => {
  questionIdWantUpdate.value = question.id;
  questionContent.value = question.content;
  answer1Content.value = question.answer[0].content;
  answer2Content.value = question.answer[1].content;
  answer3Content.value = question.answer[2].content;
  answer4Content.value = question.answer[3].content;
  answer1IsCorrect.value = !!question.answer[0].isCorrect;
  answer2IsCorrect.value = !!question.answer[1].isCorrect;
  answer3IsCorrect.value = !!question.answer[2].isCorrect;
  answer4IsCorrect.value = !!question.answer[3].isCorrect;
  isAddQuestionDialogShow.value = true;
};

const acceptExam = async () => {
  loadingAccept.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/exams/accept",
    {
      token: authStore.token,
      id: route.params.id,
    }
  );
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) exam.value.status = "active";
  setToastMessage(data.value?.message as string);
  loadingAccept.value = false;
};

const changeExamCatgeory = async () => {
  loadingChangeExamCategory.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/exams/changeExamCategory",
    {
      token: authStore.token,
      exam_id: route.params.id,
      category_ids: categorySelect.value,
    }
  );
  if (error.value) {
    setToastMessage(error.value.message);
  }
  setToastMessage(data.value?.message as string);
  loadingChangeExamCategory.value = false;
};

const changeExamInfo = async () => {
  loadingChangeExamInfo.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/exams/update",
    {
      token: authStore.token,
      id: route.params.id,
      duration: examDuration.value,
      points: examPoints.value,
      examName: examName.value,
    }
  );
  if (error.value) {
    setToastMessage(error.value.message);
  }
  setToastMessage(data.value?.message as string);
  loadingChangeExamInfo.value = false;
};

const changeQuestionInfo = async () => {
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/exams/question/update",
    {
      token: authStore.token,
      questionId: questionIdWantUpdate.value,
      content: questionContent.value,
      answer_type: questionType.value,
      answers: [
        { content: answer1Content.value, isCorrect: answer1IsCorrect.value },
        { content: answer2Content.value, isCorrect: answer2IsCorrect.value },
        { content: answer3Content.value, isCorrect: answer3IsCorrect.value },
        { content: answer4Content.value, isCorrect: answer4IsCorrect.value },
      ],
    }
  );
  let question = exam.value.exam_question.find((item: any) => {
    return item.id == questionIdWantUpdate.value;
  });

  question.content = questionContent.value;
  question.answer[0].content = answer1Content.value;
  question.answer[1].content = answer2Content.value;
  question.answer[2].content = answer3Content.value;
  question.answer[3].content = answer4Content.value;
  question.answer[0].isCorrect = answer1IsCorrect.value;
  question.answer[1].isCorrect = answer2IsCorrect.value;
  question.answer[2].isCorrect = answer3IsCorrect.value;
  question.answer[3].isCorrect = answer4IsCorrect.value;
  clearQuestion();
  loadingAddQuestion.value = false;
  if (error.value) {
    setToastMessage(error.value.message);
  }
  setToastMessage(data.value?.message as string);
};

const showDeleteDialog = (id: number) => {
  questionIdNeedDelete.value = id;
  deleteDialogShown.value = true;
};

const clearQuestion = () => {
  isAddQuestionDialogShow.value = false;
  answer1Content.value = "";
  answer1IsCorrect.value = false;
  answer2Content.value = "";
  answer2IsCorrect.value = false;
  answer3Content.value = "";
  answer3IsCorrect.value = false;
  answer4Content.value = "";
  answer4IsCorrect.value = false;
  questionContent.value = "";
  questionIdWantUpdate.value = -1;
};

const confirmDelete = async () => {
  loadingDelete.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/exams/question/delete",
    {
      token: authStore.token,
      id: questionIdNeedDelete.value,
    }
  );

  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    exam.value.exam_question = exam.value.exam_question.filter((item: any) => {
      return item.id != questionIdNeedDelete.value;
    });
    questionIdNeedDelete.value = -1;
    deleteDialogShown.value = false;
  }
  setToastMessage(data.value?.message as string);
  loadingDelete.value = false;
};

const confirmAddQuestion = async () => {
  loadingAddQuestion.value = true;
  if (questionIdWantUpdate.value != -1) {
    changeQuestionInfo();
    return;
  }
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/exams/question/add",
    {
      token: authStore.token,
      exam_id: route.params.id,
      content: questionContent.value,
      answer_type: questionType.value,
      answers: [
        { content: answer1Content.value, isCorrect: answer1IsCorrect.value },
        { content: answer2Content.value, isCorrect: answer2IsCorrect.value },
        { content: answer3Content.value, isCorrect: answer3IsCorrect.value },
        { content: answer4Content.value, isCorrect: answer4IsCorrect.value },
      ],
    }
  );
  loadingAddQuestion.value = false;

  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    exam.value.exam_question.push(data.value.data);
    clearQuestion();
  } else {
    setToastMessage(data.value?.message as string);
  }
};
</script>

<style>
</style>