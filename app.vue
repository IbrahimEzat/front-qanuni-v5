<template>
  <div dir="rtl" lang="ar">
    <!-- <NuxtLoadingIndicator color="black" dir="auto" :duration="1" /> -->
    <div v-if="loading" class="loader">
        <div class="splash-screen">
          <div class="spinner-wrapper">
            <div class="spinner"></div>
          </div>
        </div>
      </div>
    <NuxtLayout>
      <NuxtPage></NuxtPage>
      <!-- <v-lazy v-model="lazy"><NuxtPage></NuxtPage></v-lazy> -->
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from "./stores/useAuthStore";
const authStore = useAuthStore();
  authStore.tryLogin();
onMounted(() => {
  
});

const toast = ref();

const nuxtApp = useNuxtApp();
const lazy = ref(false);
const loading = ref(false);
nuxtApp.hook("page:start", () => {
  loading.value = true;
});
nuxtApp.hook("page:finish", () => {
  loading.value = false;
});
</script>

<style scoped>
:root {
  --hue: 223;
  --bg: hsl(var(--hue), 10%, 90%);
  --fg: hsl(var(--hue), 10%, 10%);
  font-size: calc(16px + (24 - 16) * (100vw - 320px) / (1280 - 320));
}
* {
  box-sizing: border-box;
}

.loader {
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: 1000;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.splash-screen {
  background: #f2f0ee;
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 50;
}

.spinner-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);
}
.spinner {
  width: 80px;
  height: 80px;
  margin: 100px auto;
  background-color: #e45447;

  border-radius: 100%;
  -webkit-animation: sk-scaleout 1s infinite ease-in-out;
  animation: sk-scaleout 1s infinite ease-in-out;
}

@-webkit-keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    opacity: 0;
  }
}

@keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}
</style>
