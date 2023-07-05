<template>
  <div class="bg-blue-grey-lighten-5">
    <v-row class="" style="min-height: 100vh;">
      <v-col md="2" sm="0">
        <!-- <bannar-slide :banner="rightBanner"></bannar-slide> -->
      </v-col>
      <v-col md="8" cols="12" class="bg-white mt-8 mb-10 pa-5">
        <div style="background-color: #fdf8ef; width: 100%" class="pa-3 d-flex justify-space-between">
          <p class="font-weight-bold text-h5 pt-2 pointer" @click="$router.push('/services')">
            الخدمات
          </p>
        </div>
        <bannar-center :banner="topBanner"></bannar-center>
        <div v-if="service">
          <div class="d-flex justify-space-between pa-5 mt-4" style="border-bottom: 2px solid black">
            <p class="text-h4">{{ service.title }}</p>
            <p class="text-h4">{{ service.points }} نقطة</p>
          </div>
          <!-- Start chat -->
          <div class="my-5">
            <v-sheet class="bg-white mt-sm-8 mt-8 pa-0 mx-auto pb-10">
              <div>
                <div class="bg-success text-h6 font-weight-bold  text-center">
                  <span class="pa-1" v-if="!authStore.isAdmin && !checkSubmit">لقد اشتريت الخدمة بنجاح تفضل بالتواصل معنا:
                    ما هو طلبك
                    سيدي؟</span>
                  <span class="pa-1" v-if="authStore.isAdmin">صفحة التواصل مع الزبون</span>
                </div>
                <div class="py-2">
                  <div ref="container" style="overflow-y: auto; max-height: 100vh" class="messages">
                    <div v-for="(
                        message, index
                      ) in messages" :key="message.id">
                      <div v-if="index < messages.length - 1 &&
                        new Date(message.created_at).toLocaleDateString() !=
                        new Date(
                          messages[index + 1].created_at
                        ).toLocaleDateString()
                        " class="text-center">
                        <span style="">{{
                          new Date(message.created_at).toLocaleDateString([
                            "ban",
                            "id",
                          ])
                        }}</span>
                      </div>
                      <div :class="[
                            'mx-8',
                            {
                              'text-start':
                                authStore.token.user_id == message.sender_id,
                            },
                            {
                              'text-end':
                                authStore.token.user_id != message.sender_id,
                            },
                          ]">
                        <span v-if="message.status">
                          <v-icon size="small" v-if="message.status === 'fail'" icon="mdi-alert-circle-outline"
                            color="error"></v-icon>
                          <v-icon size="small" icon="mdi-circle-outline" v-if="message.status === 'loading'"></v-icon>
                        </span>
                        <p style="max-width: 60%; border: 1px solid #ddd" :class="[
                          {
                            'bg-light-blue-lighten-5':
                              authStore.token.user_id == message.sender_id,
                          },
                          {
                            'bg-white':
                              authStore.token.user_id != message.sender_id,
                          },
                        ]" class="mb-1 text-end px-3 pt-3 rounded-lg d-inline-block">
                          <span v-if="message.attachment">
                            <a :href="message.attachment" target="_blank" :download="message.message">
                              <span>{{ message.message }}</span>
                            </a>
                          </span>
                          <span v-else>{{ message.message }}</span>
                          <br />
                          <span style="font-size: 12px">{{
                            new Date(message.created_at).toLocaleTimeString(
                              ['ban', 'id'],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          }}</span>
                        </p>
                      </div>
                    </div>

                    <div id="breakPoint"></div>
                  </div>
                  <div class="bg-white mx-8 rounded-xl text-center" v-if="!checkSubmit">
                    <v-textarea :disabled="file !== ''" variant="outlined" placeholder="تفضل بالتواصل معنا"
                      v-model="message" id="" class="mx-5 mt-5 pa-4"></v-textarea>

                    <div class="d-flex justify-space-between align-baseline text-end me-8">
                      <div>
                        <v-file-input label="File input" id="file-input" class="hide-file-input"
                          @change="uploudFile($event)"></v-file-input>

                        <label for="file-input" class="file-label">
                          <span>
                            <v-icon icon="mdi-file-document-plus-outline"></v-icon>
                            أرفق ملف
                          </span>
                          <v-chip size="small" color="white" v-if="file" class="ms-2">{{ file.name }}</v-chip>
                        </label>
                      </div>
                      <v-btn @click="sendMessage" :loading="sendMessageLoading" :disabled="!message && !file"
                        prepend-icon="mdi-send" class="bg-blue-accent-3"><span class="font-weight-bold text-h6">إرسال
                        </span></v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </v-sheet>
          </div>
          <!-- End chat -->
          <div class="mx-auto text-center my-5">
            <v-btn v-if="!checkSubmit" class="mx-2 rounded-pill text-h5 font-weight-medium" :loading="confirmLoading"
              style="color: white; background-color: rgb(28, 173, 76)" prepend-icon="mdi-cart-outline"
              @click="submitService()">إعتماد الخدمة</v-btn>

            <div v-else class="bg-success pa-2 d-flex justify-space-between align-baseline">
              <div>
                <v-icon icon="mdi-check-circle-outline"></v-icon>
                <span class="me-5 pa-2">تم إعتماد هذه الخدمة</span>
              </div>
              <v-btn v-if="!isRate && !authStore.isAdmin" color="warning" @click="
                $router.push(
                  '/services/holdings/' + route.params.id + '/review'
                )
                ">تقييم هذه الخدمة</v-btn>
            </div>
          </div>
        </div>
      </v-col>

      <v-col md="2" sm="0">
        <!-- <bannar-slide :banner="leftBanner"></bannar-slide> -->
      </v-col>
    </v-row>
  </div>
</template>
      
<script setup lang="ts">
import { responseReturn } from "~/types/tpes";
import { useSettingsStore } from "~/stores/useSettings";
import { useAuthStore } from "~/stores/useAuthStore";
import { useServicesChatMessages } from "~/stores/useServicesChatMessages";

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();
const servicesChat = useServicesChatMessages();
const route = useRoute();
const service = ref();
const checkSubmit = ref(false);
const confirmLoading = ref(false);
const rightBanner = ref();
const leftBanner = ref();
const topBanner = ref();
const message = ref("") as any;
const file = ref("") as any;
const messages = ref([]) as any;
const sendMessageLoading = ref(false);
const isRate = ref(false);
const withNotify = ref(true);

const { data, error } = await useSendRequest<responseReturn>(
  "/services/checkSubscription",
  {
    id: route.params.id,
    token: authStore.token,
  }
);

if (error.value) {
  setToastMessage(error.value.message);
} else if (data.value?.status) {
  const dataReturend = data.value.data as any;
  service.value = dataReturend.service;
  checkSubmit.value = dataReturend.status;
  isRate.value = dataReturend.is_rate;
} else {
  setToastMessage("لا يمكن الوصول الى هذه الصفحة");
  navigateTo("/");
}

const { data: messagesData, error: messagesErorr } =
  await useSendRequest<responseReturn>("/services/getMessagesInSubscribe", {
    subscribe_id: route.params.id,
    token: authStore.token,
  });
if (messagesErorr.value) {
  setToastMessage(messagesErorr.value.message);
} else {
  if (messagesData.value?.status) {
    messages.value = messagesData.value.data;
  } else {
    setToastMessage(messagesData.value?.message as string);
  }
}

async function submitService() {
  confirmLoading.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    "/services/submitService",
    {
      id: route.params.id,
      token: authStore.token,
    }
  );

  if (error.value) {
    setToastMessage(error.value.message);
  } else if (data.value?.status) {
    const { notifyData, notifyrror } = await useSendRequest<responseReturn>(
      "/notificatoin/service-approval",
      {
        dataNotify: data.value?.data,
      }
    );
    setToastMessage(data.value?.message as string);
    if (authStore.isAdmin)
      return navigateTo('/admin/dashboard');
    navigateTo("/services/holdings/" + route.params.id + "/review");
  } else {
    setToastMessage(data.value?.message as string);
  }
  confirmLoading.value = false;
}

watch(file, (newValue: any) => {
  if (!newValue) file.value = "";
  else {
    message.value = "";
  }
});

async function sendMessage() {
  sendMessageLoading.value = true;

  const newMessage = {
    message: message.value ? message.value : "مرفق",
    sender_id: authStore.token.user_id,
    status: "loading",
    created_at: new Date(),
    subscribe_id: route.params.id,
    attachment: message.value ? null : "file",
  };
  // servicesChat.addMessageToRealTimeMessages(newMessage);
  messages.value.unshift(newMessage);
  const formData = new FormData();
  formData.append("token", JSON.stringify(authStore.token as any));
  formData.append("message", message.value);
  formData.append("subscribe_id", route.params.id as string);
  formData.append("file", file.value);
  const { data, error } = await useSendRequest<responseReturn>(
    "/services/addMessageToSubscribe",
    formData
  );
  message.value = "";
  file.value = null;
  sendMessageLoading.value = false;
  if (error.value || !data.value?.status) {
    newMessage.status = "fail";
  } else {
    newMessage.status = "success";
    newMessage.message = (<any>data.value?.data).message;
    newMessage.attachment = (<any>data.value?.data).attachment;
    useSendRequest("/notificatoin/new-service-subscribe-message", {
      dataNotify: data.value?.data,
      withNotify:withNotify.value
    });
    withNotify.value = false;
  }
}

onUnmounted(() => {
  servicesChat.realTimeMessagesForService = [];
});

onMounted(() => {
  const interval = setInterval(() => {
    console.log("interval");

    if (process.client) {
      var pusher = new Pusher("cd9ce3c8c8ce79dd100e", {
        cluster: "ap2",
      });
      if (pusher) {
        var channel = pusher.subscribe("service.subscribe." + route.params.id);
        channel.bind("new-message", (data: any) => {
          console.log(data.data);
          if (data.data.sender_id !== authStore.token.user_id)
            messages.value.unshift(data.data);
        });
        clearInterval(interval);
      }
    }
  }, 200);
});


function uploudFile($event: any) {
  file.value = $event.target?.files[0];
}

useHead({
  title: 'مشترياتي - ' + service.value.title,
  meta: [
    { name: "description", content: 'هذه أحد الخدمات التي اشتركت  بها: ' + service.value.title },
    { property: "og:description", content: 'هذه أحد الخدمات التي اشتركت  بها: ' + service.value.title },
    { property: "og:image", content: '/images/market.png' },
    { name: "twitter:card", content: "summay_large_image" },
    { property: 'og:locale', content: 'ar_ar' },
    { property: 'og:url', content: 'https://alqanoni.com/' },
    { property: 'og:type', content: 'website' }
  ],
  link: [{ rel: 'canonical', href: 'https://alqanoni.com/' }],
});
</script>
      
<style scoped>
.pointer {
  cursor: pointer;
}

.v-rating__wrapper {
  min-width: 20px !important;
}

.v-rating__item {
  display: inline-flex;
  position: relative;
  min-width: 30px !important;
}

.custom-rating .v-rating__item {
  width: 30px !important;
  /* Adjust the value as per your desired spacing */
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
  background-color: #333;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
}

.messages {
  display: flex;
  flex-direction: column-reverse;
}

a {
  color: black;
  text-decoration: underline;
}
</style>
