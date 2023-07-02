<template>
  <div>
    <v-sheet
      elevation="2"
      border
      rounded
      style="min-height: 550px"
      class="mx-auto holder w-75 my-11"
    >
      <v-row>
        <v-col  md="5" cols="12" class="mx-auto" >
          <div class="loginForm px-10">
            <h3>سجل الدخول لحسابك</h3>
            <span class="px-6"
              >اذا لم يكن لديك حساب على منصة القانوني فانشئه الأن
              <NuxtLink to="/signup" class="text-teal-darken-1"
                >من هنا</NuxtLink
              >
            </span>

            <div class="my-5">
              <v-form ref="form" @submit.prevent="login">
                <p class="text-error" v-if="errorMessages.email">
                  {{ errorMessages.email[0] }}
                </p>
                <v-text-field
                  variant="outlined"
                  v-model="email"
                  :rules="emailRules"
                  label="البريد الاكتروني"
                  required
                ></v-text-field>

                <p class="text-error" v-if="errorMessages.password">
                  {{ errorMessages.password[0] }}
                </p>
                <v-text-field
                  variant="outlined"
                  type="password"
                  v-model="password"
                  label="كلمة المرور"
                  required
                  :rules="passwordRules"
                ></v-text-field>
                <NuxtLink to="/forgetPassword" class="text-red-darken-1"
                  >هل نسيت كلمة المرور ؟</NuxtLink
                >
                <v-btn
                  color="amber"
                  :loading="loginButtonLoadin"
                  class="mt-4 text-h6"
                  block
                  type="submit"
                >
                  تسجيل دخول
                </v-btn>
              </v-form>
            </div>
          </div>
        </v-col>
        <v-col  md="7" class="d-md-block d-none pr-0 py-0">
          <div class="imageHolder">
            <nuxt-link to="/" class=""><v-img class="mx-auto mt-14" width="150px" src="/images/الشعار.png"></v-img></nuxt-link>
            <p class="my-4">نمي مهاراتك و معارفك لتكون قانونا ناجحا</p>
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
import { useSettingsStore } from "~/stores/useSettings";

definePageMeta({
  middleware: ["guest"],
  layout: false,
});

const route = useRoute();
// const generalError = ref<string | null>(null);
const { setToastMessage } = useSettingsStore();
const errorMessages = reactive({
  email: [] as string[],
  password: [] as string[],
});
const authStore = useAuthStore();
const router = useRouter();
const loginButtonLoadin = ref(false);
const email = ref("");
const password = ref("");
const emailReady = ref(true);
const passwordReady = ref(true);
const emailRules = ref([
  (value: any) => {
    if (value) {
      if (value.includes("@")) {
        emailReady.value = true;
        return true;
      }
      emailReady.value = false;
      return "الرجاء إدخال بريد الكتروني صالح";
    }
    emailReady.value = false;
    return "الرجاء ادخال البريد الالكتروني";
  },
]);
const passwordRules = ref([
  (value: any) => {
    if (value) {
      if (value.length >= 8) {
        passwordReady.value = true;
        return true;
      }
      passwordReady.value = false;
      return "كلمة المرور على الأقل 8 حروف";
    }
    passwordReady.value = false;
    return "الرجاء ادخال كلمة المرور ";
  },
]);

const login = async () => {
  errorMessages.email = [];
  errorMessages.password = [];
  if (!emailReady.value || !passwordReady.value) return;
  loginButtonLoadin.value = true;
  const payload = {
    email: email.value,
    password: password.value,
  };
  const { data, error } = await useSendRequest<responseReturn>(
    "/login",
    payload
  );
  if (error.value) {
    setToastMessage('حدث خطا ما');
  }
  if (data.value?.status) {
    const dataReturned = data.value.data as {
      token: tokenType;
      user_type: string;
      user_image: string;
    };
    authStore.token = dataReturned.token;
    authStore.user_type = dataReturned.user_type;
    authStore.user_image = dataReturned.user_image;
    const cookieToken = useCookie<{
      token: tokenType;
      user_type: string;
      user_image: string;
    } | null>(authStore.tokenCookieShortcut, {
      default() {
        return null;
      },
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    cookieToken.value = {
      token: authStore.token,
      user_type: authStore.user_type,
      user_image: authStore.user_image,
    };
    //toast
    setToastMessage("تم تسجيل الدخول بنجاح");

    if (route.query.redirect)
      return router.push(route.query.redirect as string);
    else router.push("/");
  } else if(data.value?.errors) {
    for (let i = 0; i < data.value?.errors.length; i++) {
      const obj = data.value?.errors[i] as { filed_name: string; message: string[] };
      if (obj.filed_name === "email") {
        errorMessages.email = obj.message;
      } else if (obj.filed_name === "password") {
        errorMessages.password = obj.message;
      }
    }
  }else{
    setToastMessage(data.value?.message as string);
  }
  loginButtonLoadin.value = false;
};
useHead({
  title:'القانوني - تسجيل الدخول',
  meta: [
    { name: "description", content: 'سجل الدخول الى حسابك' },
    { property: "og:description", content: 'سجل الدخول الى حسابك' },
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

@media screen and (max-width: 1100px){
  .holder{
    width: 90% !important;
  }
}

</style>
