<template>
  <div>

    <div>

      <v-card style="min-height: 100vh" border color="" class="pt-10" rounded elevation="2">
        <v-card-title class="text-h6 font-weight-bold text-start">
          <v-icon icon="mdi-post-outline"></v-icon> التحكم في مسابقات
          الموقع</v-card-title>
        <v-container>
          <v-btn @click="goToUrl('/admin/competition/about')" class="my-5" color="blue-grey-darken-4">
            أضف نبذة عن القسم
          </v-btn>

          <v-text-field class="mb-5" v-model="search" variant="outlined" clearable hide-details="auto"
            prepend-inner-icon="mdi-magnify" label="بحث"></v-text-field>


          <v-row class="justify-start mb-3">
            <v-col md="6" cols="12">
              <v-select class="text-center" item-value="value" item-title="state" label="فلترة الترتيب"
                v-model="orderFillter" :items="[
                  { state: 'الأحدث', value: 'newest' },
                  { state: 'الأقدم', value: 'oldest' },
                ]" variant="outlined">
                <template v-slot:item="{ props }">
                  <v-list-item class="text-end" v-bind="props"> </v-list-item>
                </template>
              </v-select>
            </v-col>
            <v-col md="6" cols="12">
              <v-select class="text-center" clearable item-value="value" item-title="state" label="فلترة الحالة"
                v-model="statusFillter" :items="[
                  { state: 'نشطة', value: 'active' },
                  { state: 'مغلقة', value: 'finished' },
                ]" variant="outlined">
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
                  <th class="text-" style="max-width: 50% !important;">عنوان المسابقة</th>
                  <th class="text-" style="width: 20% !important;">الحالة</th>
                  <th class="text-" style="width: 20% !important;">عدد المشاركين</th>
                  <th class="text-" style="width: 30% !important;">الاجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in currentShown" :key="index">
                  <td> {{ index + 1 }} </td>
                  <td> {{ item.title }}</td>


                  <td> {{ item.status > 0 ? "نشطة" : "منتهية" }}</td>
                  <td>{{ item.competition_answers_count }}</td>
                  <td>
                    <v-btn color="error" prepend-icon="mdi-delete" class="me-5" size="small"
                      @click="showDeleteDialog(item.id)">حذف</v-btn>
                    <v-btn color="primary" size="small" prepend-icon="mdi-pencil"
                      @click="$router.push('/admin/competition/' + item.id)">تعديل</v-btn>


                  </td>
                </tr>
              </tbody>
            </v-table>
            <!-- <v-alert class="ma-3" type="info" v-if="currentShown.length == 0">لا يوجد نتائج 
             </v-alert> -->

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
          هل انت متاكد من حذف هذه المسابقة
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn color="black" variant="outlined" @click="() => {
              isDeleteDialogShow = false;
              competitionWantDelete = -1;
            }
            ">إغلاق</v-btn>
          <v-btn variant="flat" color="primary" @click="confirmDelete"
            :loading="loadingDelete">تأكيد</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
  
<script setup >
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "is-admin"],
});
const { setToastMessage } = useSettingsStore();
const isDeleteDialogShow = ref(false);
const loadingDelete = ref(false);
const orderFillter = ref("newest");
const statusFillter = ref();
const authStore = useAuthStore();
const competition = ref();
const isUpdateDialogShown = ref(false);
const competitionWantDelete = ref(-1);
const search = ref();

// watch(orderFillter, (newValue) => {
//   blogs.value.reverse();
// });

const showDeleteDialog = (id) => {
  competitionWantDelete.value = id;
  isDeleteDialogShow.value = true;
};

const page = ref(1);
const itemPerPage = ref(3);
// const filteredArray = ref<any>([]);
// const currentShown = ref<any>([]);
// const lengthPaginate = ref();

const { data, error } = await useSendRequest("/admin/competitions/list", {
  token: authStore.token,
});
if (error.value) {
  setToastMessage('حدث خظا ما');
} else if (data.value?.status) {
  competition.value = data.value.data;
} else {
  setToastMessage(data.value?.message);
}

const filteredArray = computed(() => {
  if (statusFillter.value == "active") {
    return competition.value.filter((item) => {
      return item.status > 0;
    });
  } else if (statusFillter.value == "finished")
    return competition.value.filter((item) => {
      return item.status <= 0;
    });
  return competition.value;
});


const filteredCompetition = computed(() => {
  if (orderFillter.value == "newest") {
    return filteredArray.value.sort(function (a, b) {
      if (a.created_at < b.created_at) return 1;
      return -1;
    });
  }
  else if (orderFillter.value === "oldest") {
    return filteredArray.value.sort(function (a, b) {
      if (a.created_at > b.created_at) return 1;
      return -1;
    });
  }
  return competition.value;
});
const lengthPaginate = computed(() => {
  return Math.ceil(searchShown.value.length / itemPerPage.value);
});

const searchShown = computed(() => {
  if (search.value) {
    return filteredCompetition.value.filter((item) => {
      page.value = 1;
      return item.title.toLowerCase().search(search.value.toLowerCase()) > -1;
    });
  }
  return filteredCompetition.value
});

const currentShown = computed(() => {
  var startIndex = (page.value - 1) * itemPerPage.value;
  var endIndex = page.value * itemPerPage.value;
  return searchShown.value.slice(startIndex, endIndex);
});


async function confirmDelete(){
  const { data , error} = await useSendRequest('/admin/competitions/delete',{
    token : authStore.token,
    competition_id : competitionWantDelete.value 
  });
  if(error.value){
    setToastMessage('حدث خظا ما');
  }else if(data.value.status){
    competition.value = competition.value.filter((item)=>{
      return item.id != competitionWantDelete.value
    })
    isDeleteDialogShow.value = false
    setToastMessage('تم حذف المسابقة بنجاح');
  }
}

function goToUrl(url) {
  window.location.href = url;
}
</script>
  
<style></style>
