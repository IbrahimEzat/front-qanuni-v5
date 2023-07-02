<template>
  <div >
    <v-menu >
      <template v-slot:activator="{ props }">
        <v-icon
          v-bind="props"
          v-if="!settingStore.isHasUnreadNotification"
          icon="mdi-bell-outline"
          size="x-large"
          class="pointer"
        ></v-icon>
        <v-badge
          v-else
          v-bind="props"
          class="pointer"
          color="red"
          :content="settingStore.countUnreadNotification"
        >
          <v-icon icon="mdi-bell-outline" size="x-large"></v-icon>
        </v-badge>
      </template>
      <v-card
        style="
          border: 1px solid #999;
          max-height: 350px;
          max-width: 380px;
          overflow-y: auto;
        "
        class="text-end"
      >
        <NotificationItem
          v-for="notification in settingStore.realTimeNotification"
          :key="notification.id"
          :notification="notification"
        />
        <NotificationItem
          v-for="[key, notification] in settingStore.notificationMessages"
          :key="key"
          :notification="notification"
        />
        <v-list-item v-if="!settingStore.isHasNotification"
          >لا يوجد اشعارات جديدة لديك</v-list-item
        >
        <div class="my-5 text-center" v-if="loadingFetch" color="primary">
          تحميل المزيد...
        </div>
        <div ref="loadMoreIndicatorDom"></div>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";

const settingStore = useSettingsStore();
const authStore = useAuthStore();
const loadMoreIndicatorDom = ref(null) as any;

const offset = ref(0);
const count = ref(5);
const loadingFetch = ref(false);
const hasMoreNotification = ref(true);
const { data, error } = await useSendRequest<responseReturn>(
  `/notificatoin/${offset.value}/get/${count.value}`,
  { user_id: authStore.token.user_id }
);
if (!error.value && data.value?.status) {
  offset.value += count.value;
  settingStore.setNotificationMesseges(data.value.data as any[]);
}
(async () => {
  const { data, error } = await useSendRequest<responseReturn>(
    `/notificatoin/getUnreadCount`,
    { user_id: authStore.token.user_id }
  );
  if (!error.value && data.value?.status) {
    settingStore.setCountUnreadNotification(data.value.data as number);
  }
})();
async function loadMoreNotification() {
  loadingFetch.value = true;
  const { data, error } = await useSendRequest<responseReturn>(
    `/notificatoin/${offset.value}/get/${count.value}`,
    { user_id: authStore.token.user_id }
  );
  loadingFetch.value = false;

  if (!error.value && data.value?.status) {
    offset.value += count.value;
    const dataArr = data.value.data as any[];
    if (dataArr.length > 0)
      settingStore.loadMoreNotificationMessages(data.value.data as any[]);
    else hasMoreNotification.value = false;
  }
}
watch(loadMoreIndicatorDom, (newValue) => {
  if (newValue) {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          hasMoreNotification.value &&
          !loadingFetch.value
        ) {
          console.log("isIntersecting");
          loadMoreNotification();
        }
      },
      { threshold: 0.5 }
    );
    intersectionObserver.observe(loadMoreIndicatorDom.value);
  }
});
onUnmounted(() => {
  settingStore.realTimeNotification = [];
  settingStore.notificationMessages = new Map();
});
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>