<template>
  <div>{{ time }}</div>
</template>

<script setup lang="ts">
const props = defineProps(["minute"]);
const time = computed(() => {
  let hour = parseInt(props.minute / 60 + "");
  if (hour > 0 && props.minute % 60 > 0)
    return hour + "ساعة" + " " + (props.minute % 60) + "دقيقة ";
  if (hour > 0) return hour + "ساعة";
  return props.minute + "دقيقة ";
});
</script>

<style>
</style>