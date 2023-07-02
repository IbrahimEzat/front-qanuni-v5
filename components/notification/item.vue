<template>
  <v-list-item dir="rtl" class="" style="padding: 0 !important">
    <v-banner
      class="text-start pointer"
      density="compact"
      @click="goToUrl(dataNotification.url)"
      lines="three"
    >
      <div class="d-flex justify-space-between">
        <v-avatar  size="45" class="me-2">
          <v-img cover :src="dataNotification.avatar ?? '/images/logo.png'"></v-img>
        </v-avatar>
        <span class="align-self-center" style="width: 80%;font-weight: 600; font-size: 15px; color: #888">{{
        dataNotification.message
      }}</span>
      </div>
      <v-badge
        v-if="!notification.read_at"
        dot
        color="primary"
        style="position: absolute; left: 15px; top: 50%"
      ></v-badge>
      
    </v-banner>
  </v-list-item>
</template>

<script setup lang="ts">
import { useSettingsStore } from "~/stores/useSettings";

const props = defineProps(["notification"]);
const settingStore = useSettingsStore();
const dataNotification = computed(() => {
  return JSON.parse(props.notification.data);
});
function goToUrl(url: string) {
  if (!props.notification.read_at) {
    useSendRequest("/notificatoin/markAsRead/" + props.notification.id, {});
    settingStore.markNotificatinAsRead(props.notification);
  }
  //change readat
  if (url) navigateTo(url);
}
</script>

<style scoped>
.v-banner {
  padding-left: 30px !important;
}
.pointer {
  cursor: pointer;
}
</style>