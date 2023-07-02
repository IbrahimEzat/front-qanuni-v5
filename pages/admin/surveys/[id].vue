<template>
  <div>
    <div class="ma-3 pa-5" style="width: 97.5%; border: 1px solid #000; border-radius: 20px">
      <div>
        <p class="text-h6">عنوان الاستطلاع :</p>

        <v-text-field :model-value="surveyInfo.question_name" disabled class="" type="text" density="compact"
          variant="outlined"></v-text-field>
      </div>
      <div>
        <p class="text-h6 mb-2">الاختيارات</p>
        <v-text-field disabled v-for="choice in surveyInfo.survey_answers" :key="choice.survey_asnwer"
          :model-value="choice.survey_asnwer" class="" type="text" density="compact" variant="outlined"></v-text-field>
      </div>

      <div class="mt-2">
        <v-radio-group disabled inline class="font-weight-bold" v-model="surveyInfo.survey_type" label="نوع الاستطلاعات">
          <v-radio value="one_choice" label="اختيار جواب واحد"></v-radio>
          <v-radio value="multi_choices" label="اختيار عدة أجوبة"></v-radio>
        </v-radio-group>
      </div>
      <div>
        <v-label class="text-h6">اختر التصنيف للاستطلاع</v-label>
        <v-select v-model="categorySelect" :items="categories" item-title="name" item-value="id" label="Select"
          variant="outlined" multiple chips closable-chips persistent-hint>
          <template v-slot:item="{ props }">
            <v-list-item v-bind="props" class="text-end"></v-list-item>
          </template>
        </v-select>
      </div>
      <div class="d-flex justify-space-between">
        <div>

          <v-btn color="red-darken-3 mt-3 rounded-pill" @click="$router.push('/admin/surveys')">إغلاق</v-btn>
        </div>
        <div style="text-align: end">
          <v-btn variant="outlined" class="rounded-pill mt-3" :loading="changeButtonLoading" @click="changeCategory"
            style="color: white; background-color: #333">
            <p class="text-h6">تعديل التصنيف</p>
          </v-btn>
          <v-btn :disabled="surveyStatus === 'active'" variant="outlined" class="rounded-pill mt-3"
            :loading="acceptButtonLoading" @click="changeStatus" style="color: white; background-color: #333">
            <p class="text-h6">اعتماد الاستطلاع</p>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>
      
<script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";
const route = useRoute();

definePageMeta({
  middleware: ["auth", "is-admin"],
  layout: "dashboard",
});

const categorySelect = ref();
const categories = ref();
const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();
const changeButtonLoading = ref(false);
const acceptButtonLoading = ref(false);
const surveyStatus = ref();

const surveyInfo = ref();
const { data, error } = await useSendRequest<responseReturn>(
  "/admin/surveys/getSurveyInfo",
  {
    survey_id: route.params.id,
  }
);
if (error.value) {
  setToastMessage(error.value.message);
} else {
  surveyInfo.value = data.value?.data;
  surveyStatus.value = surveyInfo.value.status;
}

(async () => {
  const { data, error } = await useSendRequest<responseReturn>(
    "/categories",
    {}
  );
  if (error.value) {
    setToastMessage(error.value.message);
    return;
  }
  if (data.value?.status) {
    categories.value = data.value.data;
  }

  const { data: selected, error: errorSelected } =
    await useSendRequest<responseReturn>("/admin/surveys/getServeyCategory", {
      survey_id: route.params.id,
    });
  if (errorSelected.value) {
    setToastMessage(errorSelected.value.message);
    return;
  }
  if (selected.value?.status) {
    categorySelect.value = selected.value.data;
  }
})();

async function changeCategory() {
  changeButtonLoading.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/surveys/changeSurveyCategory",
    {
      survey_id: route.params.id,
      category_ids: categorySelect.value,
      token: authStore.token

    }
  );
  changeButtonLoading.value = false;
  if (error.value) {
    setToastMessage(error.value.message);
  } else {
    if (data.value?.status) {
      setToastMessage("تم تعديل الاستطلاع");
    }
  }
}
async function changeStatus() {
  acceptButtonLoading.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/surveys/changeSurveyStatus",
    {
      survey_id: route.params.id,
      token: authStore.token
    }
  );
  acceptButtonLoading.value = false;
  if (error.value) {
    setToastMessage(error.value.message);
  } else {
    if (data.value?.status) {
      setToastMessage("تم اعتماد الاستطلاع");
      surveyStatus.value = 'active';
      sendNotification(data.value?.data);

    }
  }
}
async function sendNotification(dataNotify: any) {
  useSendRequest<responseReturn>("/notificatoin/accept-survey", {
    dataNotify: dataNotify,
  });
}
</script>
    
    