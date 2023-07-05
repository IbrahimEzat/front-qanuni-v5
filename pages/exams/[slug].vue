<template>
  <v-card min-height="100vh" color="#f4f4f4" class="">
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
        <div style="background-color: #fdf8ef; width: 100%" class="pa-3">
          <div class="d-flex justify-space-between">
            <span class="font-weight-bold pt-2 ml-5"
              ><nuxt-link
                class="text-decoration-none font-weight-bold"
                to="/exams"
                >اختبارات</nuxt-link
              >
              <span>/ {{ categoryInfo.name }}</span></span
            >
          </div>
          <div class="d-sm-flex justify-space-between mt-5">
            <p class="font-weight-bold mt-3 ml-8 d-md-block d-none">
              يحتوي على :
              <span style="color: red"> {{ exams.length }} اختبارات</span>
            </p>
            <div class="d-flex">
              <v-select
                label="Select"
                style="min-width: 200px; height: 45px"
                variant="outlined"
                class="pa-0 ml-10"
                density="compact"
                v-model="filterSelect"
                item-title="name"
                item-value="value"
                :items="[
                  { name: 'الاحدث اولا', value: 'newest' },
                  { name: 'الاقدم اولا', value: 'oldest' },
                  { name: 'الاكثر مشاركين', value: 'mostMember' },
                  { name: 'الاقل مشاركين', value: 'leastMember' },
                  { name: 'الاكثر اسئلة', value: 'mostQuestion' },
                  { name: 'الاقل اسئلة', value: 'leastQuestion' },
                ]"
              >
                <template v-slot:item="{ props }">
                  <v-list-item v-bind="props" class="text-end"></v-list-item>
                </template>
              </v-select>
            </div>
            <v-text-field
              clearable
              style="max-width: 200px; height: 9px"
              class="rounded-pill"
              label="ابحث"
              density="compact"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
            ></v-text-field>
          </div>
          <p class="font-weight-bold mt-10 ml-8 d-md-none d-block">
            يحتوي على :
            <span style="color: red"> {{ exams.length }} اختبارات</span>
          </p>
        </div>
        <bannar-center></bannar-center>
        <v-row>
          <v-col
            @click="goToExam(exam)"
            cols="10"
            sm="6"
            class="mx-auto"
            v-for="exam in currentExams"
            :key="exam.id"
          >
            <v-card
              border
              class="h-100 my-2 mx-1 px-3 py-2 bg-yellow-lighten-5 pointer"
              style="border-radius: 15px; border: 1px solid #999"
            >
              <h2 class="text-center mt-2 mb-5">{{ exam.name }}</h2>
              <div class="d-md-flex justify-space-between">
                <div>
                  <div class="d-flex mb-2">
                    <v-icon color="#333" icon="mdi-timer-sand"></v-icon>
                    <span class="ms-2">مدة الاختبار:</span>
                    <time-convert :minute="exam.duration" />
                  </div>
                  <div class="d-flex mb-2">
                    <v-icon color="#333" icon="mdi-countertop-outline"></v-icon>
                    <span class="ms-2">عدد الاسئلة:</span>
                    <span>{{ exam.exam_question_count }}</span>
                  </div>
                  <div class="d-flex mb-2">
                    <v-icon color="#333" icon="mdi-cart-outline"></v-icon>
                    <span class="ms-2">تكلفة الاختبار:</span>
                    <span>{{ exam.points }}</span>
                    <span>نقطة</span>
                  </div>
                </div>
                <div
                  style="border: 1px solid black; border-radius: 10px"
                  class="font-weight-bold bg-white pa-5 d-flex align-center"
                >
                  <span>صفحة الاختبار</span>
                </div>
              </div>
              <hr class="mt-2 mb-1" />
              <div class="d-md-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-avatar size="35">
                    <v-img :src="userInfo.image"></v-img>
                  </v-avatar>
                  <span class="ms-3">{{ userInfo.name }}</span>
                </div>
                <div class="d-flex align-center">
                  <span>{{
                    new Date(exam.created_at).toLocaleString(["ban", "id"])
                  }}</span>
                  <span class="d-felx align-center ms-5">
                    <v-icon
                      size="small"
                      color="#555"
                      icon="mdi-vote-outline"
                    ></v-icon>
                    <span class="ms-1">{{ exam.participants }}</span>
                  </span>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <div class="text-center">
          <v-btn
            variant="tonal"
            color="black"
            v-if="currentExams.length < exmasSearch.length"
            @click="pageNumber++"
            >عرض المزيد</v-btn
          >
        </div>

        <v-alert class="ma-3" type="info" v-if="exmasSearch.length === 0"
          >لا يوجد اختبارات لعرضها</v-alert
        >
        <div class="d-md-none d-block">
          <bannar-center></bannar-center>
          <!-- <bannar-center></bannar-center> -->
        </div>
      </v-col>
      <v-col md="2" sm="0">
        <bannar-slide></bannar-slide>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" transition="dialog-top-transition" width="auto">
      <v-card elevation="4" class="text-center" max-width="300">
        <v-card-text class="text-h6">
          <v-card-title v-if="examClicked.points > 0" class="text-error text-h5"
            >سيتم خصم {{ examClicked.points }} نقطة</v-card-title
          >
          <div class="">هل أنت متأكد من اجتياز الاختبار</div>
        </v-card-text>
        <v-card-actions class="justify-center mb-3">
          <v-btn
            variant="flat"
            :loading="loadingCheckPoints"
            color="success"
            @click="checkPoints"
            >موافق</v-btn
          >
          <v-btn variant="flat" color="error" @click="dialog = false"
            >تراجع</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
          
  
    <script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";
const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();
const exams = ref();
const categoryInfo = ref();
const route = useRoute();
const router = useRouter();

const loadingCheckPoints = ref(false);
const pageNumber = ref(1);
const search = ref();
const filterSelect = ref("newest");
const userInfo = ref();
const userExamsTaken = ref();
const itemPerPage = ref(8);
const dialog = ref(false);
const examClicked = ref();
const exmasSearch = computed(() => {
  if (search.value) {
    return fillterExmas.value.filter((item: any) => {
      return item.name.toLowerCase().search(search.value.toLowerCase()) > -1;
    });
  }
  return fillterExmas.value;
});
const fillterExmas = computed(() => {
  if (filterSelect.value === "newest") {
    return exams.value.sort(function (a: any, b: any): number {
      if (a.created_at < b.created_at) return 1;
      return -1;
    });
  } else if (filterSelect.value === "oldest") {
    return exams.value.sort(function (a: any, b: any): number {
      if (a.created_at > b.created_at) return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostMember") {
    return exams.value.sort(function (a: any, b: any): number {
      if (a.participants < b.participants) return 1;
      return -1;
    });
  } else if (filterSelect.value === "leastMember") {
    return exams.value.sort(function (a: any, b: any): number {
      if (a.participants > b.participants) return 1;
      return -1;
    });
  } else if (filterSelect.value === "mostQuestion") {
    return exams.value.sort(function (a: any, b: any): number {
      if (a.exam_question_count < b.exam_question_count) return 1;
      return -1;
    });
  } else if (filterSelect.value === "leastQuestion") {
    return exams.value.sort(function (a: any, b: any): number {
      if (a.exam_question_count > b.exam_question_count) return 1;
      return -1;
    });
  }
  return exams.value;
});

const currentExams = computed(() => {
  return exmasSearch.value.slice(0, itemPerPage.value * pageNumber.value);
});

const { data, error } = await useSendRequest<responseReturn>("/exams/get", {
  slug: route.params.slug,
  user_id: authStore.token.user_id,
});
if (error.value) {
  setToastMessage("حدث خظأ ما الرجاء اعادة تحميل الصفحة");
} else {
  if (data.value?.status) {
    let dataReturend = data.value.data as any;
    categoryInfo.value = dataReturend.categoryData;
    exams.value = dataReturend.examInfo;
    userInfo.value = dataReturend.userInfo;
    userExamsTaken.value = dataReturend.userExamsTaken;
  }
}

const goToExam = (exam: any) => {
  if (!authStore.isLogin) return setToastMessage("يلزمك تسجيل الدخول أولا");
  examClicked.value = exam;
  let e = userExamsTaken.value.find((item: any) => {
    return item.exam_id == examClicked.value.id;
  });
  if (e) {
    if (e.status == "finished") return router.push("/exams/result/" + exam.id);
    return router.push("/exams/view/" + exam.id);
  }
  dialog.value = true;
};

const checkPoints = async () => {
  loadingCheckPoints.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/exams/checkUserPoints",
    {
      token: authStore.token,
      points: examClicked.value.points,
      exam_id: examClicked.value.id,
    }
  );
  dialog.value = false;

  if (error.value) {
    setToastMessage("حدث خظأ ما الرجاء اعادة تحميل الصفحة");
  } else {
    if (data.value?.status) {
      return router.push("/exams/view/" + examClicked.value.id);
    }
  }
  loadingCheckPoints.value = false;
};
useHead({
  title: "اختبارات - " + categoryInfo.value.name,
  meta: [
    {
      name: "description",
      content:
        "تحتوي هذه الصفحة على أهم الاختبارات المتعلقة بتصنيف " +
        categoryInfo.value.name,
    },
    {
      property: "og:description",
      content:
        "تحتوي هذه الصفحة على أهم الاختبارات المتعلقة بتصنيف " +
        categoryInfo.value.name,
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
          
    <style scoped>
.pointer {
  cursor: pointer;
}
</style>