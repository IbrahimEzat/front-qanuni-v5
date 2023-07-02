<template>
  <div style="min-height: 100vh;" class="bg-blue-grey-lighten-5">
    <v-row >
      <v-col cols="2" class="ma-0">
        <bannar-slide></bannar-slide>
      </v-col>
      <v-col
        class="bg-white mt-sm-8 my-8 pa-0 mx-auto"
        md="8"
        sm="11"
        cols="11"
      >
        <div style="background-color: #fdf8ef; width: 100%">
          <p class="font-weight-bold pa-4"> <NuxtLink to="/surveys" class="pointer" style="text-decoration: none;">استطلاعات</NuxtLink> / أضف استطلاعاً</p>
        </div>
        <bannar-center></bannar-center>

        <div
          class="ma-3 pa-5"
          style="width: 97.5%; border: 2px solid #000; border-radius: 20px"
        >
          <div>
            <p class="text-h6">سؤال الاستطلاع :</p>
            
            <v-text-field
              v-model="title"
              class=""
              type="text"
              density="compact"
              variant="outlined"
            ></v-text-field>
          </div>
          <div>
            <p class="text-h6 mb-2">الاختيارات</p>
            <v-text-field
              v-for="(choice, index) in choices"
              :key="choice.label"
              :label="'إجابة ' + (index + 1)"
              v-model="choice.body"
              class=""
              type="text"
              density="compact"
              variant="outlined"
              :append-inner-icon="choice.appendIcon"
              @click:append-inner="deleteChoice(choices.indexOf(choice))"
            ></v-text-field>
          </div>
          <div>
            <v-btn
              prepend-icon="mdi-plus"
              size="x-large"
              style="border: 1px solid black"
              rounded="xl"
              @click="addNewChoice"
              text="المزيد من الخيارات"
              ></v-btn
            >
          </div>
          <div class="mt-5 ">
            <v-radio-group class="font-weight-bold" v-model="surveyType" label="نوع الاستطلاعات">
                <v-radio value="one_choice" label="اختيار جواب واحد"></v-radio>
                <v-radio value="multi_choices" label="اختيار عدة أجوبة"></v-radio>
            </v-radio-group>
          </div>
          <div style="text-align: end">
            <v-btn
              :disabled="!readyToSend"
              :loading="addSurveyLoading"
              @click="addSurvey"
              variant="outlined"
              class="rounded-pill mt-3"
              style="color: white; background-color: #333"
            >
              <p class="text-h6">أضف استطلاعاً</p>
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col cols="2">
        <bannar-slide></bannar-slide>
      </v-col>
    </v-row>
    <v-dialog
      persistent
      v-model="dialog"
      transition="dialog-top-transition"
      width="auto"
    >
      <v-card elevation="4" max-width="300">
        <v-card-title class="text-success"
          >الاستطلاع في طور المعالجة</v-card-title
        >
        <v-card-text class="text-h6">
          <div class="">
            لقد تم إرسال الاستطلاع إلى المسؤولين عن قسم الاستطلاعات وستنشر للعموم بعد
            مراجعتها إن شاء الله
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            variant="flat"
            color="success"
            @click="
              dialog = false;
              $router.push('/surveys');
            "
            >موافق</v-btn
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

definePageMeta({
  middleware: ["auth"],
});



const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();
const choices = ref([
  { label: "اجابة 1", body: "", appendIcon: "" },
  { label: "اجابة 2", body: "", appendIcon: "" },
]);
const readyToSend = computed(() => {
    for(let i =0 ;i<choices.value.length;i++){
        const choice = choices.value[i];
        if(!choice.body)
            return false;
    }
    return title.value !== '';
});
const surveyType = ref('one_choice');
const dialog = ref(false);
const addSurveyLoading = ref(false);
const title = ref("");


function deleteChoice(choice: any) {

  choices.value.splice(choice, 1);
}
function addNewChoice() {
  const newChoice = {
    label: `اجابة ${choices.value.length + 1}`,
    body: "",
    appendIcon: "mdi-close",
  };
  choices.value.push(newChoice);
}

async function addSurvey() {
  addSurveyLoading.value = true;
  const { data, error } = await useSendRequest<responseReturn>("/surveys/add", {
    question_name: title.value,
    survey_type: surveyType.value,
    choices:choices.value,
    token: authStore.token
  });
  addSurveyLoading.value = false;
  if (error.value) {
    setToastMessage('حدث خطأ ما');
    return;
  }
  if (data.value?.status) {
    dialog.value = true;
    sendNotification(data.value.data);
  } else {
    setToastMessage(data.value?.message as string);
  }
}
async function sendNotification(dataNotify: any) {
  useSendRequest<responseReturn>("/notificatoin/admin/new-survey", {
    dataNotify: dataNotify,
    token: authStore.token
  });
}
useHead({
  title: "استطلاعات - أضف استطلاع",
  meta: [
    {
      name: "description",
      content:
        "يمكنك إضافة استطلاع جديدة ونشرها على الموقع ويمكن للزوار الإطلاع والتصويت عليها  ",
    },
    {
      property: "og:description",
      content:
        "يمكنك إضافة استطلاع جديدة ونشرها على الموقع ويمكن للزوار الإطلاع والتصويت عليها  ",
    },
    { property: "og:image", content: "/images/استطلاعات.png" },
    { name: "twitter:card", content: "summay_large_image" },
    { property: "og:locale", content: "ar_ar" },
    { property: "og:url", content: "https://alqanouni.com/" },
    { property: "og:type", content: "website" },
  ],
  link: [{ rel: "canonical", href: "https://alqanouni.com/" }],
});
</script>
  
  