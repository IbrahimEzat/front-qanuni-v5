<template>
  <div dir="rtl" v-if="info" class="bg-blue-grey-lighten-5">
    <v-row>
      <v-col cols="2" class="ma-0">
        <!-- <bannar-slide></bannar-slide> -->
      </v-col>
      <v-col
        class="bg-white mt-sm-8 mt-8 pa-0 mx-auto pb-10"
        md="8"
        sm="11"
        cols="11"
      >
        <div
          style="background-color: #fdf8ef; width: 100%"
          class="d-flex justify-space-between px-3"
        >
          <p style="width: 80%" class="font-weight-bold pa-4">
            الصفحة الشخصية  
          </p>
        </div>
        <bannar-center />
        <div>
          <div
            class="mx-3 pb-5 mb-3 rounded-xl"
            style="
              background-image: linear-gradient(
                to bottom right,
                white,
                #dbfcbe
              );
            "
          >
            <v-row class="mt-2">
              <v-col cols="5">
                <div class="text-center d-flex flex-column align-center my-12">
                  <!-- <p v-if="errorValidationErrors.image" class="text-error">
                                    {{ errorValidationErrors.image }}
                                </p> -->

                  <v-file-input
                    accept="image/*"
                    cover
                    label="File input"
                    id="file-input"
                    class="hide-file-input"
                    @change="uploudFile($event)"
                  ></v-file-input>

                  <label class="font-weight-black">تغير صورة بروفايلك :</label>
                  <div class="text-center">
                    <!-- <v-avatar rounded="0" size="100"> -->
                    <label
                      class="d-flex justify-center"
                      style="cursor: pointer; width: 150px; height: 150px"
                      for="file-input"
                      ><img
                        ref="previewImage"
                        style="width: 100%; padding: 0"
                        :src="showImage"
                      />
                    </label>
                    <!-- </v-avatar> -->
                  </div>
                </div>
              </v-col>
              <v-col cols="7">
                <div class="w-75 mb-5">
                  <p v-if="errorValidationErrors.name" class="text-error">
                    {{ errorValidationErrors.name }}
                  </p>
                  <v-text-field
                    variant="outlined"
                    type="text"
                    v-model="name"
                    label="الاسم كامل"
                    required
                  ></v-text-field>
                </div>
                <div class="w-75 mb-5">
                  <p v-if="errorValidationErrors.jop" class="text-error">
                    {{ errorValidationErrors.jop }}
                  </p>
                  <v-text-field
                    variant="outlined"
                    type="text"
                    v-model="job"
                    label="المهنة"
                    required
                  ></v-text-field>
                </div>
                <div class="w-75 mb-5">
                  <p v-if="errorValidationErrors.date" class="text-error">
                    {{ errorValidationErrors.date }}
                  </p>
                  <v-text-field
                    variant="outlined"
                    type="date"
                    class="mt-1"
                    v-model="date"
                    label="تاريخ الازدياد"
                    required
                  ></v-text-field>
                </div>
                <div class="w-75 mb-5">
                  <p v-if="errorValidationErrors.address" class="text-error">
                    {{ errorValidationErrors.address }}
                  </p>
                  <v-text-field
                    variant="outlined"
                    type="text"
                    v-model="address"
                    label="العنوان"
                    required
                  ></v-text-field>
                </div>
                <div>
                  <p v-if="errorValidationErrors.gender" class="text-error">
                    {{ errorValidationErrors.gender }}
                  </p>
                  <v-radio-group
                    v-model="gender"
                    label="الجنس:"
                    class="font-weight-black"
                  >
                    <v-radio color="blue" label="ذكر" value="male">
                      <template v-slot:label>
                        <div class="text-blue">ذكر</div>
                      </template>
                    </v-radio>
                    <v-radio color="pink" label="أنثى" value="female">
                      <template v-slot:label>
                        <div class="text-pink">أنثى</div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </div>
              </v-col>
            </v-row>
            <div class="text-center mt-3">
              <v-btn @click="updatInfo" class="rounded-xl bg-green ms-md-n16"
                >احفظ</v-btn
              >
            </div>
          </div>
          <div>
            <v-row class="mx-6">
              <v-col sm="5" cols="12">
                <div class="rounded-lg px-10 py-6">
                  <p class="text-h4 text-center mb-3">اضف نبذة عنك</p>
                  <textarea
                    class="w-100 pa-3"
                    v-model="aboutMe"
                    style="height: 217px; border: 1px #333 solid"
                  ></textarea>
                </div>
                <div class="text-center">
                  <v-btn
                    :disabled="!aboutMe"
                    @click="dialog = true"
                    class="rounded-xl bg-green"
                    >تحديث</v-btn
                  >
                </div>
              </v-col>
              <v-col sm="7" cols="12">
                <div
                  class="rounded-lg px-10 py-6"
                  style="
                    background-image: linear-gradient(
                      to bottom right,
                      white,
                      #f6dff6
                    );
                  "
                >
                  <p class="text-h4 text-center mb-3">تغير كلمة المرور</p>
                  <div class="mb-6">
                    <p
                      v-if="errorValidationErrors.oldPassword"
                      class="text-error"
                    >
                      {{ errorValidationErrors.oldPassword }}
                    </p>
                    <v-text-field
                      variant="outlined"
                      type="password"
                      v-model="oldPassword"
                      label="كلمة المرور القديمة"
                      required
                    ></v-text-field>
                  </div>
                  <div class="mb-6">
                    <p
                      v-if="errorValidationErrors.newPassword"
                      class="text-error"
                    >
                      {{ errorValidationErrors.newPassword }}
                    </p>
                    <v-text-field
                      variant="outlined"
                      type="password"
                      v-model="newPassword"
                      label="كلمة المرور الجديدة"
                      required
                    ></v-text-field>
                  </div>
                  <div class="mb-6">
                    <p
                      v-if="errorValidationErrors.confirmNewPassword"
                      class="text-error"
                    >
                      {{ errorValidationErrors.confirmNewPassword }}
                    </p>
                    <v-text-field
                      variant="outlined"
                      type="password"
                      v-model="confirmNewPassword"
                      label="تاكيد كلمة المرور الجديدة"
                      required
                    ></v-text-field>
                  </div>
                  <div class="text-center mt-3">
                    <v-btn @click="updatePassword" class="rounded-xl bg-green"
                      >تغير كلمة المرور</v-btn
                    >
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
      <v-col cols="2">
        <!-- <bannar-slide></bannar-slide> -->
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" transition="dialog-top-transition" width="auto">
      <v-card elevation="4" class="text-center" max-width="340">
        <v-card-text class="text-h6">
          
          <div v-if="!authStore.isAdmin">
            <v-card-title class="text-error text-h4">انتبه</v-card-title>
            <p>سيتم خصم 500 نقطة لتتمكن من إضافة نبذة تعريفية</p>
          </div>
          <div v-else>
            تأكيد إضافة نبذة تعرفية لك
          </div>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn variant="flat" color="success" :loading="updateAboutLoading" @click="updateAbout"
            >موافق</v-btn
          >
          <v-btn variant="flat" color="error" @click="dialog = false"
            >الغاء</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
  
<script setup >
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();

const info = ref();
const name = ref();
const oldPassword = ref();
const confirmNewPassword = ref();
const newPassword = ref();
const date = ref();
const job = ref();
const address = ref();
const image = ref();
const gender = ref();
const aboutMe = ref();
const previewImage = ref();
const showImage = ref();
const updateAboutLoading = ref(false);
const dialog = ref(false);
const errorValidationErrors = ref({
  name: "",
  newPassword: "",
  confirmNewPassword: "",
  date: "",
  jop: "",
  address: "",
  image: "",
  gender: "",
  oldPassword:''
});

const resetErrors = ()=>{
    errorValidationErrors.value.name= "";
    errorValidationErrors.value.newPassword= "";
    errorValidationErrors.value.confirmNewPassword= "";
    errorValidationErrors.value.date= "";
    errorValidationErrors.value.jop= "";
    errorValidationErrors.value.address= "";
    errorValidationErrors.value.image= "";
    errorValidationErrors.value.gender= "";
    errorValidationErrors.value.oldPassword= ""
};

function uploudFile($event) {
  image.value = $event.target?.files[0];
  previewImage.value.src = URL.createObjectURL($event.target?.files[0]);
}

const { data, error } = await useSendRequest("/getInfoUser", {
  token: authStore.token,
});
if (error.value) {
  setToastMessage(error.value.message);
} else if (data.value?.status) {
  info.value = data.value.data;
  name.value = info.value.name;
  date.value = info.value.birth_day;
  job.value = info.value.job;
  address.value = info.value.address;
  showImage.value = info.value.image;
  gender.value = info.value.gender;
  aboutMe.value = info.value.about_me;
  // previewImage.value.src = "http://127.0.0.1:8000/uploads/user-image/1683395569.jpg"
}



async function updatInfo() {
    resetErrors();
    
  if (!date.value) {
    errorValidationErrors.value.date = " يجب إدخال تاريخ الازياد";
    return;
  }
  if (!job.value) {
    errorValidationErrors.value.jop = "يجب ادخال المهنة";
    return;
  }
  if (!address.value) {
    errorValidationErrors.value.address = " يجب ادخال العنوان";
    return;
  }
  if (!gender.value) {
    errorValidationErrors.value.gender = "يجب تحديد الجنس";
    return;
  }
  if (!name.value) {
    errorValidationErrors.value.name = "يجب ادخال الاسم ";
    return;
  }

  

  const formdata = new FormData();
  formdata.append("name", name.value);
  formdata.append("gender", gender.value);
  formdata.append("image", image.value);
  formdata.append("birth_day", date.value);
  formdata.append("address", address.value);
  formdata.append("job", job.value);
  formdata.append("token",  JSON.stringify(authStore.token));

  const { data, error } = await useSendRequest("/change-info", formdata);
  if (error.value) {
    console.log("error occure");
    // generalError.value = error.value.message;
  }
  console.log(data.value);
  if (data.value?.status) {
    setToastMessage(data.value.message);
    resetErrors();
    if (image.value) {
      authStore.user_image = data.value.data;
      // console.log(tokenFromCookie.value.user_image);
      const tokenFromCookie = useCookie(authStore.tokenCookieShortcut);
      tokenFromCookie.value.user_image = data.value.data;
    }
  } else {
    setToastMessage(data.value.message);
  }
}

async function updatePassword() {
    resetErrors();

  if (!oldPassword.value) {
    errorValidationErrors.value.oldPassword = " يجب إدخال كلمة المرور القديمة";
    return;
  }
  if (!newPassword.value) {
    errorValidationErrors.value.newPassword = " يجب إدخال كلمة المرور الجديدة";
    return;
  }
  if (newPassword.value.length < 8) {
    errorValidationErrors.value.newPassword =
      " يجب ان تحتوي كلمة المرور الجديدة على 8 حروف على الافل";
    return;
  }
  if (newPassword.value !== confirmNewPassword.value) {
    errorValidationErrors.value.confirmNewPassword = "كلمة المرور غير متطابقة";
    return;
  }
  const { data, error } = await useSendRequest("/change-password", {
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
    confirmNewPassword: confirmNewPassword.value,
    token: authStore.token,
  });
  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    
    setToastMessage("تم تعديل كلمة المرور");
  } else {
    setToastMessage(data.value.message);
  }
}
async function updateAbout() {
  updateAboutLoading.value = true;
  const { data, error } = await useSendRequest("/change-about", {
    about_me: aboutMe.value,
    token: authStore.token,
  });
  updateAboutLoading.value = false;
  if (error.value) {
    setToastMessage(error.value.message);
  } 
  setToastMessage(data.value.message);
  dialog.value = false;
}

useHead({
  title: 'تعديل حسابي',
  meta: [
    { name: "description", content: 'تعديل الحساب للمستخدم: ' + name.value},
    { property: "og:description", content: 'تعديل الحساب للمستخدم: ' + name.value},
    { property: "og:image", content: authStore.user_image },
    { name: "twitter:card", content: "summay_large_image" },
    { property:'og:locale',content:'ar_ar'},
    { property:'og:url',content:'https://alqanoni.com/'},
    { property:'og:type',content:'website'}
  ],
  link:[{rel:'canonical',href:'https://alqanoni.com/'}],
});
</script>
  
<style scoped>
.pointer {
  cursor: pointer;
}

.v-text-field .v-input__details {
  display: none !important;
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