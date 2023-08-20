<template>
  <div>
    <v-btn style="margin: 20px;" color="black my-5" @click="$router.push('/admin/topics/add')"
      prepend-icon="mdi-plus">أضف
      تصنيف</v-btn>
    <div>
      <v-sheet border color="" rounded elevation="2">
        <v-table hover>
          <thead>
            <tr>
              <th class="text-">#</th>
              <th class="text-">اسم التصنيف</th>
              <th class="text-">صورة التصنيف</th>
              <th class="text-">القسم</th>
              <th class="text-">الاجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in topics" :key="item.name">
              <td>{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td>
                <v-img :src="item.image"></v-img>
              </td>
              <td>{{ item.type }}</td>
              <td>
                <v-btn @click="showDeleteDialog(item.slug)" color="error" prepend-icon="mdi-delete"
                  class="me-5">حذف</v-btn>
                <v-btn @click="$router.push('/admin/topics/'+item.slug)" color="primary" prepend-icon="mdi-pencil">تعديل</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-alert v-if="topics.length == 0" type="info" text="لا يوجد تصنيفات فالموقع"></v-alert>
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

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();


const loadingDelete = ref(false);
const deleteDialog = ref(false);
const topicWantDelete = ref();
const topics = ref();

const { data, error } = await useSendRequest<responseReturn>(
  "/admin/topic/all",
  { token: authStore.token }
);
if (error.value) {
  setToastMessage('حدث خطأ ما')
} else {
  if (data.value?.status) {
    topics.value = data.value.data;
  }
}

function showDeleteDialog(slug: any) {
  topicWantDelete.value = slug;
  deleteDialog.value = true;
}

async function confirmDelete() {
  loadingDelete.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/topics/delete",
    { slug: topicWantDelete.value, token: authStore.token }
  );
  if (error.value) {
    setToastMessage('حدث خطأ ما')
  } else if (data.value?.status) {
    //snackbar
    topics.value = topics.value.filter((item: any) => {
      return item.slug !== topicWantDelete.value;
    });
    deleteDialog.value = false;
  } else {
    setToastMessage('حدث خطأ ما')
  }
  loadingDelete.value = false;
}

</script>
  
<style></style>