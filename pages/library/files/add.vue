<template>
  <div>
    <v-row>
      <v-col lg="2" class="d-lg-block d-none">
        <bannar-slide></bannar-slide>
      </v-col>
      <v-col lg="8" cols="12">
        <v-container>
          <v-card min-height="100vh" elevation="6">
            <div class="px-2 py-3 bg-orange-lighten-5">
              <div>
                <h4><nuxt-link to="/library">مكتبة</nuxt-link>/أضف ملف جديد</h4>
              </div>
            </div>
            <v-form class="ma-5">
              <div>
                <label>عنوان الملف</label><br />
                <input v-model="file_name" type="text" class="w-100" />
                <p class="text-error" v-if="errorMessages.file_name">
                  {{ errorMessages.file_name[0] }}
                </p>
              </div>
              <v-row class="my-10">
                <v-col md="3" cols="12">
                  <div>
                    <label>صورة مصغرة للملف</label><br />
                    <v-file-input
                      accept="image/*"
                      label="File input"
                      id="file-input"
                      class="hide-file-input"
                      @change="fileCoverChange"
                    ></v-file-input>
                    <div>
                      <v-label style="cursor: pointer" for="file-input"
                        ><img
                          style="
                            object-fit: cover;
                            max-height: 150px;
                            max-width: 150px;
                          "
                          :src="file_cover_preview"
                        />
                        <v-avatar
                          v-if="!file_cover_preview"
                          style="
                            border: 1px solid #777;
                            background: #fefefe;
                            border-radius: 10px;
                          "
                          size="100"
                        >
                          <v-icon color="black" icon="mdi-plus-circle"></v-icon>
                        </v-avatar>
                      </v-label>
                      <p class="text-error" v-if="errorMessages.file_cover">
                        {{ errorMessages.file_cover[0] }}
                      </p>
                    </div>
                  </div>
                </v-col>
                <v-col md="9" cols="12">
                  <div class="mb-3 d-flex">
                    <label class="w-25">عدد صفحات الملف:</label>
                    <div class="flex-grow-1">
                      <input
                        v-model="num_of_pages"
                        class="w-100"
                        type="number"
                      />
                      <p class="text-error" v-if="errorMessages.num_of_pages">
                        {{ errorMessages.num_of_pages[0] }}
                      </p>
                    </div>
                  </div>
                  <div class="mb-3 d-flex">
                    <label class="w-25">المؤلف:</label>
                    <div class="flex-grow-1">
                      <input v-model="author_name" class="w-100" type="text" />
                      <p class="text-error" v-if="errorMessages.author_name">
                        {{ errorMessages.author_name[0] }}
                      </p>
                    </div>
                  </div>
                  <div class="mb-3 d-flex">
                    <label class="w-25">تاريخ الاصدار: </label>
                    <div class="flex-grow-1">
                      <input v-model="release_date" class="w-100" type="date" />
                      <p class="text-error" v-if="errorMessages.release_date">
                        {{ errorMessages.release_date[0] }}
                      </p>
                    </div>
                  </div>
                  <div class="mb-3 d-flex">
                    <label class="w-25">لغة الملف: </label>
                    <div class="flex-grow-1">
                      <input
                        v-model="file_language"
                        class="w-100"
                        type="text"
                      />
                      <p class="text-error" v-if="errorMessages.file_language">
                        {{ errorMessages.file_language[0] }}
                      </p>
                    </div>
                  </div>
                </v-col>
              </v-row>
              <v-card
                class="pa-5"
                style="border: 1px solid #777; border-radius: 20px"
              >
                <div class="d-flex">
                  <label class="me-3 mt-2">نوع الملف: </label>
                  <v-select
                    v-model="file_type"
                    style="max-width: 250px"
                    variant="outlined"
                    density="compact"
                    item-title="name"
                    item-value="value"
                    :items="[
                      { name: 'مستند منقول PDF', value: 'pdf' },
                      { name: 'مستند قابل لاعادة التحرير DOC', value: 'docs' },
                      { name: 'صورة', value: 'image' },
                      { name: 'ملف ورقي', value: 'paper' },
                    ]"
                  >
                    <template v-slot:item="{ props }">
                      <v-list-item
                        v-bind="props"
                        class="text-end"
                      ></v-list-item>
                    </template>
                  </v-select>
                </div>
                <div>
                  <p class="text-error" v-if="errorMessages.file_size">
                    {{ errorMessages.file_size[0] }}
                  </p>
                  <div class="d-flex">
                    <label class="me-3 mt-2">حجم الملف: </label>

                    <v-text-field
                      v-model="file_size"
                      style="max-width: 250px"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </div>
                </div>

                <div class="d-flex">
                  <label class="me-3 mt-2">نوع حقوق الملكية: </label>
                  <v-select
                    v-model="property_rights"
                    style="max-width: 250px"
                    variant="outlined"
                    density="compact"
                    item-title="name"
                    item-value="value"
                    :items="[
                      { name: 'نشره المؤلف بنفسه', value: 'author' },
                      { name: 'ملكية عامة', value: 'public' },
                      { name: 'سمح المؤلف برفعه', value: 'allowed' },
                      { name: 'غير مسموح بنشره رقميا', value: 'not_allowed' },
                    ]"
                  >
                    <template v-slot:item="{ props }">
                      <v-list-item
                        v-bind="props"
                        class="text-end"
                      ></v-list-item>
                    </template>
                  </v-select>
                </div>
              </v-card>
              <v-card
                class="pa-5 my-5"
                style="border: 1px solid #777; border-radius: 20px"
              >
                <div>
                  <label class="me-3 mt-2 text-h5">نبذة عن المؤلف: </label
                  ><br/>
                  <v-file-input
                    accept="image/*"
                    label="File input"
                    id="auther-image"
                    class="hide-file-input"
                    @change="authorImageChange"
                  ></v-file-input>
                  <div>
                    <v-label style="cursor: pointer" for="auther-image"
                      ><img
                        style="
                          object-fit: cover;
                          max-height: 150px;
                          max-width: 150px;
                        "
                        :src="author_image_preview"
                      />
                      <v-avatar
                        v-if="!author_image_preview"
                        style="
                          border: 1px solid #777;
                          background: #fefefe;
                          border-radius: 10px;
                        "
                        size="100"
                      >
                        <span class="text-black"
                          >ارفع <br />صورة <br />المؤلف</span
                        >
                      </v-avatar>
                      <p class="text-error" v-if="errorMessages.author_image">
                        {{ errorMessages.author_image[0] }}
                      </p>
                    </v-label>
                  </div>

                  <editor counter_id="counter1" id="author-editor" />
                  <p class="text-error" v-if="errorMessages.about_author">
                    {{ errorMessages.about_author[0] }}
                  </p>
                </div>
              </v-card>
              <v-card
                class="pa-5 my-5"
                style="border: 1px solid #777; border-radius: 20px"
              >
                <div>
                  <label class="me-3 mt-2 text-h5">نبذة عن الملف: </label><br />
                  <editor counter_id="counter2" id="file-description-editor" />
                  <p class="text-error" v-if="errorMessages.about_file">
                    {{ errorMessages.about_file[0] }}
                  </p>
                </div>
              </v-card>
              <div v-if="file_type !== 'paper'">
                <label>ارفع الملف</label><br />
                <v-file-input
                  label="File input"
                  id="upload-file"
                  class="hide-file-input"
                  @change="changeFile"
                ></v-file-input>
                <div>
                  <label style="cursor: pointer" for="upload-file">
                    <div class="mt-5" v-if="file">
                      <span>تم اختيار ملف</span><br /><v-chip
                        closable
                        color="black"
                        >{{ file.name }}</v-chip
                      >
                    </div>
                    <v-avatar
                      v-else
                      style="
                        border: 1px solid #777;
                        background: #fefefe;
                        border-radius: 10px;
                      "
                      size="100"
                    >
                      <v-icon color="black" icon="mdi-plus-circle"></v-icon>
                    </v-avatar>
                    <p class="text-error" v-if="errorMessages.file">
                      {{ errorMessages.file[0] }}
                    </p>
                  </label>
                </div>
              </div>
              <v-progress-linear
                v-if="percent > 0"
                class="mt-2 text-white"
                :height="20"
                color="black"
                v-model="percent"
              >
                <span>جاري معالجة الملف </span>
                {{ Math.round(percent) }}%
              </v-progress-linear>

              <div class="my-10">
                <input v-model="checkBox" type="checkbox" name="" id="check" />
                <label for="check" class="mr-2 font-weight-bold"
                  >اوافق على
                  <span style="color: red">الشروط والاحكام</span> بخصوص النشر في
                  الموضوع</label
                >
              </div>
              <div class="text-end">
                <v-btn
                  :loading="loadingAddButton"
                  color="black"
                  density="compact"
                  size="large"
                  class="px-10"
                  variant="flat"
                  rounded="xl"
                  :disabled="readyAdd"
                  @click="addFile"
                  >أضف الملف</v-btn>
              </div>
            </v-form>
            <bannar-center></bannar-center>
          </v-card>
          <!-- <div class="d-lg-none d-block">
            <bannar-center></bannar-center>
          </div> -->
        </v-container>
      </v-col>
      <v-col lg="2" class="d-lg-block d-none">
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
        <v-card-title class="text-success">الملف في طور المعالجة</v-card-title>
        <v-card-text class="text-h6">
          <div class="">
            لقد تم إرسال الملف إلى المسؤولين عن قسم المكتبة وستنشر للعموم بعد
            مراجعتها إن شاء الله
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            variant="flat"
            color="success"
            @click="
              dialog = false;
              $router.push('/library');
            "
            >موافق</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <pre>{{ file }}</pre>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";


definePageMeta({
  middleware: ["auth"],
});

const checkBox = ref<boolean>();
const readyAdd = computed((): boolean => {
  return !checkBox.value as boolean;
});
const dialog = ref(false);
const errorMessages = ref({
  file_name: [] as string[],
  num_of_pages: [] as string[],
  author_name: [] as string[],
  release_date: [] as string[],
  file_language: [] as string[],
  file_cover: [] as string[],
  file_type: [] as string[],
  file_size: [] as string[],
  property_rights: [] as string[],
  author_image: [] as string[],
  about_author: [] as string[],
  about_file: [] as string[],
  file: [] as string[],
});

const loadingAddButton = ref(false);
const { setToastMessage, domain } = useSettingsStore();
const authStore = useAuthStore();

const file_name = ref("");
const num_of_pages = ref("");
const author_name = ref("");
const release_date = ref("");
const file_language = ref("");
const file_cover = ref("");
const file_cover_preview = ref("");

const file_type = ref("pdf");
const file_size = ref("");
const property_rights = ref("public");

const author_image = ref("");
const author_image_preview = ref();

const file = ref<string | any>("");

const percent = ref(0);

function fileCoverChange($event: any) {
  file_cover.value = $event.target?.files[0];
  file_cover_preview.value = URL.createObjectURL($event.target?.files[0]);
}

function authorImageChange($event: any) {
  author_image.value = $event.target?.files[0];
  author_image_preview.value = URL.createObjectURL($event.target?.files[0]);
}

function changeFile($event: any) {
  file.value = $event.target?.files[0];
}

function clearErrorMessages() {
  errorMessages.value.file_name = [];
  errorMessages.value.num_of_pages = [];
  errorMessages.value.author_name = [];
  errorMessages.value.release_date = [];
  errorMessages.value.file_language = [];
  errorMessages.value.file_cover = [];
  errorMessages.value.file_size = [];
  errorMessages.value.property_rights = [];
  errorMessages.value.about_author = [];
  errorMessages.value.about_file = [];
  errorMessages.value.file = [];
  errorMessages.value.author_image = [];
}

function preparePayload() {
  let aboutAuthorDom = document.getElementById("author-editor")
    ?.firstChild as HTMLElement;
  let aboutFileDom = document.getElementById("file-description-editor")
    ?.firstChild as HTMLElement;
  let aboutAuthor =
    aboutAuthorDom.innerHTML === "<p><br></p>" ? "" : aboutAuthorDom.innerHTML;
  let aboutFile =
    aboutFileDom.innerHTML === "<p><br></p>" ? "" : aboutFileDom.innerHTML;

  const payload = new FormData();
  payload.append("file_name", file_name.value);
  payload.append("num_of_pages", num_of_pages.value);
  payload.append("author_name", author_name.value);
  payload.append("release_date", release_date.value);
  payload.append("file_language", file_language.value);
  payload.append("file_cover", file_cover.value);
  payload.append("file_size", file_size.value);
  payload.append("property_rights", property_rights.value);
  payload.append("file_type", file_type.value);
  payload.append("about_author", aboutAuthor);
  payload.append("about_file", aboutFile);
  payload.append("file", file.value);
  payload.append("author_image", author_image.value);
  payload.append("token", JSON.stringify(authStore.token) as any);
  return payload;
}
function progressHandler(event: any) {
  percent.value = (event.loaded / event.total) * 100;
}

function completeHandler() {
  percent.value = 0; //wil clear progress bar after successful upload
}
async function addFile() {
  clearErrorMessages();
  const payload = preparePayload();
  loadingAddButton.value = true;
  var ajax = new XMLHttpRequest();
  ajax.upload.addEventListener("progress", progressHandler, false);
  ajax.addEventListener("load", completeHandler, false);
  ajax.open("POST", domain + "/library/add"); // http://www.developphp.com/video/JavaScript/File-Upload-Progress-Bar-Meter-Tutorial-Ajax-PHP
  ajax.send(payload);

  ajax.onload = (e: any) => {
    const response = JSON.parse(ajax.response);
    loadingAddButton.value = false;
    if (response.status) {
      dialog.value = true;
      sendAddCommentNotification(response.data);
    } else if (response.errors) {
      const errors = response.errors;
      for (let index = 0; index < errors.length; index++) {
        const obj = errors[index] as { filed_name: string; message: string[] };
        if (obj.filed_name === "file_name")
          errorMessages.value.file_name = obj.message;
        else if (obj.filed_name === "num_of_pages")
          errorMessages.value.num_of_pages = obj.message;
        else if (obj.filed_name === "author_name")
          errorMessages.value.author_name = obj.message;
        else if (obj.filed_name === "release_date")
          errorMessages.value.release_date = obj.message;
        else if (obj.filed_name === "file_language")
          errorMessages.value.file_language = obj.message;
        else if (obj.filed_name === "file_cover")
          errorMessages.value.file_cover = obj.message;
        else if (obj.filed_name === "file_size")
          errorMessages.value.file_size = obj.message;
        else if (obj.filed_name === "property_rights")
          errorMessages.value.property_rights = obj.message;
        else if (obj.filed_name === "file_type")
          errorMessages.value.file_type = obj.message;
        else if (obj.filed_name === "about_author")
          errorMessages.value.about_author = obj.message;
        else if (obj.filed_name === "about_file")
          errorMessages.value.about_file = obj.message;
        else if (obj.filed_name === "file")
          errorMessages.value.file = obj.message;
        else if (obj.filed_name === "author_image")
          errorMessages.value.author_image = obj.message;
      }
      setToastMessage('هناك خطا فالبيانات');
      window.scrollTo({
        top:0
      });
    }
  };
  async function sendAddCommentNotification(dataNotify: any) {
    useSendRequest("/notificatoin/admin/new-file", {
      dataNotify: dataNotify,
    });
  }
  // needEditorContent.value = false;
  // loadingAddButton.value = false;
  // if (error.value) setToastMessage(error.value.message);
  // else {

  // }
}

useHead({
  title:'مكتبة - إضافة ملف',
  meta: [
    { name: "description", content: 'صفحة خاصة لرفع الملفات' },
    { property: "og:description", content: 'صفحة خاصة لرفع الملفات' },
    { property: "og:image", content: '/images/المكتبة.png' },
    { name: "twitter:card", content: "summay_large_image" },
    { property:'og:locale',content:'ar_ar'},
    { property:'og:url',content:'https://alqanouni.com/'},
    { property:'og:type',content:'website'}
  ],
  link:[{rel:'canonical',href:'https://alqanouni.com/'}],
});
</script>

<style scoped>
.ring {
  position: relative;
  width: 50px;
  background: #262626;

  height: 50px;
  border: 3px solid #3c3c3c;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  font-family: sans-serif;
  font-size: 10px;
  color: #fff000;
  /* letter-spacing: 2px; */
  /* text-transform: uppercase; */
  text-shadow: 0 0 10px #fff000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}
.ring:before {
  content: "";
  position: absolute;
  top: 0;
  left: -1px;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid #fff000;
  border-right: 3px solid #fff000;
  border-radius: 50%;
  animation: animateC 2s linear infinite;
}
.ring span {
  display: block;
  position: absolute;
  top: calc(50% - 2px);
  left: 50%;
  width: 50%;
  height: 4px;
  background: transparent;
  transform-origin: left;
  animation: animate 2s linear infinite;
}
/* .ring span:before {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff000;
  top: -10px;
  right: -8px;
  box-shadow: 0 0 20px #fff000;
} */
@keyframes animateC {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes animate {
  0% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(405deg);
  }
}
input {
  border: 1px solid black;
  border-radius: 5px;
  padding: 4px 0.5rem;
}
form {
  border: 2px solid black;
  padding: 10px;
  border-radius: 10px;
}
label {
  font-weight: 700;
}
.hide-file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.file-label {
  color: #fff;
  background-color: #3a32ae;
  padding: 8px;
  cursor: pointer;
}

input[type="file"]:focus + .file-label {
  box-shadow: 0 0 0 4px #bae6fd;
}
</style>