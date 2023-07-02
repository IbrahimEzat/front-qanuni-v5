<template>
  <div>
    <v-card>
      <v-snackbar
        color="info"
        style="direction: rtl"
        location="top end"
        v-model="settingsStore.isToastFound"
      >
        <span>{{ settingsStore.toastMessage }}</span>
        <template v-slot:actions>
          <v-btn
            icon="mdi-close"
            size="small"
            color="black"
            variant="flat"
            @click="
              () => {
                settingsStore.clearToastMessage();
              }
            "
          >
          </v-btn>
        </template>
      </v-snackbar>
      <v-layout style="background: #fafafa">
        <v-app-bar color="white" elevation="4" density="comfortable">
          <v-app-bar-nav-icon
            @click="drawer = !drawer"
            class="d-lg-none d-block"
          ></v-app-bar-nav-icon>
          <v-app-bar-title>
            <v-avatar color="red" class="me-5"
              ><v-img cover :src="authStore.user_image"></v-img
            ></v-avatar>
            <span
              ><nuxt-link class="text-black" to="/admin/dashboard"
                >لوحة التحكم</nuxt-link
              ></span
            >
          </v-app-bar-title>
          <v-text-field
            density="compact"
            variant="solo"
            label="Search templates"
            append-inner-icon="mdi-magnify"
            single-line
            hide-details
            class="me-5"
            @click:append-inner="() => {}"
          ></v-text-field>
          <notification-list />

          <v-btn icon>
            <v-icon @click="authStore.logout">mdi-logout</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-app-bar>
        <v-container>
          <v-main style="min-height: 100vh">
            <v-navigation-drawer
              location="end"
              color="#333"
              elevation="8"
              v-model="drawer"
            >
              <v-list nav>
                <v-list-item
                  class="mb-1"
                  style="background-color: white"
                  link
                  prepend-icon="mdi-shape-plus"
                  title="تصنيفات الموقع"
                  @click="goToUrl('/admin/categories')"
                ></v-list-item>

                <v-list-item
                  class="mb-1"
                  style="background-color: white"
                  link
                  prepend-icon="mdi-shape-plus"
                  title="اوسمةالموقع"
                  @click="goToUrl('/admin/badges')"
                ></v-list-item>

                <v-list-group
                  class="text-black mb-1"
                  style="background: #fefefe; border-radius: 5px"
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-post"
                      title="قسم المقالات"
                    ></v-list-item>
                  </template>

                  <v-list-item
                    :active="$route.path === '/admin/blogs'"
                    @click="goToUrl('/admin/blogs')"
                    value="page2"
                    title="مقالات الموقع"
                  ></v-list-item>
                </v-list-group>

                <v-list-group
                  class="text-black mb-1"
                  style="background: #fefefe; border-radius: 5px"
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-account-voice"
                      title="قسم المناقشات"
                    ></v-list-item>
                  </template>
                  <v-list-item
                    @click="goToUrl('/admin/discussions')"
                    title="مناقشات الموقع"
                  ></v-list-item>
                </v-list-group>

                <v-list-group
                  class="text-black mb-1"
                  style="background: #fefefe; border-radius: 5px"
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-vote"
                      title="قسم الاستطلاعات"
                    ></v-list-item>
                  </template>
                  <v-list-item
                    @click="goToUrl('/admin/surveys')"
                    title="استطلاعات الموقع"
                  ></v-list-item>
                </v-list-group>

                <v-list-group
                  class="text-black mb-1"
                  style="background: #fefefe; border-radius: 5px"
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-library"
                      title="قسم المكتبة"
                    ></v-list-item>
                  </template>

                  <v-list-item
                    :active="$route.path === '/admin/library'"
                    @click="goToUrl('/admin/library')"
                    value="page3"
                    title="مكتبات الموقع"
                  ></v-list-item>
                </v-list-group>

                <v-list-group
                  class="text-black mb-1"
                  style="background: #fefefe; border-radius: 5px"
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-help-box-multiple-outline"
                      title="قسم الاختبارات"
                    ></v-list-item>
                  </template>

                  <v-list-item
                    :active="$route.path === '/admin/exams'"
                    @click="goToUrl('/admin/exams')"
                    title="اختبارات الموقع"
                  ></v-list-item>
                </v-list-group>

                <v-list-group
                  class="text-black mb-1"
                  style="background: #fefefe; border-radius: 5px"
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-library"
                      title="قسم المسابقات"
                    ></v-list-item>
                  </template>

                  <v-list-item
                    :active="$route.path === '/admin/competition/add'"
                    @click="goToUrl('/admin/competition/add')"
                    title="اضافة مسابقة"
                  ></v-list-item>
                  <v-list-item
                    :active="$route.path === '/admin/competition'"
                    @click="goToUrl('/admin/competition')"
                    title="مسابقات الموقع"
                  ></v-list-item>
                </v-list-group>

                <v-list-group
                  class="text-black mb-1"
                  style="background: #fefefe; border-radius: 5px"
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-google-ads"
                      title="قسم اللافتات "
                    ></v-list-item>
                  </template>
                  <v-list-item
                    @click="goToUrl('/admin/banners')"
                    title="لافتات الموقع"
                  ></v-list-item>
                </v-list-group>

                <v-list-group
                  class="text-black mb-1"
                  style="background: #fefefe; border-radius: 5px"
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-face-agent"
                      title="قسم الخدمات "
                    ></v-list-item>
                  </template>
                  <v-list-item
                    @click="goToUrl('/admin/services')"
                    title="خدمات الموقع"
                  ></v-list-item>
                  <v-list-item
                    @click="goToUrl('/admin/services/subscriptions')"
                    title="الاشتراكات"
                  ></v-list-item>
                </v-list-group>

                <v-list-group
                  class="text-black mb-1"
                  style="background: #fefefe; border-radius: 5px"
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-account-group-outline"
                      title="قسم المستخدمين "
                    ></v-list-item>
                  </template>
                  <v-list-item
                    @click="goToUrl('/admin/users')"
                    title="مستخدمين الموقع"
                  ></v-list-item>
                </v-list-group>
                <v-list-group
                  class="text-black mb-1"
                  style="background: #fefefe; border-radius: 5px"
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-account-group-outline"
                      title=" الصفحات الثابتة "
                    ></v-list-item>
                  </template>
                  <v-list-item
                    @click="goToUrl('/admin/staticPages/addAboutSite')"
                    title="معلومات حول الموقع"
                  ></v-list-item>
                  <v-list-item
                    @click="goToUrl('/admin/staticPages/questions')"
                    title="الاسئلة المكررة"
                  ></v-list-item>
                  <v-list-item
                    @click="goToUrl('/admin/staticPages/usage')"
                    title=" اتفافية الاستخدام والخصوصية"
                  ></v-list-item>
                  <v-list-item
                    @click="goToUrl('/admin/staticPages/copyrights')"
                    title="جميع حقوق النشر محفوطة"
                  ></v-list-item>
                </v-list-group>
              </v-list>
            </v-navigation-drawer>

            <slot />
          </v-main>
        </v-container>
      </v-layout>
    </v-card>
  </div>
</template>
  
  <script setup >
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
const drawer = ref(true);
const router = useRouter();
function goToUrl(url) {
  router.push(url);
}
const authStore = useAuthStore();
useHead({
  title: "لوحة التحكم",
  script: [
    {
      src: "https://js.pusher.com/8.0.1/pusher.min.js",
    },
  ],
});

onMounted(() => {
  const interval = setInterval(() => {
    if (process.client) {
      var pusher = new Pusher("cd9ce3c8c8ce79dd100e", {
        cluster: "ap2",
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
        var channel = pusher.subscribe("blog");
        channel.bind("new-blog", (data) => {
          let dataJson = JSON.parse(data.data.data);
          // Method to be dispatched on trigger.
          settingsStore.setToastMessage(dataJson.message);
          settingsStore.addNewNotification(data.data);
        });
        var channelDiscussion = pusher.subscribe("discussion");
        channelDiscussion.bind("new-discussion", (data) => {
          let dataJson = JSON.parse(data.data.data);
          // Method to be dispatched on trigger.
          settingsStore.setToastMessage(dataJson.message);
          settingsStore.addNewNotification(data.data);
        });
        var channelFile = pusher.subscribe("file");
        channelFile.bind("new-file", (data) => {
          let dataJson = JSON.parse(data.data.data);
          // Method to be dispatched on trigger.
          settingsStore.setToastMessage(dataJson.message);
          settingsStore.addNewNotification(data.data);
        });
        var channelSurvey = pusher.subscribe("survey");
        channelSurvey.bind("new-survey", (data) => {
          let dataJson = JSON.parse(data.data.data);
          // Method to be dispatched on trigger.
          settingsStore.setToastMessage(dataJson.message);
          settingsStore.addNewNotification(data.data);
        });
        var channeService = pusher.subscribe("service");
        channeService.bind("new-subscribe", (data) => {
          let dataJson = JSON.parse(data.data.data);
          // Method to be dispatched on trigger.
          settingsStore.setToastMessage(dataJson.message);
          settingsStore.addNewNotification(data.data);
        });
        clearInterval(interval);
      }
    }
  }, 200);
});
const settingsStore = useSettingsStore();
</script>
  
  <style>
.active-class {
  background: black;
  color: white;
}

a {
  text-decoration: none;
}
</style>