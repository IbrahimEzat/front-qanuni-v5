<template>
  <div class="bg-blue-grey-lighten-5">
    <v-row style="min-height: 800px">
      <v-col cols="2" class="ma-0">
        <bannar-slide></bannar-slide>
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
            <div id="editor" class="content"></div>
            <div
              style="font-size: 15px"
              class="text-black mb-10 font-weight-medium d-flex justify-space-between"
            >
              <p id="counter"></p>
            </div>

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
              النشر في الموضوع</label
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
      href: "https://cdn.quilljs.com/1.3.6/quill.snow.css",
    },
  ],
  script: [
    {
      src: "https://cdn.quilljs.com/1.3.6/quill.js",
    },
  ],
});

const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();

const wordCount = ref(0);
const readyToSend = computed(() => {
  return checkbox.value && +wordCount.value >= 1;
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
const toolbarOptions = [
  [{ font: [] }, { size: [] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ script: "super" }, { script: "sub" }],
  [{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  ["direction", { align: [] }],
  ["link", "image", "video", "formula"],
  ["clean"],
];

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
  let content = document.getElementById("editor")?.firstChild?.innerHTML;
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

function initEditor() {
  class Counter {
    quill: any;
    options: any;
    container: any;
    constructor(quill: any, options: any) {
      this.quill = quill;
      this.options = options;
      this.container = document.querySelector(options.container);
      quill.on("text-change", this.update.bind(this));
      this.update(); // Account for initial contents
    }

    calculate() {
      let text = this.quill.getText();
      if (this.options.unit === "word") {
        text = text.trim();
        // Splitting empty text returns a non-empty array
        return text.length > 0 ? text.split(/\s+/).length : 0;
      } else {
        return text.length;
      }
    }

    update() {
      var length = this.calculate();
      var label = this.options.unit;
      if (length !== 1) {
        label += "s";
      }
      wordCount.value = length;
      this.container.innerText = "عدد الكلمات" + " : " + length;
    }
  }

  Quill.register("modules/counter", Counter);
  var quill = new Quill("#editor", {
    theme: "snow",
    modules: {
      toolbar: toolbarOptions,
      counter: {
        container: "#counter",
        unit: "word",
      },
    },
  });
  quill.format("align", "right");
  return quill;
}
onMounted(() => {
  let interval = setInterval(() => {
    console.log("interval");
    if (initEditor()) clearInterval(interval);
  }, 100);
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
    { property: "og:url", content: "https://alqanouni.com/" },
    { property: "og:type", content: "website" },
  ],
  link: [{ rel: "canonical", href: "https://alqanouni.com/" }],
});
</script>
<style scoped>
.content img {
  max-width: 100%;
  max-height: 500px;
}
</style>
  
  