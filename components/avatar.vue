<template>
  <v-avatar :size="size" @click="$router.push('/showProfile/'+user_id)">
    <v-img cover :src="src"></v-img>
  </v-avatar>
</template>

<script setup lang="ts">
defineProps(["src", "size", "user_id"]);
</script>

<style>
</style>