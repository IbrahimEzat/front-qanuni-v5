<template>
  <div>
    <v-btn color="black my-5" @click="showCreateDialog" prepend-icon="mdi-plus"
      >أضف وساما جديد</v-btn
    >

    <div>
      <v-sheet border color="" rounded elevation="2">
        <v-table hover>
          <thead>
            <tr>
              <th class="text-">#</th>
              <th class="text-">اسم الوسام</th>
              <th class="text-">صورة الوسام</th>
              <th class="text-">الاجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in badges" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td>
                <v-img
                  class="my-2"
                  :src="item.image"
                  style="max-width: 100px; max-height: 100px"
                ></v-img>
              </td>
              <td>
                <v-btn
                  @click="showDeleteDialog(item.id)"
                  color="error"
                  prepend-icon="mdi-delete"
                  class="me-5"
                  >حذف</v-btn
                >
                <v-btn
                  @click="showUpdateDialog(item)"
                  color="primary"
                  prepend-icon="mdi-pencil"
                  >تعديل</v-btn
                >
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-alert
          v-if="badges.length == 0"
          type="info"
          text="لا يوجد أوسمة فالموقع"
        ></v-alert>
      </v-sheet>
    </div>

    <v-dialog persistent v-model="deleteDialogShown" width="300px">
      <v-card elevation="10">
        <v-card-text class="text-end">
          هل انت متاكد من حذف هذا الوسام
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="black"
            variant="outlined"
            @click="deleteDialogShown = false"
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

    <v-dialog persistent v-model="createDialogShown" width="400px">
      <v-card dir="rtl" class="text-center" elevation="10">
        <v-card-title class="my-5 text-h4">
          <span v-if="!badgeWantUpdate">إضافة وسام جديد للموقع</span>
          <span v-else>تعديل بيانات الوسام</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="badgeName"
            required
            label="اسم الوسام"
            variant="outlined"
          ></v-text-field>
          <v-file-input
            label="صورة الوسام"
            variant="outlined"
            chips
            clearable
            @change="uploadFile"
          ></v-file-input>
          <v-img
            class="my-2"
            v-if="previewImage"
            :src="previewImage"
            style="max-width: 100px; max-height: 100px"
          ></v-img>
        </v-card-text>
        <v-card-actions class="justify-start">
          <v-btn
            color="black"
            variant="outlined"
            @click="createDialogShown = false"
            >إغلاق</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="addBadge"
            :loading="loadingSaveData"
            >تأكيد</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
    
  <script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { responseReturn, tokenType } from "~/types/tpes";
import { useSettingsStore } from "~/stores/useSettings";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "is-admin"],
});
const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();
const createDialogShown = ref(false);
const deleteDialogShown = ref(false);
const badgeIdWantDelete = ref(-1);
const badgeWantUpdate = ref();
const badges = ref<any>([]);
const badgeName = ref("");
const badgeImage = ref("");
const loadingDelete = ref(false);
const loadingSaveData = ref(false);

const { data, error } = await useSendRequest<responseReturn>(
  "/admin/badges/getBadges",
  {
    token: authStore.token,
  }
);
if (error.value) setToastMessage(error.value.message);
else if (data.value?.status) {
  badges.value = data.value.data;
}

const showCreateDialog = () => {
  createDialogShown.value = true;
  badgeName.value = "";
  badgeImage.value = "";
  badgeWantUpdate.value = "";
};

const showDeleteDialog = (id: any) => {
  badgeIdWantDelete.value = id;
  deleteDialogShown.value = true;
};

const previewImage = computed(() => {
  return badgeImage.value
    ? URL.createObjectURL(badgeImage.value as any)
    : badgeWantUpdate.value
    ? badgeWantUpdate.value.image
    : "";
});
const confirmDelete = async () => {
  loadingDelete.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/badges/delete",
    {
      token: authStore.token,
      badge_id: badgeIdWantDelete.value,
    }
  );
  loadingDelete.value = false;

  if (error.value) setToastMessage(error.value.message);
  else if (data.value?.status) {
    badges.value = badges.value.filter((item: any) => {
      return item.id != badgeIdWantDelete.value;
    });
    badgeIdWantDelete.value = -1;
    deleteDialogShown.value = false;
  }
  setToastMessage(data.value?.message as string);
};

const showUpdateDialog = (item: any) => {
  badgeWantUpdate.value = item;
  badgeName.value = item.name;
  createDialogShown.value = true;
};

const uploadFile = (e: any) => {
  badgeImage.value = e.target.files[0];
};

const updateBadge = async () => {
  loadingSaveData.value = true;
  const formData = new FormData();
  formData.append("name", badgeName.value);
  formData.append("image", badgeImage.value);
  formData.append("token", JSON.stringify(authStore.token));
  formData.append("badge_id", badgeWantUpdate.value.id);
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/badges/update",
    formData
  );
  loadingSaveData.value = false;

  if (error.value) setToastMessage(error.value.message);
  else if (data.value?.status) {
    badgeWantUpdate.value.name = badgeName.value;
    badgeWantUpdate.value.image = data.value.data.image;
    badgeName.value = "";
    badgeImage.value = "";
    badgeWantUpdate.value = "";
    createDialogShown.value = false;
  }
  setToastMessage(data.value?.message as string);
};
const addBadge = async () => {
  if (badgeWantUpdate.value) {
    updateBadge();
    return;
  }
  loadingSaveData.value = true;
  const formData = new FormData();
  formData.append("name", badgeName.value);
  formData.append("image", badgeImage.value);
  formData.append("token", JSON.stringify(authStore.token));

  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/badges/add",
    formData
  );
  loadingSaveData.value = false;

  if (error.value) setToastMessage(error.value.message);
  else if (data.value?.status) {
    badgeName.value = "";
    badgeImage.value = "";
    badges.value.push(data.value.data);
    createDialogShown.value = false;
  }
  setToastMessage(data.value?.message as string);
};
</script>
    
  <style></style>