<template>
  <div style="min-height: 100vh;" class="mb-8">
    <v-row>
      <v-col cols="2" class="ma-0">
        <bannar-slide></bannar-slide>
      </v-col>
      <v-col
        style="border: 1px solid #999;"
        class="bg-white mt-sm-8 mt-8 pa-0 mx-auto pb-10"
        md="8"
        sm="11"
        cols="11"
      >
        <div
          style="background-color: #fdf8ef; width: 100%"
          class="d-flex justify-space-between px-3"
        >
          <p class="font-weight-bold pa-4">{{ otherSide.name }}</p>
        </div>

        <bannar-center />
        <div>
          <div class="d-flex justify-space-between pa-5">
            <p class="text-h6 font-weight-bold">{{ otherSide.name }}</p>
            <p class="text-red font-weight-bold">الابلاغ عن العضو</p>
          </div>
          <div
            class="text-h6 font-weight-bold pa-1 text-center"
            style="background-color: #bde4b8"
          >
            كل رسالة ترسلها ستكلفك نقطة واحدة
          </div>
          <div
            class="py-2"
            style=" background-color: #f9f9f9"
          >
            <div
              ref="container"
              style="overflow-y: auto; max-height: 100vh"
              class="messages"
            >
              <div
                v-for="message in chatStore.realTimeMessagesForCurrentChat"
                :key="message.id"
              >
                <div
                  :class="[
                    'mx-8',
                    {
                      'text-start':
                        authStore.token.user_id == message.user_send_id,
                    },
                    {
                      'text-end':
                        authStore.token.user_id != message.user_send_id,
                    },
                  ]"
                >
                  <span v-if="message.status">
                    <v-icon
                      size="small"
                      v-if="message.status === 'fail'"
                      icon="mdi-alert-circle-outline"
                      color="error"
                    ></v-icon>
                    <v-icon
                      size="small"
                      icon="mdi-circle-outline"
                      v-if="message.status === 'loading'"
                    ></v-icon>
                  </span>
                  <p
                    style="max-width: 60%; border: 1px solid #ddd"
                    :class="[
                      {
                        'bg-light-blue-lighten-4':
                          authStore.token.user_id == message.user_send_id,
                      },
                      {
                        'bg-white':
                          authStore.token.user_id != message.user_send_id,
                      },
                    ]"
                    class="mb-4 text-end px-3 pt-3 rounded-lg d-inline-block"
                  >
                    {{ message.message }}<br />
                    <span style="font-size: 12px">{{
                      new Date(message.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }}</span>
                  </p>
                </div>
              </div>
              
              <div v-for="(message, index) in messages" :key="message.id">
                
                <div
                  :class="[
                    'mx-8',
                    {
                      'text-start':
                        authStore.token.user_id == message.user_send_id,
                    },
                    {
                      'text-end':
                        authStore.token.user_id != message.user_send_id,
                    },
                  ]"
                >
                  <span v-if="message.status">
                    <v-icon
                      size="small"
                      v-if="message.status === 'fail'"
                      icon="mdi-alert-circle-outline"
                      color="error"
                    ></v-icon>
                    <v-icon
                      size="small"
                      icon="mdi-circle-outline"
                      v-if="message.status === 'loading'"
                    ></v-icon>
                  </span>
                  <p
                    style="max-width: 60%; border: 1px solid #ddd"
                    :class="[
                      {
                        'bg-light-blue-lighten-4':
                          authStore.token.user_id == message.user_send_id,
                      },
                      {
                        'bg-white':
                          authStore.token.user_id != message.user_send_id,
                      },
                    ]"
                    class="mb-1 text-end px-3 pt-3 rounded-lg d-inline-block"
                  >
                    {{ message.message }}<br />
                    <span style="font-size: 12px">{{
                      new Date(message.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }}</span>
                  </p>
                </div>
                <div
                  v-if="
                    index < messages.length - 1 &&
                    new Date(message.created_at).toLocaleDateString() !==
                      new Date(
                        messages[index + 1].created_at
                      ).toLocaleDateString()
                  "
                  class="text-center"
                >
                  <span style="">{{
                    new Date(message.created_at).toLocaleDateString([
                      "ban",
                      "id",
                    ])
                  }}</span>
                </div>
              </div>

              <div id="breakPoint"></div>
            </div>
            <!-- <v-divider class="border-opacity-100 mx-6 mb-5"></v-divider> -->
            <div class="bg-white mx-8 mt-10 rounded-xl text-center" style="border: 1px #999 solid;">
              <v-textarea
                variant="solo-filled"
                v-model="message"
                id=""
                class="mx-5 mt-5 pa-4"
              ></v-textarea>
              <div class="text-end me-8">
                <v-btn
                  @click="sendMessage"
                  :disabled="!message"
                  prepend-icon="mdi-send"
                  class="mt-3 mb-6 bg-blue-accent-3"
                  ><span class="font-weight-bold text-h6">إرسال</span></v-btn
                >
              </div>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="2">
        <bannar-slide></bannar-slide>
      </v-col>
    </v-row>
  </div>
</template>
    
  <script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useChatStore } from "~/stores/useChatStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";
const chatStore = useChatStore();
const authStore = useAuthStore();
const route = useRoute();
const message = ref("");
const settingsStore = useSettingsStore();
const messages = ref([]) as any;
const otherSide = ref();
const container = ref();
const { data, error } = await useSendRequest<responseReturn>(
  "/chat/getMessagesInChat",
  {
    token: authStore.token,
    otherSide: route.params.user_id,
  }
);

if (error.value) settingsStore.setToastMessage("لا يمكن جلب البيانات");
else {
  if (data.value?.status) {
    const returnedData = data.value.data as any;
    messages.value = returnedData.messages;
    otherSide.value = returnedData.otherSide;
  }
}

function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
async function sendMessage() {
  const newMessage = {
    status: "loading",
    id: generateUUID(),
    user_send_id: authStore.token.user_id,
    message: message.value,
    created_at: new Date(),
  };

  chatStore.addMessageToRealTimeMessages(newMessage);

  const { data, error } = await useSendRequest<responseReturn>("/chat/add", {
    token: authStore.token,
    receiverId: route.params.user_id,
    message: message.value,
  });
  message.value = "";

  if (error.value || !data.value?.status) {
    settingsStore.setToastMessage(
      (error.value?.message as string) || (data.value?.message as string)
    );
    newMessage.status = "fail";
  } else {
    useSendRequest("/notificatoin/new-chat-message", {
      chat_id: (<any>data.value.data).chat_id,
    });
    newMessage.status = "success";
  }
}

onMounted(() => {
  
  chatStore.realTimeMessagesForCurrentChat = [];
  // container.value.scrollTo(0, container.value.scrollHeight);
  const element = document.getElementById("breakPoint") as HTMLElement;
  element.scrollIntoView();
});

useHead({
  title: 'صفحة المراسلة',
});
</script>
    
<style scoped>
.pointer {
  cursor: pointer;
}
.messages {
  display: flex;
  flex-direction: column-reverse;
}
</style>
