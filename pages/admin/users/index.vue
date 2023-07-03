<template>
  <div>
    <!-- <v-alert color="error" v-if="generalError">{{ generalError }}</v-alert> -->

    <div>
      <v-card
        style="min-height: 100vh"
        border
        color=""
        class="pt-10"
        rounded
        elevation="2"
      >
        <v-card-title
          class="text-h6 d-flex flex-wrap justify-space-between font-weight-bold text-start"
        >
          <div>
            <v-icon icon="mdi-account-group-outline"></v-icon> التحكم في
            مستخدمين الموقع
          </div>
          <div class="d-flex flex-wrap">
            <v-btn
              class="mb-2"
              color="primary"
              @click="showNotifyDialog"
              :disabled="selectUsers.length == 0"
              >أرسل إشعار للمستخدم</v-btn
            >
            <v-btn
              class="mx-3"
              color="success"
              @click="showAddPointDialog"
              :disabled="selectUsers.length == 0"
              >إضافة/خصم نقاط</v-btn
            >
            <v-btn
              color="black"
              @click="addBadgesDialogShown = true"
              :disabled="selectUsers.length == 0"
              >أضف أوسمة</v-btn
            >
          </div>
        </v-card-title>
        <v-container>
          <v-row class="justify-start">
            <v-col md="6" cols="12">
              <v-text-field
                v-model="search"
                variant="outlined"
                clearable
                hide-details="auto"
                prepend-inner-icon="mdi-magnify"
                label="بحث"
              ></v-text-field>
            </v-col>
            <v-col md="6" cols="12">
              <v-select
                class="text-center"
                item-value="value"
                item-title="state"
                label="فلترة الترتيب"
                v-model="filterSelect"
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
          </v-row>
          <v-sheet border style="overflow-x: auto">
            <v-table class="text-center" hover>
              <thead>
                <tr>
                  <th class="text-center">#</th>
                  <th class="text-center">اسم المستخدم</th>
                  <th class="text-center">البريد الإلكتروني</th>
                  <th class="text-center">المهنة</th>
                  <th class="text-center">الصورة الشخصية</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-show="item.type != 'admin'"
                  v-for="(item, index) in currentShown"
                  :key="item"
                >
                  <td>
                    <span
                      ><input
                        type="checkbox"
                        :value="item.id"
                        v-model="selectUsers"
                    /></span>
                    <span class="ms-3">{{ index + 1 }}</span>
                  </td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.job }}</td>
                  <td>
                    <v-img
                      class="my-2"
                      style="height: 80px; object-fit: fill"
                      :src="item.image"
                      alt=""
                    ></v-img>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <v-alert class="ma-3" type="info" v-if="currentShown.length == 0"
              >لا يوجد نتائج</v-alert
            >
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
    <v-dialog v-model="addPointsDialogShown" persistent width="400px">
      <v-card class="text-center" elevation="10">
        <v-card-title>
          <div v-if="!actionNotify">
            <p>حدد عدد النقاط المراد إضافتها/خصمها للمستخدمين</p>
            <p class="bg-error">أدخل الرقم بالسالب في حالة الخصم</p>
          </div>
          <p v-else>يمكنك إرسال إشعار للمستخدمين المحددين</p>
        </v-card-title>
        <v-card-text dir="rtl">
          <v-text-field
            v-if="!actionNotify"
            class="text-end"
            v-model="pointsToAdd"
            required
            label="عدد النقاط"
            variant="outlined"
          ></v-text-field>

          <v-text-field
            class="text-end"
            v-model="messageToSend"
            required
            label="اترك رسالتك هنا"
            variant="outlined"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="black"
            variant="outlined"
            @click="
              addPointsDialogShown = false;
              actionNotify = false;
            "
            >إغلاق</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="confirmAddPoints"
            :loading="loadingAddPoints"
            >تأكيد</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <v-dialog v-model="addPointsDialogShown" persistent width="400px">
      <v-card class="text-center" elevation="10">
        <v-card-title>
          <p>يمكنك إرسال إشعار للمستخدمين المحددين</p>
        </v-card-title>
        <v-card-text dir="rtl">
          <v-text-field
            class="text-end"
            v-model="messageToSend"
            required
            label="اترك رسالتك هنا"
            variant="outlined"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="black"
            variant="outlined"
            @click=""
            >إغلاق</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="confirmAddPoints"
            :loading="loadingAddPoints"
            >تأكيد</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <v-dialog v-model="addBadgesDialogShown" persistent width="400px">
      <v-card class="text-center" elevation="10">
        <v-card-title>
          اختر الوسام المراد إضافته للمستخدم/المستخدمين
        </v-card-title>
        <v-card-text dir="rtl">
          <v-select
            label="Select"
            variant="outlined"
            density="compact"
            v-model="badgeToAdd"
            item-title="name"
            item-value="id"
            :items="badges"
          >
            <template v-slot:item="{ props }">
              <v-list-item v-bind="props" class="text-end"></v-list-item>
            </template>
          </v-select>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="black"
            variant="outlined"
            @click="addBadgesDialogShown = false"
            >إغلاق</v-btn
          >
          <v-btn variant="flat" color="primary" @click="confirmAddBadges"
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
const addBadgesDialogShown = ref(false);
const badgeToAdd = ref();
const selectUsers = ref([]);
const pointsToAdd = ref(0);
const messageToSend = ref();
const users = ref();
const isDeleteDialogShow = ref(false);
const actionNotify = ref(false);
const serviceWantDelete = ref();
const loadingDelete = ref(false);
const itemPerPage = ref(10);
const page = ref(1);
const search = ref();
const filterSelect = ref("newest");
const addPointsDialogShown = ref(false);
const loadingAddPoints = ref(false);
const badges = ref<any>([]);

const { data: dataBadges, error: errorBadges } =
  await useSendRequest<responseReturn>("/admin/badges/getBadges", {
    token: authStore.token,
  });
if (errorBadges.value) {
  setToastMessage(errorBadges.value.message);
} else if (dataBadges.value?.status) {
  badges.value = dataBadges.value.data;
}

const filteredusers = computed(() => {
  if (filterSelect.value === "newest") {
    return users.value.sort(function (a: any, b: any): number {
      if (a.created_at < b.created_at) return 1;
      return -1;
    });
  } else if (filterSelect.value === "oldest") {
    return users.value.sort(function (a: any, b: any): number {
      if (a.created_at > b.created_at) return 1;
      return -1;
    });
  }
  return users.value;
});

const showNotifyDialog = ()=>{
  actionNotify.value = true;
  showAddPointDialog();
}

const showAddPointDialog = () => {
  addPointsDialogShown.value = true;
  pointsToAdd.value = 0;
  messageToSend.value = "";
};
const confirmAddPoints = () => {
  if(pointsToAdd.value != 0)
    setToastMessage("جار إرسال/خصم النقاط للمستخدمين المحددين");
  else
    setToastMessage("جار إرسال الإشعار للمستخدمين المحددين");
  addPointsDialogShown.value = false;
  useSendRequest("/notificatoin/admin/users/givePoints", {
    users: selectUsers.value,
    points: pointsToAdd.value,
    message: messageToSend.value,
  });
};

const confirmAddBadges = () => {
  setToastMessage("جار إرسال الأوسمة للمستخدمين المحددين");
  addBadgesDialogShown.value = false;
  useSendRequest("/notificatoin/admin/users/giveBadges", {
    users: selectUsers.value,
    badge_id: badgeToAdd.value,
  });
};

const searchShown = computed(() => {
  if (search.value) {
    return filteredusers.value.filter((item: any) => {
      page.value = 1;
      return item.name.toLowerCase().search(search.value.toLowerCase()) > -1;
    });
  }
  return filteredusers.value;
});

const lengthPaginate = computed(() => {
  return Math.ceil(searchShown.value.length / itemPerPage.value);
});

const currentShown = computed(() => {
  var startIndex = (page.value - 1) * itemPerPage.value;
  var endIndex = page.value * itemPerPage.value;
  return searchShown.value.slice(startIndex, endIndex);
});

const { data, error } = await useSendRequest<responseReturn>(
  "/arrangementUsers",
  { token: authStore.token }
);
if (error.value) {
  setToastMessage("حدث خطأ ما");
} else if (data.value?.status) {
  users.value = data.value.data;
} else {
  setToastMessage("حدث خطأ ما");
}

const showDeleteDialog = (id: number) => {
  serviceWantDelete.value = id;
  isDeleteDialogShow.value = true;
};

const confirmDelete = async () => {
  loadingDelete.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/users/delete",
    {
      service_id: serviceWantDelete.value,
      token: authStore.token,
    }
  );
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    isDeleteDialogShow.value = false;
    setToastMessage("تم حذف الخدمة بنجاح" as string);
    users.value = users.value.filter((item: any) => {
      return item.id !== serviceWantDelete.value;
    });
    serviceWantDelete.value = -1;
  } else {
    setToastMessage("حدث خطا ما" as string);
  }
  loadingDelete.value = false;
};
</script>
    
<style></style>