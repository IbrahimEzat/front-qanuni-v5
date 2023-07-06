<template>
  <div>
    <v-card elevation="5" class="pa-5">
      <div>
        <p class="font-weight-bold">تعديل المناقشة</p>
      </div>

      <div>
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
          <p class="text-h6">المناقشة</p>
          <div id="summernote"></div>

          <!-- <div id="editor" class="content"></div> -->
          <div
            style="font-size: 15px"
            class="text-black mb-10 font-weight-medium d-flex justify-space-between"
          >
            <p>عدد كلمات المناقشة يجب ان يزيد عن 300 كلمة</p>
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

        <div style="text-align: end">
          <v-btn
            :loading="changeButtonLoading"
            variant="outlined"
            class="rounded-pill mt-3"
            @click="updateDiscussion"
            style="color: white; background-color: rgb(28, 173, 76)"
          >
            <p class="text-h6">تعديل المناقشة</p>
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>
      
<script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";

// useHead({
//   link: [
//     {
//       rel: "stylesheet",
//       type: "text/css",
//       href: "https://cdn.quilljs.com/1.3.6/quill.snow.css",
//     },
//   ],
//   script: [
//     {
//       src: "https://cdn.quilljs.com/1.3.6/quill.js",
//     },
//   ],
// });
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

definePageMeta({
  middleware: ["auth", "is-admin"],
  layout: "dashboard",
});
const discussionStatus = ref("pending");
const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();
const route = useRoute();
const categorySelect = ref();
const categories = ref();

const wordCount = ref(0);
// const readyToChange = computed(() => {
//   return wordCount.value >= 1 && title.value.length > 0;
// });
const changeButtonLoading = ref(false);
const acceptButtonLoading = ref(false);

const discussionInfo = ref();
const title = ref("");
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

function sendAcceptNotification(dataNotify: any) {
  useSendRequest("/notificatoin/accept-discussion", {
    dataNotify: dataNotify,
  });
}

const { data, error } = await useSendRequest<responseReturn>(
  "/discussions/show",
  { discussion_id: route.params.id }
);
if (error.value) {
  setToastMessage(error.value.message);
} else if (data.value?.status) {
  discussionInfo.value = data.value.data;
  title.value = discussionInfo.value.title;
  discussionStatus.value = discussionInfo.value.status;
} else {
  setToastMessage(data.value?.message as string);
  navigateTo("/");
}

(async () => {
  const { data, error } = await useSendRequest<responseReturn>(
    "/categories",
    {}
  );
  if (error.value) {
    setToastMessage(error.value.message);
    return;
  }
  if (data.value?.status) {
    categories.value = data.value.data;
  }

  const { data: selected, error: errorSelected } =
    await useSendRequest<responseReturn>("/discussions/getCategories", {
      discussion_id: discussionInfo.value.id,
    });
  if (errorSelected.value) {
    setToastMessage(errorSelected.value.message);
    return;
  }
  if (selected.value?.status) {
    categorySelect.value = selected.value.data;
  }
  //set initial content in editor after get content from database
})();

async function updateDiscussion() {
  changeButtonLoading.value = true;
  // let content = document.getElementById("editor")
  //   ?.firstChild as HTMLInputElement;
  let content = document.getElementsByClassName("note-editable")[0].innerHTML;


  const { data, error } = await useSendRequest<responseReturn>(
    "/admin/discussions/update",
    {
      discussion_id: discussionInfo.value.id,
      category_ids: categorySelect.value,
      title: title.value,
      content: content,
      token: authStore.token,
    }
  );
  changeButtonLoading.value = false;
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    setToastMessage("تم التعديل بنجاح");
  } else {
    setToastMessage(data.value?.message as string);
    const errors = data.value?.errors || [];
    for (let i = 0; i < errors.length; i++) {
      const obj = errors[i] as { filed_name: string; message: string[] };
      if (obj.filed_name === "title") {
        errorMessages.title = obj.message;
      } else if (obj.filed_name === "content") {
        errorMessages.content = obj.message;
      }
    }
  }
}

// function initEditor() {
//   class Counter {
//     quill: any;
//     options: any;
//     container: any;
//     constructor(quill: any, options: any) {
//       this.quill = quill;
//       this.options = options;
//       this.container = document.querySelector(options.container);
//       quill.on("text-change", this.update.bind(this));
//       this.update(); // Account for initial contents
//     }

//     calculate() {
//       let text = this.quill.getText();
//       if (this.options.unit === "word") {
//         text = text.trim();
//         // Splitting empty text returns a non-empty array
//         return text.length > 0 ? text.split(/\s+/).length : 0;
//       } else {
//         return text.length;
//       }
//     }

//     update() {
//       var length = this.calculate();
//       var label = this.options.unit;
//       if (length !== 1) {
//         label += "s";
//       }
//       wordCount.value = length;
//       this.container.innerText = "عدد الكلمات" + " : " + length;
//     }
//   }

//   let interval = setInterval(() => {
//     console.log("interval");
//     Quill.register("modules/counter", Counter);

//     var quill = new Quill("#editor", {
//       theme: "snow",
//       modules: {
//         toolbar: toolbarOptions,
//         counter: {
//           container: "#counter",
//           unit: "word",
//         },
//       },
//     });

//     if (quill) {
//       let myContainer = document.getElementById("editor")
//         ?.firstChild as HTMLInputElement;
//       myContainer.innerHTML = discussionInfo.value.content;
//       clearInterval(interval);
//     }
//   }, 100);
// }
onMounted(() => {
  // initEditor();
  $(document).ready(function () {
    $("#summernote").summernote();
  });
  let interval = setInterval(() => {
    const noteDom = document.getElementsByClassName("note-editable")[0];
    if (noteDom) {
      noteDom.innerHTML = discussionInfo.value.content;
      clearInterval(interval);
    }
  }, 200);
});
</script>
<style scoped>
.content img {
  max-width: 100%;
  max-height: 500px;
}
</style>
    