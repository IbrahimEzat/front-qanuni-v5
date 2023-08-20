<template>
  <div>
    <v-alert color="error" v-if="generalError">{{ generalError }}</v-alert>

    <div>
      <v-card style="min-height: 100vh" border color="" class="pt-10" rounded elevation="2">
        <v-card-title class="text-h6 font-weight-bold text-start">
          <v-icon icon="mdi-account-voice"></v-icon> التحكم في مناقشات
          الموقع</v-card-title>
        <v-container>
          <v-btn @click="goToUrl('/admin/discussions/about')" class="my-5" color="blue-grey-darken-4">
            أضف نبذة عن القسم
          </v-btn>
          <v-row class="justify-start">
            <v-col md="6" cols="12">
              <v-text-field v-model="search" variant="outlined" clearable hide-details="auto"
                prepend-inner-icon="mdi-magnify" label="بحث" ></v-text-field>
            </v-col>
            <v-col md="6" cols="12">
              <v-select class="text-center"  item-value="value" item-title="state" label="فلترة الترتيب"
              v-model="filterSelect" :items="[
                  { state: 'الأحدث', value: 'newest' },
                  { state: 'الأقدم', value: 'oldest' },
                ]" variant="outlined">
                <template v-slot:item="{ props }">
                  <v-list-item class="text-end" v-bind="props"> </v-list-item>
                </template>
              </v-select>
            </v-col>

          </v-row>
          <v-sheet border style="overflow-x: auto">
            <v-table class="" hover >
              <thead>
                <tr>
                  <th class="text-">#</th>
                  <th class="text-">عنوان المناقشة</th>
                  <th class="text-">صاحب المناقشة</th>
                  <th class="text-">الاجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in currentShown" :key="item">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.title }}</td>
                  <td>{{ item.user.name }}</td>

                  <td>
                    <v-btn color="error" prepend-icon="mdi-delete" class="me-5" size="small"
                      @click="showDeleteDialog(item.id)">حذف</v-btn>
                    <v-btn color="primary" size="small" prepend-icon="mdi-pencil"
                      @click="goToUrl('/admin/discussions/' + item.id)">تعديل</v-btn>
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
                    <v-pagination next-icon="mdi-arrow-left-bold-circle" prev-icon="mdi-arrow-right-bold-circle"
                      rounded="circle" dir="rtl" v-model="page" class="my-4" :length="lengthPaginate"></v-pagination>
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
          هل انت متاكد من حذف هذه المناقشة
          <v-label class="text-error">سبب الحذف</v-label>
          <v-textarea dir="rtl" class="mt-2" v-model="reason_delete" variant="outlined" density="compact"></v-textarea>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="black" variant="outlined" @click="() => {
            isDeleteDialogShow = false;
            discussionWantDelete = -1;
            reason_delete = null
          }
            ">إغلاق</v-btn>
          <v-btn variant="flat" color="primary" :disabled="!reason_delete" @click="confirmDelete"
            :loading="loadingDelete">تأكيد</v-btn>
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
const { setToastMessage } = useSettingsStore();
const isDeleteDialogShow = ref(false);
const discussionWantDelete = ref();
const loadingDelete = ref(false);
const filterSelect = ref("newest");
// const statusFillter = ref();
const reason_delete = ref();
const authStore = useAuthStore();
const disscussions = ref<any>([]);

const search = ref();

const isUpdateDialogShown = ref(false);
const blogsWantUpdateId = ref(-1);

// watch(orderFillter, (newValue) => {
//   disscussions.value.reverse();
// });
function goToUrl(url:string){
  window.location.href = url;
}

const showDeleteDialog = (id: number) => {
  discussionWantDelete.value = id;
  isDeleteDialogShow.value = true;
};
const confirmDelete = async () => {
  loadingDelete.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/discussions/delete",
    {
      discussion_id: discussionWantDelete.value,
      token: authStore.token,
      reason_delete: reason_delete.value

    }
  );
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    sendAcceptNotification(data.value.data);
    isDeleteDialogShow.value = false;
    setToastMessage("تم حذف المناقشة بنجاح" as string);
    disscussions.value = disscussions.value.filter((item: any) => {
      return item.id !== discussionWantDelete.value;
    });
    discussionWantDelete.value = -1;
  } else {
    setToastMessage("حدث خطا ما" as string);
  }
  loadingDelete.value = false;
};
function sendAcceptNotification(dataNotify: any) {
  useSendRequest('/notificatoin/delete-discussion', {
    dataNotify: dataNotify
  });
}
const generalError = ref();
const page = ref(1);
const itemPerPage = ref(10);
// const filteredArray = ref<any>([]);
// const currentShown = ref<any>([]);
// const lengthPaginate = ref();

const { data, error } = await useSendRequest<responseReturn>("/admin/discussions", {
  token: authStore.token,
});
if (error.value) {
  setToastMessage(error.value.message);
} else if (data.value?.status) {
  disscussions.value = data.value.data;
  disscussions.value.reverse();
} else {
  setToastMessage(data.value?.message as string);
}

const filteredArray = computed(() => {
  if (filterSelect.value === "newest") {
    return disscussions.value.sort(function (a: any, b: any): number {
      if (a.created_at < b.created_at) return 1;
      return -1;
    });
  } else if (filterSelect.value === "oldest") {
    return disscussions.value.sort(function (a: any, b: any): number {
      if (a.created_at > b.created_at) return 1;
      return -1;
    });
  }
  // if (statusFillter.value === "active") {
  //   return disscussions.value.filter((item: any) => {
  //     return item.status === "active";
  //   });
  // } else if (statusFillter.value === "pending")
  //   return disscussions.value.filter((item: any) => {
  //     return item.status === "pending";
  //   });
  return disscussions.value;
});
const lengthPaginate = computed(() => {
  return Math.ceil(searchShown.value.length / itemPerPage.value);
});

const searchShown = computed(()=> {
  if(search.value){
    return filteredArray.value.filter((item :any)=>{
      page.value = 1;
      return item.title.toLowerCase().search(search.value.toLowerCase()) > -1;
    });
  }
  return filteredArray.value
});

const currentShown = computed(() => {
  var startIndex = (page.value - 1) * itemPerPage.value;
  var endIndex = page.value * itemPerPage.value;
  return searchShown.value.slice(startIndex, endIndex);
});
</script>
    
<style></style>