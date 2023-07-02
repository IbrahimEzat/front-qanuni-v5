<template>
  <v-list-item dir="rtl" class="" style="padding: 0 !important">
    <v-banner
      class="text-start pointer"
      density="compact"
      @click="goToUrl()"
      lines="three"
    >
      <div class="d-flex justify-space-between align-center">
        <v-avatar size="50" class="me-2">
          <v-img cover :src="otherUser.image"></v-img>
        </v-avatar>
        <span class="align-self-center" style="width: 80%">
          <p style="font-weight: 700">{{ otherUser.name }}</p>
          <p style="font-weight: 500; font-size: 15px; color: #555">
            {{
              isLastMessageImSend
                ? " أنت :" + lastMessageContent
                : lastMessageContent
            }}
          </p>
        </span>
      </div>
      <v-badge
        v-if="!chat.last_chat_message.is_read && !isLastMessageImSend"
        dot
        color="blue"
        style="position: absolute; left: 15px; top: 50%"
      ></v-badge>
    </v-banner>
  </v-list-item>
</template>
  
  <script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useChatStore } from "~/stores/useChatStore";

const otherUser = computed(() => {
  return props.chat.user1.id === authStore.token.user_id
    ? props.chat.user2
    : props.chat.user1;
});
const isLastMessageImSend = computed(() => {
  return (
    props.chat.last_chat_message.message.user_send_id ==
    authStore.token.user_id
  );
});
const lastMessageContent = computed(() => {
  return props.chat.last_chat_message.message.message;
});

const authStore = useAuthStore();
const chatStore = useChatStore();
const props = defineProps(["chat"]);

function goToUrl() {
  if (!isLastMessageImSend.value && !props.chat.last_chat_message.is_read) {
    useSendRequest("/chat/markLastMessageAsRead/" + props.chat.id, {});
    chatStore.markchatConnectAsRead(props.chat);
  }
  navigateTo("/chat/" + otherUser.value.id);
}
</script>
  
  <style>
.v-banner {
  padding-left: 30px !important;
}
.pointer {
  cursor: pointer;
}
</style>
