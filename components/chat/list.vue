<template>
  <div class="d-inline-block">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-icon
          v-bind="props"
          v-if="!chatStore.isHasNewMessage"
          icon="mdi-email-outline"
          size="x-large"
          class="pointer"
        ></v-icon>
        <v-badge
          v-else
          v-bind="props"
          class="pointer"
          color="red"
          dot
        >
          <v-icon icon="mdi-email-outline" size="x-large"></v-icon> </v-badge
      ></template>

      <v-card
        style="
          border: 1px solid #999;
          max-height: 350px;
          width: 350px;
          overflow-y: auto;
        "
        class="text-end"
      >
        <ChatItem
          v-for="chat in chatStore.chatConnects"
          :key="chat.id"
          :chat="chat"
        />
        <v-list-item v-if="chatStore.chatConnects.length === 0"
          >لا يوجد مراسلات جديدة لديك</v-list-item
        >
      </v-card>
    </v-menu>
  </div>
</template>
  
  <script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useChatStore } from "~/stores/useChatStore";
import { responseReturn } from "~/types/tpes";

const authStore = useAuthStore();
const chatStore = useChatStore();

const { data, error } = await useSendRequest<responseReturn>(
  `/chat/getUsersConnect`,
  { token: authStore.token }
);

if (!error.value && data.value?.status) {
  chatStore.setChatMesseges(data.value.data as any[]);
}
</script>
  
  <style>
.pointer {
  cursor: pointer;
}
</style>