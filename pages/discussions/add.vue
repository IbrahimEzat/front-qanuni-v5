<template>
  <div class="bg-blue-grey-lighten-5">
    <v-row style="min-height: 800px">
      <v-col cols="2" class="ma-0">
        <!-- <bannar-slide></bannar-slide> -->
      </v-col>
      <v-col
        class="bg-white mt-sm-8 my-8 pa-0 mx-auto"
        md="8"
        sm="11"
        cols="11"
      >
        <div style="background-color: #fdf8ef; width: 100%">
          <p class="font-weight-bold pa-4">
            <nuxt-link to="/discussions">مناقشات</nuxt-link>/افتح مناقشة
          </p>
        </div>
        <bannar-center></bannar-center>

        <div
          class="ma-3 pa-5"
          style="width: 97.5%; border: 2px solid #000; border-radius: 20px"
        >
          <div>
            <p class="text-h6">عنوان المناقشة :</p>
            <p class="text-error" v-if="errorMessages.title">
              {{ errorMessages.title[0] }}
            </p>
            <input
              v-model="title"
              class="px-3 py-1 mb-5"
              style="width: 100%; border: 1px solid #000; border-radius: 10px"
              type="text"
            />
          </div>
          <div>
            <p class="text-h6">محتوى المناقشة</p>
            <div id="summernote"></div>
            

            <p class="text-error" v-if="errorMessages.content">
              {{ errorMessages.content[0] }}
            </p>
            <!-- <textarea name="" id="" cols="30" rows="10"></textarea> -->
          </div>
          <div>
            <v-lable class="text-h6">اختر التصنيف للمناقشة</v-lable>
            <v-select
              v-model="categorySelect"
              :items="categories"
              item-title="name"
              item-value="id"
              label="Select"
              variant="outlined"
              multiple
              chips
              closable-chips
              persistent-hint
            >
              <template v-slot:item="{ props }">
                <v-list-item v-bind="props" class="text-end"></v-list-item>
              </template>
            </v-select>
          </div>
          <div>
            <input v-model="checkbox" type="checkbox" name="" id="check" />
            <label for="check" class="mr-2 font-weight-bold"
              >اوافق على <span style="color: red">الشروط والاحكام</span> بخصوص
              النشر بمنصة القانوني</label
            >
          </div>
          <div style="text-align: end">
            <v-btn
              :disabled="!readyToSend"
              :loading="addDiscussionLoading"
              variant="outlined"
              class="rounded-pill mt-3"
              @click="addDisscussion"
              style="color: white; background-color: #333"
            >
              <p class="text-h6">افتح المناقشة</p>
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col cols="2">
        <!-- <bannar-slide></bannar-slide> -->
      </v-col>
    </v-row>
    <v-dialog
      persistent
      v-model="dialog"
      transition="dialog-top-transition"
      width="auto"
    >
      <v-card elevation="4" max-width="300">
        <v-card-text class="text-h6">
          <div class="">تم نشر المناقشة بنجاح</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            variant="flat"
            color="success"
            @click="
              dialog = false;
              $router.push('/discussions');
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
const { isLogin, tryLogin } = useAuthStore();

definePageMeta({
  middleware: ["auth"],
});

useHead({
  link: [
    {
      rel: "stylesheet",
      type: "text/css",
      href: "https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css",
    },
    {
      rel: "stylesheet",
      type: "text/css",
      href: "https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css",
    },
  ],
  script: [
 
    {
      src: "https://code.jquery.com/jquery-3.5.1.min.js",
    },
    {
      src: "https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js",
    },
  ],
});

const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();
const readyToSend = computed(() => {
  return checkbox.value;
});
const dialog = ref(false);
const addDiscussionLoading = ref(false);
const title = ref("");

const categorySelect = ref();
const categories = ref();

const checkbox = ref(false);
const errorMessages = reactive({
  title: [] as string[],
  content: [] as string[],
});


const { data, error } = await useSendRequest<responseReturn>("/categories", {});
if (error.value) {
  setToastMessage(error.value.message);
} else if (data.value?.status) {
  categories.value = data.value.data;
}
async function addDisscussion() {
  errorMessages.content = [];
  errorMessages.title = [];
  addDiscussionLoading.value = true;
  let content = document.getElementsByClassName("note-editable")[0].innerHTML;
  const { data, error } = await useSendRequest<responseReturn>(
    "/discussions/add",
    {
      title: title.value,
      category_ids: categorySelect.value,
      content: content,
      token: authStore.token,
    }
  );
  addDiscussionLoading.value = false;
  if (error.value) {
    setToastMessage(error.value.message);
    return;
  }
  if (data.value?.status) {
    dialog.value = true;
    sendDiscussionNotification(data.value.data);
  } else {
    const errors = data.value?.errors || [];
    for (let i = 0; i < errors.length; i++) {
      const obj = errors[i] as { filed_name: string; message: string[] };
      if (obj.filed_name === "title") {
        errorMessages.title = obj.message;
      } else if (obj.filed_name === "content")
        errorMessages.content = obj.message;
    }
  }
}

function sendDiscussionNotification(dataNotify: any) {
  useSendRequest("/notificatoin/admin/new-discussion", {
    dataNotify: dataNotify,
  });
}


onMounted(() => {

  $(document).ready(function () {
    $("#summernote").summernote();
  });
});
useHead({
  title: "مناقشات - أضف مناقشة",
  meta: [
    {
      name: "description",
      content:
        "يمكنك إضافة مناقشة جديدة ونشرها على الموقع ويمكن للقراء الإطلاع عليها وابداء ارائهم",
    },
    {
      property: "og:description",
      content:
        "يمكنك إضافة مناقشة جديدة ونشرها على الموقع ويمكن للقراء الإطلاع عليها وابداء ارائهم",
    },
    { property: "og:image", content: "/images/مناقشات.png" },
    { name: "twitter:card", content: "summay_large_image" },
    { property: "og:locale", content: "ar_ar" },
    { property: "og:url", content: "https://alqanoni.com/" },
    { property: "og:type", content: "website" },
  ],
  link: [{ rel: "canonical", href: "https://alqanoni.com/" }],
});
</script>
<style>
.content img {
  max-width: 100%;
  max-height: 500px;
}
.modal-backdrop {
  position: relative !important;
}
.note-editor.note-frame .note-editing-area .note-editable {
 
    direction: rtl !important;
}
</style>
  
  