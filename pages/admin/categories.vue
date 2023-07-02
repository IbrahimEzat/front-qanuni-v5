<template>
  <div>
    <v-btn color="black my-5" @click="showCreateDialog" prepend-icon="mdi-plus">أضف تصنيف جديد</v-btn>
    <v-card v-show="dialog || updateDialog" class="pa-5 mx-auto" elevation="5" color="" border rounded>
      <v-card-title>
        <span v-if="updateDialog"> تعديل التصنيف </span>
        <span v-else> أضف تصنيف جديد </span>
      </v-card-title>
      <v-form @submit.prevent>
        <p class="text-error" v-if="errorMessages.name">
          {{ errorMessages.name[0] }}
        </p>
        <v-text-field v-model="category" required label="اسم التصنيف" variant="outlined"></v-text-field>
        <v-row>
          <v-col lg="6" cols="12">
            <v-label>لون الخط</v-label>
            <v-color-picker v-model="fontColorCategory" show-swatches hide-sliders></v-color-picker>
          </v-col>
          <v-col lg="6" cols="12">
            <v-label>لون خلفية التصنيف</v-label>
            <v-color-picker v-model="backgroundCategory" show-swatches hide-sliders></v-color-picker>
          </v-col>
        </v-row>
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="error" @click="() => {
            dialog = false;
            updateDialog = false;
          }
          ">إغلاق</v-btn>
        <v-btn variant="flat" color="green" :loading="loadingCreate" @click="createCategory"><span
            v-if="catWantUpdateSlug">تحديث</span><span v-else>إنشاء</span></v-btn>
      </v-card-actions>
    </v-card>
    <div v-show="!dialog && !updateDialog">
      <v-sheet border color="" rounded elevation="2">
        <v-table hover>
          <thead>
            <tr>
              <th class="text-">#</th>
              <th class="text-">اسم التصنيف</th>
              <th class="text-">الاجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in categories" :key="item.name">
              <td>{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td>
                <v-btn @click="showDeleteDialog(item.slug)" color="error" prepend-icon="mdi-delete"
                  class="me-5">حذف</v-btn>
                <v-btn @click="showUpdateCard(item.slug)" color="primary" prepend-icon="mdi-pencil">تعديل</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-alert v-if="categories.length == 0" type="info" text="لا يوجد تصنيفات فالموقع"></v-alert>
      </v-sheet>
    </div>

    <v-dialog persistent v-model="deleteDialog" width="300px">
      <v-card elevation="10">
        <v-card-text class="text-end">
          هل انت متاكد من حذف هذا التصنيف
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="black" variant="outlined" @click="() => {
              deleteDialog = false;
              catWantDeleteSlug = '';
            }
            ">إغلاق</v-btn>
          <v-btn variant="flat" color="primary" @click="confirmDelete" :loading="loadingDelete">تأكيد</v-btn>
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
const backgroundCategory = ref("#fdf8ef");
const fontColorCategory = ref("#000");
const loadingCreate = ref(false);
const loadingDelete = ref(false);
const loadingUpdate = ref(false);
const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();


const dialog = ref(false);
const category = ref();
const catWantDeleteSlug = ref();
const catWantUpdateSlug = ref();
const deleteDialog = ref(false);
const updateDialog = ref(false);

const errorMessages = reactive({
  name: [] as string[],
});

const categories = ref<{ name: string } | any>([]);
const { data, error } = await useSendRequest<responseReturn>(
  "/admin/categories",
  { token: authStore.token }
);
if (error.value) {
  setToastMessage('حدث خطأ ما')
} else {
  if (data.value?.status) {
    categories.value = data.value.data;
  }
}

function showCreateDialog() {
  dialog.value = true;
  category.value = "";
  updateDialog.value = false;
  catWantUpdateSlug.value = "";
  backgroundCategory.value = "#fdf8ef";
  fontColorCategory.value = "#000";
}

function showDeleteDialog(slug: string) {
  catWantDeleteSlug.value = slug;
  deleteDialog.value = true;
}
function showUpdateCard(slug: string) {
  catWantUpdateSlug.value = slug;
  const obj = categories.value.find((item: any) => {
    return item.slug === catWantUpdateSlug.value;
  });
  category.value = obj.name;
  backgroundCategory.value = obj.background;
  fontColorCategory.value = obj.color;
  updateDialog.value = true;
}

async function confirmDelete() {
  loadingDelete.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/categories/delete",
    { slug: catWantDeleteSlug.value, token: authStore.token }
  );
  if (error.value) {
    setToastMessage('حدث خطأ ما')
  } else if (data.value?.status) {
    //snackbar
    categories.value = categories.value.filter((item: any) => {
      return item.slug !== catWantDeleteSlug.value;
    });
    deleteDialog.value = false;
  } else {
    const arr = data.value?.errors || [];
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i] as { filed_name: string; message: string[] };
      if (obj.filed_name === "name") {
        errorMessages.name = obj.message;
      }
    }
  }
  loadingDelete.value = false;
}

async function createCategory() {
  loadingCreate.value = true;
  let url = "/admin/categories/add";
  let payload = {
    name: category.value,
    color: fontColorCategory.value,
    background: backgroundCategory.value,
    token: authStore.token

  } as { name: string; slug: string; color: string; background: string, token: tokenType };
  if (catWantUpdateSlug.value) {
    url = "/admin/categories/update";
    payload = {
      name: category.value,
      slug: catWantUpdateSlug.value,
      color: fontColorCategory.value,
      background: backgroundCategory.value,
      token: authStore.token
    };
  }
  const { data, error } = await useSendRequest<responseReturn>(url, payload);
  if (error.value) {
    setToastMessage('حدث خطأ ما')
  } else if (data.value?.status) {
    //snackbar
    if (!catWantUpdateSlug.value) categories.value.push(data.value.data);
    else {
      let obj = categories.value.find((item: any) => {
        return item.slug === catWantUpdateSlug.value;
      });
      const dt = data.value.data as {
        name: string;
        slug: string;
        color: string;
        background: string;
      };
      obj.name = dt.name;
      obj.slug = dt.slug;
      obj.color = dt.color;
      obj.background = dt.background;
    }
    category.value = "";
    catWantUpdateSlug.value = "";
    updateDialog.value = false;
    dialog.value = false;
  } else {
    const arr = data.value?.errors || [];
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i] as { filed_name: string; message: string[] };
      if (obj.filed_name === "name") {
        errorMessages.name = obj.message;
      }
    }
  }
  loadingCreate.value = false;
}
</script>
  
<style></style>