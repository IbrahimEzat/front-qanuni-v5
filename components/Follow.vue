<template>
  <div class="">
    <div >
      <div v-if="id != authStore.token.user_id">
        <div v-if="!status" class="d-flex justify-center mb-5">
          <v-btn
            class="rounded-xl"
            size="small"
            style="color: white; background: orange ; width: 100px;height: 40px; font-size: 18px;"
            @click="following()"
            >متابعة</v-btn
          >
        </div>
        <div v-else>
          <v-btn size="small" class="rounded-xl" color="info" @click="unfollow()" style="width: 150px;height: 40px; font-size: 18px;"
            >إلغاء المتابعة</v-btn
          >
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";
const props = defineProps(["id"]);

const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();
const status = ref(false);
const followingCount = ref();
const loading = ref(false);

const { data, error } = await useSendRequest<responseReturn>(
  "/getUserFollowInfo",
  {
    token: authStore.token,
    following: props.id,
  }
);

if (!error.value && data.value?.status) {
  const dataReturn = data.value.data as any;
  status.value = dataReturn.isFollowing;
  followingCount.value = dataReturn.count;
}

async function following() {
  if (!authStore.isLogin) return setToastMessage("يلزمك تسجيل دخول");
  if (loading.value) return;

  loading.value = true;

  status.value = true;
  followingCount.value += 1;
  const { data, error } = await useSendRequest<responseReturn>("/follow/add", {
    token: authStore.token,
    following: props.id,
  });

  if (error.value || !data.value?.status) {
    status.value = false;
    followingCount.value -= 1;
  }
  loading.value = false;
}
async function unfollow() {
  if (loading.value) return;
  loading.value = true;
  status.value = false;
  followingCount.value -= 1;
  const { data, error } = await useSendRequest<responseReturn>(
    "/follow/delete",
    {
      token: authStore.token,
      following: props.id,
    }
  );

  if (error.value && !data.value?.status) {
    status.value = true;
    followingCount.value += 1;
  }
  loading.value = false;
}
</script>

<style></style>