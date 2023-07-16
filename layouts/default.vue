<template>
  <div>
    <nav-bar>
      <v-snackbar color="info" style="direction: rtl" location="top end" v-model="settingsStore.isToastFound">
        <span>{{ settingsStore.toastMessage }}</span>
        <template v-slot:actions>
          <v-btn icon="mdi-close" size="small" color="black" variant="flat" @click="() => {
              settingsStore.clearToastMessage();
            }
            ">
          </v-btn>
        </template>
      </v-snackbar>
      <slot class="" />
      <v-footer class="pa-5 d-block" style="background-color: #060829;">
        <p class="text-h5 my-4 font-weight-bold" style="color: #d0b556">
          حول الموقع
        </p>

        <div class="d-md-flex justify-space-between align-center w-75" style="color: white">
          <div style="border-right: 3px solid #d0b556" class="px-2 my-3 font-weight-medium">
            <div class="">
              <nuxt-link style="color: white" class="pointer text-h6" to="/AboutSite">عن الموقع</nuxt-link>
            </div>
            <div class="">
              <nuxt-link style="color: white" class="pointer text-h6" to="/staff">طاقم الموقع</nuxt-link>
            </div>
          </div>
          <div style="border-right: 3px solid #d0b556" class="px-2 my-3 font-weight-medium">
            <div class="">
              <nuxt-link style="color: white" class="pointer text-h6" to="/usage">إتفاقية الإستخدام وسياسة
                الخصوصية</nuxt-link>
            </div>
            <div class="">
              <nuxt-link style="color: white" class="pointer text-h6" to="/contact">تواصل معنا - دعم فني</nuxt-link>
            </div>
          </div>
          <div style="border-right: 3px solid #d0b556" class="px-2 my-3 font-weight-medium">
            <div class="">
              <nuxt-link style="color: white" class="pointer text-h6" to="/questions">الأسئلة المتكررة</nuxt-link>
            </div>
            <div class="">
              <nuxt-link style="color: white" class="pointer text-h6" to="">الشركاء</nuxt-link>
            </div>
          </div>
          <div class="px-2 my-3 font-weight-medium text-center">
            <p class="font-weight-bold text-h5">تابعنا:</p>
            <div>
              <a style="color: skyblue" href="https://www.facebook.com/AlqanoniMaroc" target="_blank"
                class="mx-1 facebook pointer" variant="text">
                <v-icon icon="mdi-facebook"></v-icon>
              </a>
              <a style="color: red" href="https://www.youtube.com/@ABDELHAKTALIB" target="_blank"
                class="mx-1 youtube pointer" variant="text">
                <v-icon icon="mdi-youtube"></v-icon>
              </a>
            </div>
            <div class="font-weight-bold" style="color: #d0b556">
              جميع الحقوق محفوظة {{ new Date().getFullYear() }}
            </div>
          </div>
        </div>
      </v-footer>
    </nav-bar>
  </div>
</template>

<script setup >
import { useAuthStore } from "~/stores/useAuthStore";
import { useChatStore } from "~/stores/useChatStore";
import { useSettingsStore } from "~/stores/useSettings";

const settingsStore = useSettingsStore();
const authStore = useAuthStore();
const chatStore = useChatStore();
useHead({
  link: [
    {
      rel: "preconnect",
      type: "text/css",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      type: "text/css",
      href: "https://fonts.gstatic.com",
    },

    {
      rel: "stylesheet",
      type: "text/css",
      href: "https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap",
    },
  ],
  script: [
    {
      src: "https://js.pusher.com/8.0.1/pusher.min.js",
    },
    {
      async: 'true',
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5311138885125997',
      crossorigin: "anonymous"
    },
    {
      async: 'true',
      src: "https://www.googletagmanager.com/gtag/js?id=G-3TMH9734JC",
    },
  ],
});

onMounted(() => {
  const interval = setInterval(() => {
    if (process.client) {
      
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-3TMH9734JC');

      var pusher = new Pusher("3f11ae38768814455195", {
        cluster: "eu",
        // appId: "1473088",
        // secret: "90470554fb9a1e81cdc5",
        // authEndpoint: "/api/pusher", // endpoint to authenticate user
        // auth: {
        //   headers: {
        //     Authorization: "Bearer " + authStore.token.returnedToken, // authorization token for the user
        //   },
        // },
      });
      if (pusher) {
        if (authStore.isLogin) {
          var channel = pusher.subscribe("blogs." + authStore.token.user_id);
          channel.bind("accept-blog", (data) => {
            let dataJson = JSON.parse(data.data.data);
            // Method to be dispatched on trigger.
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });
          channel.bind("delete-blog", (data) => {
            let dataJson = JSON.parse(data.data.data);
            // Method to be dispatched on trigger.
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });
          channel.bind("comment-blog", (data) => {
            let dataJson = JSON.parse(data.data.data);
            // Method to be dispatched on trigger.
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });
          var channelDiscussion = pusher.subscribe(
            "discussion." + authStore.token.user_id
          );

          channelDiscussion.bind("accept-discussion", (data) => {
            let dataJson = JSON.parse(data.data.data);
            // Method to be dispatched on trigger.
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });
          channelDiscussion.bind("add-opinion-discussion", (data) => {
            let dataJson = JSON.parse(data.data.data);
            // Method to be dispatched on trigger.
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });
          channelDiscussion.bind("delete-discussion", (data) => {
            let dataJson = JSON.parse(data.data.data);
            // Method to be dispatched on trigger.
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });

          var channelFile = pusher.subscribe("file." + authStore.token.user_id);
          channelFile.bind("accept-file", (data) => {
            let dataJson = JSON.parse(data.data.data);
            // Method to be dispatched on trigger.
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });
          channelFile.bind("delete-file", (data) => {
            let dataJson = JSON.parse(data.data.data);
            // Method to be dispatched on trigger.
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });
          channelFile.bind("add-comment-file", (data) => {
            let dataJson = JSON.parse(data.data.data);
            // Method to be dispatched on trigger.
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });

          var channelSurvey = pusher.subscribe(
            "survey." + authStore.token.user_id
          );
          channelSurvey.bind("accept-survey", (data) => {
            let dataJson = JSON.parse(data.data.data);
            // Method to be dispatched on trigger.
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });
          channelSurvey.bind("delete-survey", (data) => {
            let dataJson = JSON.parse(data.data.data);
            // Method to be dispatched on trigger.
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });

          var serviceApprovalChannel = pusher.subscribe(
            "service-approval" + authStore.token.user_id
          );
          serviceApprovalChannel.bind("service-approval", (data) => {
            let dataJson = JSON.parse(data.data.data);
            // Method to be dispatched on trigger.
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });

          var channelChat = pusher.subscribe("chat." + authStore.token.user_id);
          channelChat.bind("receive-message", (data) => {
            chatStore.addNewNotification(data.data);
          });

          var serviceChat = pusher.subscribe(
            "subscribe.message." + authStore.token.user_id
          );
          serviceChat.bind("receive-message", (data) => {
            let dataJson = JSON.parse(data.data.data);
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });

          var pointsChat = pusher.subscribe(
            "points." + authStore.token.user_id
          );
          pointsChat.bind("give", (data) => {
            let dataJson = JSON.parse(data.data.data);
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });

          var badgesChannel = pusher.subscribe(
            "badges." + authStore.token.user_id
          );
          badgesChannel.bind("give", (data) => {
            let dataJson = JSON.parse(data.data.data);
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });

          // var competitionCorrect = pusher.subscribe("competition-correct." + authStore.token.user_id);
          // competitionCorrect.bind("competition-correct", (data) => {
          //   let dataJson = JSON.parse(data.data.data);
          //   settingsStore.setToastMessage(dataJson.message);
          //   settingsStore.addNewNotification(data.data);
          // });

          var competitionPrizes = pusher.subscribe(
            "competition-prizes." + authStore.token.user_id
          );
          competitionPrizes.bind("competition-prizes", (data) => {
            let dataJson = JSON.parse(data.data.data);
            settingsStore.setToastMessage(dataJson.message);
            settingsStore.addNewNotification(data.data);
          });
        }
        clearInterval(interval);
      }
    }
  }, 200);
});
</script>

<style>
* {
  font-family: "Almarai", sans-serif;
}

.pointer {
  cursor: pointer;
}

.facebook:hover {
  color: blue;
}

.youtube:hover {
  color: red;
}

.content .ql-align-center {
  text-align: center !important;
}

.content .ql-align-left {
  text-align: left !important;
}

.content .ql-align-right {
  text-align: right !important;
}
</style>