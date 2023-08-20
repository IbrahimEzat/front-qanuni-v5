<template>
  <div>
    <v-sheet elevation="5" border rounded class="mx-auto w-75 holder my-11">
      <v-row>
        <v-col md="5" cols="12">
          <div class="loginForm px-10">
            <h3>تسجيل حساب جديد</h3>
            <span class="px-6"
              >إذا كنت تتوفر سابقا على حساب فتفضل بتسجل الدخول من هنا
              <NuxtLink to="/login" class="text-teal-darken-1">من هنا</NuxtLink>
            </span>

            <div class="my-5">
              <v-form ref="form" style="text-align: start">
                <v-window v-model="step">
                  <v-window-item :value="1">
                    <p v-if="errorValidationErrors.email" class="text-error">
                      {{ errorValidationErrors.email }}
                    </p>
                    <v-text-field
                      variant="outlined"
                      type="email"
                      v-model="email"
                      label="البريد الاكتروني"
                      required
                      class="mt-1"
                      persistent-hint
                    >
                    </v-text-field>
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
                    <p v-if="errorValidationErrors.password" class="text-error">
                      {{ errorValidationErrors.password }}
                    </p>

                    <v-text-field
                      variant="outlined"
                      type="password"
                      v-model="password"
                      label="كلمة المرور"
                      required
                    ></v-text-field>
                  </v-window-item>
                  <v-window-item :value="2">
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
                    <p v-if="errorValidationErrors.jop" class="text-error">
                      {{ errorValidationErrors.jop }}
                    </p>
                    <v-text-field
                      variant="outlined"
                      type="text"
                      v-model="jop"
                      label="المهنة"
                      required
                    ></v-text-field>
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
                  </v-window-item>
                  <v-window-item :value="3">
                    <p v-if="errorValidationErrors.image" class="text-error">
                      {{ errorValidationErrors.image }}
                    </p>

                    <v-file-input
                      accept="image/*"
                      label="File input"
                      id="file-input"
                      class="hide-file-input"
                      @change="uploudFile($event)"
                    ></v-file-input>

                    <label class="font-weight-black"
                      >ارفع صورة لاجل بروفايلك :</label
                    >
                    <div class="text-center">
                      <v-avatar rounded="0" size="100">
                        <v-label
                          class="d-flex justify-center"
                          style="cursor: pointer"
                          for="file-input"
                          ><img
                            ref="previewImage"
                            style="width: 100%; padding: 0"
                            src="/images/اختر-صورة-للبروفيل.png"
                          />
                        </v-label>
                      </v-avatar>
                    </div>
                    <p v-if="errorValidationErrors.gender" class="text-error">
                      {{ errorValidationErrors.gender }}
                    </p>
                    <v-radio-group
                      v-model="gender"
                      label="الجنس:"
                      class="font-weight-black ps-16 ms-10"
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
                  </v-window-item>
                  <v-window-item :value="4">
                    <p>
                      أدخل رمز التحقق الذي أرسلناه إلى البريد الخاص بك لإكمال
                      عملية تسجيل حسابك
                    </p>
                    <p v-if="errorValidationErrors.code" class="text-error">
                      {{ errorValidationErrors.code }}
                    </p>
                    <v-text-field
                      variant="outlined"
                      type="text"
                      class="mt-2"
                      v-model="code"
                      label="رمز التحقق"
                      required
                    ></v-text-field>
                  </v-window-item>
                </v-window>
              </v-form>
              <div class="text-start">
                <div class="d-flex">
                  <v-btn
                    color="green"
                    :loading="loading"
                    class="mt-1 text-h6"
                    @click="next"
                    v-if="step == 1 || step == 2"
                  >
                    التالي
                  </v-btn>
                  <v-btn
                    color="green"
                    class="mt-1 text-h6"
                    :loading="sendCodeLoading"
                    type="submit"
                    v-if="step == 3"
                    @click="next"
                  >
                    أرسل رمز التحقق
                  </v-btn>
                  <v-btn
                    color="green"
                    class="mt-1 text-h6"
                    :loading="signupButtonLoadin"
                    type="submit"
                    v-if="step == 4"
                    @click="verifyCode"
                  >
                    أنشا حساب
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="green"
                    class="mt-1 text-h6"
                    @click="step--"
                    v-if="step > 1"
                  >
                    السابق
                  </v-btn>
                </div>
                <p class="text-green mt-3 font-weight-black">{{ step }}/4</p>
                <v-divider class="border-opacity-50"></v-divider>
              </div>
              <v-btn
                elevation="1"
                @click="$router.push('/')"
                class="rounded-pill mt-3 bg-blue-grey-lighten-4"
              >
                تصفح كزائر
              </v-btn>
            </div>
          </div>
        </v-col>
        <v-col md="7" class="d-md-block d-none pr-0 py-0">
          <div class="imageHolder">
            <nuxt-link to="/" class=""
              ><v-img
                class="mx-auto mt-14"
                width="150px"
                src="/images/الشعار.png"
              ></v-img
            ></nuxt-link>
            <p class="my-4">نمي مهاراتك و معارفك لتكون قانونا ناجحا</p>

            <v-img
              class="img"
              src="/images/خلفية-تسجيل-حساب-جديد.png"
              alt=""
            ></v-img>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>
  
<script setup lang="ts">
import { responseReturn, tokenType } from "~/types/tpes";
import { useAuthStore } from "~/stores/useAuthStore";
import guest from "~/middleware/guest";
import { useSettingsStore } from "~/stores/useSettings";

definePageMeta({
  middleware: [guest],
  layout: false,
});
const authStore = useAuthStore();
const signupButtonLoadin = ref(false);
const sendCodeLoading = ref(false);
const email = ref();
const name = ref();
const password = ref();
const date = ref();
const jop = ref();
const address = ref();
const image = ref();
const gender = ref();
const step = ref(1);
const previewImage = ref();
const { setToastMessage } = useSettingsStore();
const route = useRoute();
const code = ref();
const loading = ref(false);
const errorValidationErrors = reactive({
  email: "",
  name: "",
  password: "",
  date: "",
  jop: "",
  address: "",
  image: "",
  gender: "",
  code: "",
});

const resetErrors = () => {
  errorValidationErrors.email = "";
  errorValidationErrors.name = "";
  errorValidationErrors.password = "";
  errorValidationErrors.date = "";
  errorValidationErrors.jop = "";
  errorValidationErrors.address = "";
  errorValidationErrors.image = "";
  errorValidationErrors.gender = "";
  errorValidationErrors.code = "";
};
const next = async () => {
  resetErrors();

  if (step.value == 1) {
    if (!email.value || !email.value.includes("@"))
      errorValidationErrors.email = " يجب إدخال بريد الكتروني صحيح";
    if (!name.value) errorValidationErrors.name = "يجب ادخال الاسم كامل";
    if (!password.value)
      errorValidationErrors.password = "يجب ادخال كلمة المرور";
    else if (password.value.length < 8)
      errorValidationErrors.password = " يجب ان تكون كلمة المرور عالاقل 8 احرف";
    if (
      errorValidationErrors.email !== "" ||
      errorValidationErrors.password !== "" ||
      errorValidationErrors.name !== ""
    )
      return;
    else {
      loading.value = true;
      const { data, error } = await useSendRequest<responseReturn>(
        "/checkUniqueEmail",
        {
          email: email.value,
        }
      );
      loading.value = false;
      if (error.value) setToastMessage(error.value.message);
      else if (!data.value?.status)
        errorValidationErrors.email = data.value?.message as string;
      else step.value++;
    }
  } else if (step.value == 2) {
    if (!date.value) errorValidationErrors.date = " يجب إدخال تاريخ الازياد";
    if (!jop.value) errorValidationErrors.jop = "يجب ادخال المهنة";
    if (!address.value) errorValidationErrors.address = " يجب ادخال العنوان";
    if (
      errorValidationErrors.date !== "" ||
      errorValidationErrors.jop !== "" ||
      errorValidationErrors.address !== ""
    )
      return;
    else step.value++;
  } else if (step.value == 3) {
    if (!gender.value) {
      errorValidationErrors.gender = "يجب تحديد الجنس";
      return;
    }
    // if (!gender.value /*|| !image.value*/) return;
    sendCodeLoading.value = true;
    const formdata = new FormData();
    formdata.append("email", email.value);
    const { data, error } = await useSendRequest<responseReturn>(
      "/email-verify",
      formdata
    );
    if (error.value) {
      setToastMessage("حدث خطا ما");
    }
    sendCodeLoading.value = false;
    setToastMessage(data.value?.message + "");
    if (data.value?.status) {
      step.value++;
    }
  }
};

const verifyCode = async () => {
  signupButtonLoadin.value = true;
  const formdata = new FormData();
  formdata.append("code", code.value);
  formdata.append("email", email.value);

  const { data, error } = await useSendRequest<responseReturn>(
    "/check-email-verify-code",
    formdata
  );
  if (error.value) {
    setToastMessage("حدث خطا ما");
  }
  if (data.value?.status) {
    signup();
  } else {
    errorValidationErrors.code = data.value?.message + "";
  }
  signupButtonLoadin.value = false;
};

async function signup() {
  resetErrors();
  const formdata = new FormData();
  formdata.append("name", name.value);
  formdata.append("email", email.value);
  formdata.append("password", password.value);
  formdata.append("gender", gender.value);
  formdata.append("image", image.value);
  formdata.append("birth_day", date.value);
  formdata.append("address", address.value);
  formdata.append("job", jop.value);
  const { data, error } = await useSendRequest<responseReturn>(
    "/register",
    formdata
  );
  if (error.value) {
    setToastMessage("حدث خطا ما");
  }
  if (data.value?.status) {
    interface typeDataReturend {
      token: tokenType;
      user_type: string;
      user_image: string;
      user_name: string;
      user_gender: string;
    }
    const dataReturned = data.value.data as typeDataReturend;
    authStore.token = dataReturned.token;
    authStore.user_type = dataReturned.user_type;
    authStore.user_image = dataReturned.user_image;
    authStore.user_gender = dataReturned.user_gender;
    authStore.user_name = dataReturned.user_name;
    const cookieToken = useCookie<typeDataReturend | null>(
      authStore.tokenCookieShortcut,
      {
        default() {
          return null;
        },
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      }
    );
    cookieToken.value = {
      token: authStore.token,
      user_type: authStore.user_type,
      user_image: dataReturned.user_image,
      user_gender: authStore.user_gender,
      user_name: authStore.user_name,
    };
    //toast
    setToastMessage("تم  إنشاء الحساب بنجاح");

    if (route.query.redirect) navigateTo(route.query.redirect as string);
    else navigateTo("/");
  } else {
    console.log(data.value?.errors);
  }
}

function uploudFile($event: any) {
  image.value = $event.target?.files[0];
  previewImage.value.src = URL.createObjectURL($event.target?.files[0]);
}

useHead({
  title: "القانوني - حساب جديد",
  meta: [
    { name: "description", content: "قم بإنشاء حساب جديد" },
    { property: "og:description", content: "قم بإنشاء حساب جديد" },
    { property: "og:image", content: "/images/خلفية-تسجيل-الدخول.png" },
    { name: "twitter:card", content: "summay_large_image" },
    { property: "og:locale", content: "ar_ar" },
    { property: "og:url", content: "https://alqanoni.com/" },
    { property: "og:type", content: "website" },
  ],
  link: [{ rel: "canonical", href: "https://alqanoni.com/" }],
});
</script>
  
<style scoped>
.imageHolder {
  padding-top: 10px;
  width: 100%;
  height: 100%;
  text-align: center;
}

.imageHolder h1 {
  font-size: 75px;
}

.imageHolder p {
  font-size: 27px;
  margin-bottom: 20px;
}

.imageHolder .img {
  width: 100%;
  height: 70%;
  object-fit: cover;
}

.loginForm {
  background-image: linear-gradient(rgb(243, 243, 243), rgb(255, 255, 254));
  text-align: center;
}

.loginForm h3 {
  font-size: 45px;
  padding-top: 30px;
}

.loginForm span {
  font-size: 21px;
  font-weight: 600;
}

.input {
  border: 1px black solid;
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

@media screen and (max-width: 1100px) {
  .holder {
    width: 90% !important;
  }
}
</style>