<template>
  <div style="min-height: 100vh" class="bg-blue-grey-lighten-5">
    <v-row>
      <v-col cols="2" class="ma-0">
        <bannar-slide></bannar-slide>
      </v-col>
      <v-col
        class="bg-white mt-sm-8 my-8 pa-0 mx-auto"
        md="8"
        sm="11"
        cols="11"
      >
        <div class="pa-5" style="background-color: #fdf8ef; width: 100%">
          <button-back />
          <p class="font-weight-bold px-4">
            <nuxt-link to="/blogs">مقالات </nuxt-link>/ انشر المقالة
          </p>
        </div>
        <bannar-center></bannar-center>

        <div
          class="ma-3 pa-5"
          style="width: 97.5%; border: 2px solid #000; border-radius: 20px"
        >
          <div>
            <p class="text-h6">عنوان المقالة :</p>

            <input
              v-model="title"
              class="px-3 py-1 mb-5"
              style="width: 100%; border: 1px solid #000; border-radius: 10px"
              type="text"
            />
            <p class="text-error" v-if="errorMessages.title">
              {{ errorMessages.title[0] }}
            </p>
          </div>
          <div dir="ltr">
            <p class="text-h6 text-end">المقالة</p>
            <div id="editor" class="content"></div>
            <div id="summernote"></div>

            <div
              style="font-size: 15px"
              class="text-black mb-10 font-weight-medium d-flex justify-space-between"
            >
              <p>عدد كلمات المقالة يجب ان يزيد عن 500 كلمة</p>
              <p id="counter">{{ wordCount }} :عدد الكلمات</p>
            </div>

            <p class="text-error" v-if="errorMessages.content">
              {{ errorMessages.content[0] }}
            </p>
            <!-- <textarea name="" id="" cols="30" rows="10"></textarea> -->
          </div>
          <div>
            <input v-model="checkbox" type="checkbox" name="" id="check" />
            <label for="check" class="mr-2 font-weight-bold"
              >اوافق على <span style="color: red">الشروط والاحكام</span> بخصوص
              النشر في الموضوع</label
            >
          </div>
          <div style="text-align: end">
            <v-btn
              :disabled="!readyToSend"
              :loading="addBlogLoading"
              variant="outlined"
              class="rounded-pill mt-3"
              @click="addBlog"
              style="color: white; background-color: #333"
            >
              <p class="text-h6">أضف المقالة</p>
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col cols="2">
        <bannar-slide></bannar-slide>
      </v-col>
    </v-row>
    <v-dialog
      persistent
      v-model="dialog"
      transition="dialog-top-transition"
      width="auto"
    >
      <v-card elevation="4" max-width="300">
        <v-card-title class="text-success"
          >المقالة في طور المعالجة</v-card-title
        >
        <v-card-text class="text-h6">
          <div class="">
            لقد تم إرسال المقالة إلى المسؤولين عن قسم المقالات وستنشر للعموم بعد
            مراجعتها إن شاء الله
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            variant="flat"
            color="success"
            @click="
              dialog = false;
              $router.push('/blogs');
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

definePageMeta({
  middleware: ["auth"],
});

useHead({
  link: [
    {
      rel: "stylesheet",
      type: "text/css",
      href: "https://cdn.quilljs.com/1.3.6/quill.snow.css",
    },
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
const wordCount = ref(0);
const readyToSend = computed(() => {
  return checkbox.value && +wordCount.value >= 500;
});
const dialog = ref(false);
const addBlogLoading = ref(false);
const title = ref("");
const checkbox = ref(false);
const errorMessages = reactive({
  title: [] as string[],
  content: [] as string[],
});

async function addBlog() {
  errorMessages.content = [];
  errorMessages.title = [];
  addBlogLoading.value = true;
  let content = document.getElementsByClassName("note-editable")[0].innerHTML; //document.getElementById("editor")?.firstChild?.innerHTML;
  const { data, error } = await useSendRequest<responseReturn>("/blogs/add", {
    title: title.value,
    content: content,
    token: authStore.token,
  });
  addBlogLoading.value = false;
  if (error.value) {
    setToastMessage("حدث خطا ما");
    return;
  }
  if (data.value?.status) {
    sendNotification(data.value.data);
    dialog.value = true;
  } else if (data.value?.errors) {
    for (let i = 0; i < data.value?.errors.length; i++) {
      const obj = data.value?.errors[i] as {
        filed_name: string;
        message: string[];
      };
      if (obj.filed_name === "title") {
        errorMessages.title = obj.message;
      } else if (obj.filed_name === "content")
        errorMessages.content = obj.message;
    }
  } else {
    setToastMessage("حدث خطا ما");
  }
}

async function sendNotification(dataNotify: any) {
  useSendRequest<responseReturn>("/notificatoin/admin/new-blog", {
    dataNotify: dataNotify,
  });
}


onMounted(() => {
  $(document).ready(function () {
    $("#summernote").summernote();
  });
  let interval = setInterval(() => {
    console.log("interval");
    const noteDom = document.getElementsByClassName("note-editable")[0];
    if (noteDom) {
      document
        .getElementsByClassName("note-editable")[0]
        .addEventListener("keyup", () => {
          console.log(noteDom.textContent?.trim().length);
          wordCount.value =  noteDom.textContent?.trim().length ? noteDom.textContent?.trim()?.split(" ")?.length : 0;
          
        });
      clearInterval(interval);
    }
  }, 100);
});

useHead({
  title: "مقالات - أضف مقالة",
  meta: [
    {
      name: "description",
      content:
        "يمكنك إضافة مقالة جديدة ونشرها على الموقع ويمكن للقراء الإطلاع عليها وابداء ارائهم",
    },
    {
      property: "og:description",
      content:
        "يمكنك إضافة مقالة جديدة ونشرها على الموقع ويمكن للقراء الإطلاع عليها وابداء ارائهم",
    },
    { property: "og:image", content: "/images/مقالات.png" },
    { name: "twitter:card", content: "summay_large_image" },
    { property: "og:locale", content: "ar_ar" },
    { property: "og:url", content: "https://alqanouni.com/" },
    { property: "og:type", content: "website" },
  ],
  link: [{ rel: "canonical", href: "https://alqanouni.com/" }],
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

