<template>
  <div>
    <v-sheet
      elevation="10"
      border
      rounded
      style="min-height: 550px"
      class="mx-auto w-75 my-11"
    >
      <v-row>
        <v-col md="5"  cols="12">
          <div style="height: 100%;" class="loginForm px-10">
            <h3 v-if="step == 1">نسيت كلمة المرور</h3>
            <h3 v-if="step == 2">رمز التحقق</h3>
            <h3 v-if="step == 3">إعاد تعيين كلمة المرور</h3>

            <span class="px-6 text-body-1" v-if="step == 1"
              >أدخل بريدك الالكتروني لارسال رقم التحقق</span
            >
            <span class="px-6 text-body-1" v-if="step == 2"
              >أدخل رمز التحقق الذي تم إرساله</span
            >
            <span class="px-6 text-body-1" v-if="step == 3"
              >إختر كلمة المرور الجديدة</span
            >
            <div class="my-5">
              <v-alert
                icon=""
                type="error"
                class="my-5"
                v-if="generalError"
                closable
                density="compact"
                style="font-size: 12px"
                >{{ generalError }}</v-alert
              >

              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-form ref="form" @submit.prevent="" class="mt-1">
                    <p class="text-error" v-if="errorMessages.email">
                      {{ errorMessages.email[0] }}
                    </p>
                    <v-text-field
                      variant="outlined"
                      label="البريد الاكتروني"
                      required
                      v-model="email"
                      type="email"
                    
                    ></v-text-field>
                    <v-btn
                      color="brown"
                      class="mt-4 text-h6"
                      block
                      :disabled="!email || !email.includes('@')"
                      :loading="loadingSendEmail"
                      type="submit"
                      @click="sendEmailVerifyCode"
                    >
                      أرسل
                    </v-btn>
                  </v-form>
                </v-window-item>
                <v-window-item :value="2">
                  <v-form ref="form" @submit.prevent="" class="mt-1">
                    <p class="text-error" v-if="errorMessages.codeField">
                      {{ errorMessages.codeField[0] }}
                    </p>
                    <v-text-field
                      variant="outlined"
                      label="رقم التحقق"
                      required
                      v-model="codeField"
                    ></v-text-field>
                    
                    <div class="d-flex justify-center">
                      <v-btn
                      color="brown"
                      class="mt-4 text-h6 me-5"
                      width="20px"
                      :loading="loadingVerifyCode"
                      type="submit"
                      @click="verifyCode"
                      :disabled="!codeField"
                    >
                      تحقق
                    </v-btn>
                    <v-btn
                      color="green"
                      class="mt-4 text-h6"
                      width="20px"
                      type="submit"
                      @click="step--"
                      v-if="step == 2"
                    >
                      السابق
                    </v-btn>
                    </div>
                  </v-form>
                </v-window-item>
                <v-window-item :value="3">
                  <v-form ref="form" @submit.prevent="" class="mt-1">
                    <p class="text-error" v-if="errorMessages.password">
                      {{ errorMessages.password[0] }}
                    </p>
                    <v-text-field
                      variant="outlined"
                      label="كلمة المرور"
                      required
                      v-model="password"
                    ></v-text-field>
                    <v-text-field
                      variant="outlined"
                      label="تأكيد كلمة المرور"
                      required
                      v-model="confirmPassword"
                    ></v-text-field>
                    <v-btn
                      color="brown"
                      class="mt-4 text-h6"
                      block
                      :loading="loadingResetPassword"
                      type="submit"
                      @click="changePassword"
                      :disabled="!password || password != confirmPassword"
                    >
                      تأكيد
                    </v-btn>
                  </v-form>
                </v-window-item>
              </v-window>
            </div>
          </div>
        </v-col>
        <v-col md="7" class="d-md-block d-none pr-0 py-0">
          <div class="imageHolder">
            <nuxt-link to="/" class=""><v-img class="mx-auto mt-14" width="150px" src="/images/الشعار.png"></v-img></nuxt-link>
            <p class="my-5 text-h6">قم باسترجاع كلمة المرور الخاصة بك</p>
            <v-img
              class="img"
              cover
              :src="'/images/خلفية-تسجيل-الدخول.png'"
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

definePageMeta({
  middleware:[guest],
  layout:false
})

const generalError = ref();
const email = ref();
const step = ref(1);
const codeField = ref();
const password = ref();
const confirmPassword = ref();
const loadingSendEmail = ref(false);
const loadingVerifyCode = ref(false);
const loadingResetPassword = ref(false);

const errorMessages = reactive({
  email: [] as string[],
  password: [] as string[],
  codeField: [] as string[],
  confirmPassword: [] as string[],
});
function clearErrors() {
  errorMessages.email = [];
  errorMessages.password = [];
  errorMessages.codeField = [];
  errorMessages.confirmPassword = [];
  generalError.value = "";
}
async function sendEmailVerifyCode() {
  clearErrors();
  loadingSendEmail.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/forget-password",
    { email: email.value }
  );
  if (error.value) {
    generalError.value = 'حاول لاحقا';
  } else if (data.value?.status) {
    step.value = 2;
  } else {
    const arr = data.value?.errors || [];
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i] as { filed_name: string; message: string[] };
      if (obj.filed_name === "email") {
        errorMessages.email = obj.message;
        break;
      }
    }
  }
  loadingSendEmail.value = false;
}
async function verifyCode() {
  clearErrors();
  loadingVerifyCode.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/check-verify-code",
    { email: email.value, code: codeField.value }
  );
  if (error.value) {
    generalError.value = error.value.message;
  } else if (data.value?.status) {
    step.value = 3;
  } else {
    const arr = data.value?.errors || [];
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i] as { filed_name: string; message: string[] };
      if (obj.filed_name === "code") {
        errorMessages.codeField = obj.message;
        break;
      }
    }
  }
  loadingVerifyCode.value = false;
}
async function changePassword() {
  clearErrors();
  loadingResetPassword.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/reset-password",
    {
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value,
    }
  );
  if (error.value) {
    generalError.value = error.value.message;
  } else if (data.value?.status) {
    navigateTo("login");
  } else {
    const arr = data.value?.errors || [];
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i] as { filed_name: string; message: string[] };
      if (obj.filed_name === "password") {
        errorMessages.password = obj.message;
        break;
      }
    }
  }
  loadingResetPassword.value = false;
}

useHead({
  title:'القانوني - نسيت كلمة المرور',
  meta: [
    { name: "description", content: 'إعادة تعيين كلمة المرور' },
    { property: "og:description", content: 'إعادة تعيين كلمة المرور' },
    { property: "og:image", content: '/images/خلفية-تسجيل-الدخول.png' },
    { name: "twitter:card", content: "summay_large_image" },
    { property:'og:locale',content:'ar_ar'},
    { property:'og:url',content:'https://alqanouni.com/'},
    { property:'og:type',content:'website'}
  ],
  link:[{rel:'canonical',href:'https://alqanouni.com/'}],
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
  height: 72%;
}

.loginForm {
  height: 100%;
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
</style>