<template>
    <div class="bg-blue-grey-lighten-5">
        <v-row style="min-height: 800px">
            <v-col cols="2" class="ma-0">
                <!-- <bannar-slide></bannar-slide> -->
            </v-col>
            <v-col class="bg-white mt-sm-8 mt-8 pa-0 mx-auto" md="8" sm="11" cols="11">
                <div style="background-color: #fdf8ef; width: 100%">
                    <p class="font-weight-bold pa-4">تواصل معنا</p>
                </div>
                <bannar-center></bannar-center>

                <v-row class="pa-4 my-4">
                    <v-col cols="12" sm="12" md="6">
                        <v-row v-if="!isLogin">
                            <v-col cols="12">
                                <p class="font-weight-bold mb-2">الاسم كامل:</p>
                                <v-text-field v-model="name" variant="outlined"></v-text-field>
                                <p class="text-error" v-if="errorMessages.name">
                                    {{ errorMessages.name[0] }}
                                </p>
                            </v-col>
                            <v-col cols="12">
                                <p class="font-weight-bold mb-2">البريد الإلكتروني:</p>
                                <v-text-field v-model="email" variant="outlined"></v-text-field>
                                <p class="text-error" v-if="errorMessages.email">
                                    {{ errorMessages.email[0] }}
                                </p>
                            </v-col>
                            <v-col cols="12">
                                <p class="font-weight-bold mb-2">رقم الهاتف:</p>
                                <v-text-field v-model="phone" variant="outlined"></v-text-field>
                                <p class="text-error" v-if="errorMessages.phone">
                                    {{ errorMessages.phone[0] }}
                                </p>
                            </v-col>
                            <v-col cols="12">
                                <p class="font-weight-bold mb-2">الكابشتا:</p>
                                <v-img :src="source"></v-img>
                                <v-text-field v-model="valueCaptcha" variant="outlined" class="my-2"></v-text-field>
                                <p class="text-error" v-if="errorMessages.captcha">
                                    {{ errorMessages.captcha[0] }}
                                </p>
                            </v-col>
                        </v-row>
                        <v-row v-else>
                            <v-img src="/images/headphones.png"></v-img>
                        </v-row>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                        <p class="font-weight-bold mb-2">الرسالة:</p>
                        <v-textarea v-model="message" auto-grow variant="outlined"></v-textarea>
                        <p class="text-error" v-if="errorMessages.message">
                            {{ errorMessages.message[0] }}
                        </p>
                    </v-col>

                </v-row>
                <div class="d-flex justify-end ma-10">
                    <v-btn class="bg-teal-darken-4 rounded-pill px-7 " :loading="sendLoading"
                        @click="sendData">إرسال</v-btn>
                </div>
            </v-col>
            <v-col cols="2">
                <!-- <bannar-slide></bannar-slide> -->
            </v-col>
        </v-row>
    </div>
</template>
    
<script setup lang="ts">
import useSendRequest from "~/composables/useSendRequest";
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";
const { isLogin, tryLogin } = useAuthStore();
const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();
//   definePageMeta({
//     middleware: ["auth"],
//   });


// useHead({
//     script: [
//         {
//             src: "https://www.google.com/recaptcha/api.js",
//         },
//     ],
// });


// function onSubmit(token) {
//     document.getElementById("demo-form").submit();
// }

// function onClick(e) {
//     e.preventDefault();
//     grecaptcha.ready(function () {
//         grecaptcha.execute('6LcIdO8mAAAAAKTWk9Hyfqp0hcd1EdPJG6Fxc8FH', { action: 'submit' }).then(function (token) {
//             console.log(222);

//             // Add your logic to submit to your backend server here.
//         });
//     });
// }

const name = ref();
const email = ref();
const phone = ref();
const message = ref();
const sendLoading = ref(false);

const errorMessages = ref({
    name: [] as string[],
    email: [] as string[],
    phone: [] as string[],
    message: [] as string[],
    captcha: [] as string[],
});

function clearError() {
    errorMessages.value.name = [];
    errorMessages.value.email = [];
    errorMessages.value.phone = [];
    errorMessages.value.message = [];
    errorMessages.value.captcha = [];
}

const img = ['2b827', '2g7nm', '2g783', '2wc38', '24f6w', '25p2m', '33n73', '226md', '368y5'];
const valueCaptcha = ref();
const rand = img[Math.floor(Math.random() * img.length)]
const source = ref("/images/" + rand + ".png")

async function sendData() {
    if (!isLogin) {
        if (valueCaptcha.value != rand) {
            errorMessages.value.captcha = ['خطأ في التحقق'];
            return;
        }
    }
    sendLoading.value = true;
    clearError();
    const { data, error } = await useSendRequest<responseReturn>('/contactForm', {
        name: name.value,
        email: email.value,
        phone: phone.value,
        message: message.value,
        token: authStore.token,
    });
    sendLoading.value = false;

    if (error.value) {
        setToastMessage('حدث خطأ ما');
    } else {
        if (data.value?.status) {
            setToastMessage('تم إرسال الرسالة بنجاح، سنرسل رسالة لك على الايميل في أقرب وقت ان شاء الله');
            navigateTo('/')
        } else {
            const errors = data.value?.errors || [];
            if (errors.length == 0) {
                setToastMessage('حدث خطأ أثناء عملية الإرسال')
                navigateTo('/')
            } else {
                for (let i = 0; i < errors.length; i++) {
                    const obj = errors[i] as { filed_name: string; message: string[] };
                    if (obj.filed_name === "name")
                        errorMessages.value.name = obj.message;
                    else if (obj.filed_name === "email")
                        errorMessages.value.email = obj.message;
                    else if (obj.filed_name === "phone")
                        errorMessages.value.phone = obj.message;
                    else if (obj.filed_name === "message")
                        errorMessages.value.message = obj.message;
                }
            }
        }
    }

}

useHead({
  title: "القانوني - تواصل معنا",
  meta: [
    { name: "description", content: " يمكنك التواصل معنا من خلال هذه الصفحة" },
    {
      property: "og:description",
      content: "يمكنك التواصل معنا من خلال هذه الصفحة",
    },
    { property: "og:image", content: "/images/headphones.png" },
    { name: "twitter:card", content: "summay_large_image" },
    { property: "og:locale", content: "ar_ar" },
    { property: "og:url", content: "https://alqanoni.com/" },
    { property: "og:type", content: "website" },
  ],
  link: [{ rel: "canonical", href: "https://alqanoni.com/" }],
});
</script>