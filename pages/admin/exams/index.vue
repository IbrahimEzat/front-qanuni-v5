<template>
  <div>
    <div>
      <v-card
        style="min-height: 100vh"
        border
        color=""
        class="pt-10"
        rounded
        elevation="2"
      >
        <v-card-title class="d-flex justify-space-between">
          <div class="text-h6 font-weight-bold">
            <v-icon icon="mdi-help-box-multiple-outline"></v-icon> التحكم في
            اختبارات الموقع
          </div>
          <v-btn @click="isAddExamDialogShow = true" append-icon="mdi-plus" color="success">أَضف اختبار</v-btn>
        </v-card-title>
        <v-container>
          <v-text-field
            class="mb-5"
            v-model="search"
            variant="outlined"
            clearable
            hide-details="auto"
            prepend-inner-icon="mdi-magnify"
            label="بحث"
          ></v-text-field>
          <v-row class="justify-start">
            <v-col md="6" cols="12">
              <v-select
                class="text-center"
                item-value="value"
                item-title="state"
                label="فلترة الترتيب"
                v-model="orderFillter"
                :items="[
                  { state: 'الاحدث', value: 'newest' },
                  { state: 'الاقدم', value: 'oldest' },
                  { state: 'الاكثر مشتركين', value: 'moreSubscribe' },
                  { state: 'الاكثر مدة', value: 'moreTime' },
                  { state: 'الاقل مدة', value: 'lessTime' },
                ]"
                variant="outlined"
              >
                <template v-slot:item="{ props }">
                  <v-list-item class="text-end" v-bind="props"> </v-list-item>
                </template>
              </v-select>
            </v-col>
            <v-col md="6" cols="12">
              <v-select
                class="text-center"
                clearable
                v-model="statusFillter"
                item-value="value"
                item-title="state"
                label="فلترة الحالة"
                :items="[
                  { state: 'تم نشرها', value: 'active' },
                  { state: 'قيد الانتظار', value: 'pending' },
                ]"
                variant="outlined"
              >
                <template v-slot:item="{ props }">
                  <v-list-item class="text-end" v-bind="props"> </v-list-item>
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-sheet border style="overflow-x: auto">
            <v-table class="" hover>
              <thead>
                <tr>
                  <th class="">#</th>
                  <th class="">اسم الاختبار</th>
                  <th class="">المدة</th>
                  <th class="">عدد المشتركين</th>
                  <th class="">الحالة</th>
                  <th class="text-center">الاجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in currentShown" :key="item">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td><time-convert :minute="item.duration"/></td>
                  <td>{{ item.participants }}</td>
                  <td>
                    <span
                      class="font-weight-medium text-green"
                      v-if="item.status == 'active'"
                    >
                      تم النشر
                    </span>
                    <span v-else class="font-weight-medium text-orange"
                      >قيد الانتظار</span
                    >
                  </td>
                  <td>
                    <v-btn
                      color="error"
                      prepend-icon="mdi-delete"
                      class="me-4"
                      size="small"
                      @click="showDeleteDialog(item.id)"
                      >حذف</v-btn
                    >
                    <v-btn
                      color="primary"
                      size="small"
                      prepend-icon="mdi-pencil"
                      @click="$router.push('/admin/exams/' + item.id)"
                      >تعديل</v-btn
                    >
                  </td>
                </tr>
              </tbody>
            </v-table>
            <v-alert class="ma-3" type="info" v-if="currentShown.length == 0"
              >لا يوجد نتائج
            </v-alert>
          </v-sheet>
          <div class="text-center" v-if="lengthPaginate > 1">
            <v-container>
              <v-row justify="center">
                <v-col cols="8">
                  <v-container class="max-width">
                    <v-pagination
                      next-icon="mdi-arrow-left-bold-circle"
                      prev-icon="mdi-arrow-right-bold-circle"
                      rounded="circle"
                      dir="rtl"
                      v-model="page"
                      class="my-4"
                      :length="lengthPaginate"
                    ></v-pagination>
                  </v-container>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-container>
      </v-card>
    </div>
    <v-dialog v-model="isDeleteDialogShow" persistent width="300px">
      <v-card elevation="10">
        <v-card-text class="text-end">
          هل انت متاكد من حذف هذا الاختبار
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="black"
            variant="outlined"
            @click="
              () => {
                isDeleteDialogShow = false;
                examWantDelete = -1;
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
    <v-dialog v-model="isAddExamDialogShow" persistent width="300px">
      <v-card elevation="10">
        <v-card-title class="text-end"> أضف اختبارا جديدا </v-card-title>
        <v-card-text dir="rtl">
          <v-text-field
            class="mt-3"
            label="اسم الاختبار"
            variant="outlined"
            v-model="examName"
          ></v-text-field>
          <v-text-field
            class="mt-3"
            label="مدة الاختبار بالدقيقة"
            variant="outlined"
            v-model="examDuration"
          ></v-text-field>
          <v-text-field
            class="mt-3"
            label="نقاط الاختبار"
            variant="outlined"
            v-model="examPoints"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="black"
            variant="outlined"
            @click="clearAddExam"
            >إغلاق</v-btn>
          <v-btn
            variant="flat"
            color="primary"
            @click="confirmAddExam"
            :loading="loadingAddExam"
            :disabled="!examName"
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
definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "is-admin"],
});

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();
const exams = ref();
const orderFillter = ref("newest");
const statusFillter = ref();
const itemPerPage = ref(10);
const page = ref(1);
const search = ref();

const examWantDelete = ref();
const isDeleteDialogShow = ref(false);
const loadingDelete = ref(false);
const isAddExamDialogShow = ref(false);
const loadingAddExam = ref(false);

const examName = ref("");
const examDuration = ref(30);
const examPoints = ref(0);

const { data, error } = await useSendRequest<responseReturn>(
  "/admin/exams/get",
  { token: authStore.token }
);

if (error.value) {
  setToastMessage(error.value.message);
} else if (data.value?.status) {
  exams.value = data.value.data;
} else {
  setToastMessage(data.value?.message as string);
}

const filteredArray = computed(() => {
  if (statusFillter.value === "active") {
    return exams.value.filter((item: any) => {
      return item.status === "active";
    });
  } else if (statusFillter.value === "pending")
    return exams.value.filter((item: any) => {
      return item.status === "pending";
    });
  return exams.value;
});

const filteredExams = computed(() => {
  if (orderFillter.value === "newest") {
    return filteredArray.value.sort(function (a: any, b: any): number {
      if (a.created_at < b.created_at) return 1;
      return -1;
    });
  } else if (orderFillter.value === "oldest") {
    return filteredArray.value.sort(function (a: any, b: any): number {
      if (a.created_at > b.created_at) return 1;
      return -1;
    });
  }
  else if (orderFillter.value === "moreTime") {
    return filteredArray.value.sort(function (a: any, b: any): number {
      if (a.duration < b.duration) return 1;
      return -1;
    });
  }else if (orderFillter.value === "lessTime") {
    return filteredArray.value.sort(function (a: any, b: any): number {
      if (a.duration > b.duration) return 1;
      return -1;
    });
  }else if (orderFillter.value === "moreSubscribe") {
    return filteredArray.value.sort(function (a: any, b: any): number {
      if (a.participants < b.participants) return 1;
      return -1;
    });
  }
  return filteredArray.value;
});

const lengthPaginate = computed(() => {
  return Math.ceil(searchShown.value.length / itemPerPage.value);
});

const searchShown = computed(() => {
  if (search.value) {
    return filteredExams.value.filter((item: any) => {
      page.value = 1;
      return item.name.toLowerCase().search(search.value.toLowerCase()) > -1;
    });
  }
  return filteredExams.value;
});

const currentShown = computed(() => {
  var startIndex = (page.value - 1) * itemPerPage.value;
  var endIndex = page.value * itemPerPage.value;
  return searchShown.value.slice(startIndex, endIndex);
});

const showDeleteDialog = (id: number) => {
  examWantDelete.value = id;
  isDeleteDialogShow.value = true;
};

const confirmDelete = async () => {
  loadingDelete.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/exams/delete",
    {
      id: examWantDelete.value,
      token: authStore.token,
    }
  );
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    isDeleteDialogShow.value = false;
    setToastMessage("تم حذف الاختبار بنجاح");
    exams.value = exams.value.filter((item: any) => {
      return item.id !== examWantDelete.value;
    });
    examWantDelete.value = -1;
  } else {
    setToastMessage("حدث خطا ما" as string);
  }
  loadingDelete.value = false;
};

const clearAddExam = ()=>{
  examName.value = '';
  examDuration.value = 30;
  examPoints.value = 0;
  isAddExamDialogShow.value = false;
}
const confirmAddExam = async () => {
  loadingAddExam.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/exams/add",
    {
      token: authStore.token,
      name:examName.value,
      duration:examDuration.value,
      points:examPoints.value
    }
  );
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    setToastMessage("تم اضافة الاختبار بنجاح");
    exams.value.push(data.value.data);
    clearAddExam();
  } else {
    setToastMessage("حدث خطا ما");
  }
  loadingAddExam.value = false;
};
</script>
      
  <style></style>
  