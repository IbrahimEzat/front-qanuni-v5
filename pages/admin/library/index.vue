<template>
  <div>
    <v-alert color="error" v-if="generalError">{{ generalError }}</v-alert>

    <div>
      <v-card
        style="min-height: 100vh"
        border
        color=""
        class="pt-10"
        rounded
        elevation="2"
      >
        <v-card-title class="text-h6 font-weight-bold text-start">
          <v-icon icon="mdi-library"></v-icon> التحكم في مكتبات
          الموقع</v-card-title
        >
        <v-container>
          <v-btn @click="goToUrl('/admin/library/about')" class="my-5" color="blue-grey-darken-4">
            أضف نبذة عن القسم
          </v-btn>
          <v-text-field class="mb-5" v-model="search" variant="outlined" clearable hide-details="auto"
                prepend-inner-icon="mdi-magnify" label="بحث" ></v-text-field>
          <v-row class="justify-start">
            <v-col md="6" cols="12">
              <v-select
                class="text-center"
                item-value="value"
                item-title="state"
                label="فلترة الترتيب"
                v-model="orderFillter"
                :items="[
                  { state: 'الأحدث', value: 'newest' },
                  { state: 'الأقدم', value: 'oldest' },
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
                  <th class="text-">#</th>
                  <th class="text-">اسم المكتبة</th>
                  <!-- <th class="text-">المستخدم الذي رفعها</th>
                  <th class="text-">المؤلف</th> -->
                  <th class="text-">الحالة</th>
                  <th class="text-center">الاجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in currentShown" :key="item">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.file_name }}</td>
                  <!-- <td>{{ item.user.name }}</td>
                  <td>{{ item.author_name }}</td> -->
                 
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
                      @click="$router.push('/admin/library/' + item.id)"
                      >تعديل</v-btn
                    >
                  </td>
                </tr>
              </tbody>
            </v-table>
          <v-alert class="ma-3" type="info" v-if="currentShown.length == 0">لا يوجد نتائج  </v-alert>
                      
           
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
              <!-- <div>{{ page }}</div> -->
            </v-container>
          </div>
        </v-container>
      </v-card>
    </div>
    <v-dialog v-model="isDeleteDialogShow" persistent width="300px">
      <v-card elevation="10">
        <v-card-text class="text-end">
          هل انت متاكد من حذف هذه المكتبة
          <v-label class="text-error">سبب الحذف</v-label>
          <v-textarea
            dir="rtl"
            class="mt-2"
            v-model="reason_delete"
            variant="outlined"
            density="compact"
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="black"
            variant="outlined"
            @click="
              () => {
                isDeleteDialogShow = false;
                libraryWantDelete = -1;
                reason_delete = null;
              }
            "
            >إغلاق</v-btn
          >
          <v-btn
            :disabled="!reason_delete"
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
definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "is-admin"],
});

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();
const libraries = ref();
const orderFillter = ref("newest");
const statusFillter = ref();
const itemPerPage = ref(10);
const page = ref(1);
const search = ref();

const libraryWantDelete = ref();
const isDeleteDialogShow = ref(false);
const loadingDelete = ref(false);
const reason_delete = ref();
const generalError = ref();

// watch(orderFillter, (val: any) => {
//   libraries.value.reverse();
// });

const { data, error } = await useSendRequest<responseReturn>(
  "/admin/library/getLibraries",
  { token: authStore.token }
);

if (error.value) {
  setToastMessage(error.value.message);
} else if (data.value?.status) {
  libraries.value = data.value.data;
} else {
  setToastMessage(data.value?.message as string);
}

const filteredArray = computed(() => {
  if (statusFillter.value === "active") {
    return libraries.value.filter((item: any) => {
      return item.status === "active";
    });
  } else if (statusFillter.value === "pending")
    return libraries.value.filter((item: any) => {
      return item.status === "pending";
    });
  return libraries.value;
});

const filteredFiles= computed(() => {
  if (orderFillter.value === "newest") {
    return filteredArray.value.sort(function (a: any, b: any): number {
      if (a.created_at < b.created_at) return 1;
      return -1;
    });
  }
  else if (orderFillter.value === "oldest") {
    return filteredArray.value.sort(function (a: any, b: any): number {
      if (a.created_at > b.created_at) return 1;
      return -1;
    });
  } 
  return filteredArray.value;
});

const lengthPaginate = computed(() => {
  return Math.ceil(searchShown.value.length / itemPerPage.value);
});

const searchShown = computed(()=> {
  if(search.value){
    return filteredFiles.value.filter((item :any)=>{
      page.value = 1;
      return item.file_name.toLowerCase().search(search.value.toLowerCase()) > -1;
    });
  }
  return filteredFiles.value
});

const currentShown = computed(() => {
  var startIndex = (page.value - 1) * itemPerPage.value;
  var endIndex = page.value * itemPerPage.value;
  return searchShown.value.slice(startIndex, endIndex);
});

const showDeleteDialog = (id: number) => {
  libraryWantDelete.value = id;
  isDeleteDialogShow.value = true;
};

const confirmDelete = async () => {
  loadingDelete.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/library/delete",
    {
      library_id: libraryWantDelete.value,
      token: authStore.token,
      reason_delete:reason_delete.value
    }
  );
  reason_delete.value = "";
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    isDeleteDialogShow.value = false;
    setToastMessage("تم حذف المكتبة بنجاح" as string);
    libraries.value = libraries.value.filter((item: any) => {
      return item.id !== libraryWantDelete.value;
    });
    libraryWantDelete.value = -1;
    sendDeleteNotification(data.value.data);
  } else {
    setToastMessage("حدث خطا ما" as string);
  }
  loadingDelete.value = false;
};
async function sendDeleteNotification(dataNotify: any) {
  useSendRequest("/notificatoin/delete-file", {
    dataNotify: dataNotify,
    reason_delete: reason_delete.value,
  });
}

function goToUrl(url: string) {
  window.location.href = url;
}
</script>
    
<style></style>
