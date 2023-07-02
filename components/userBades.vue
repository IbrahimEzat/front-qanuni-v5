<template>
  <div>
    <div class="d-flex flex-wrap">
        <div style="width: 50px;" v-for="badge in badges" :key="badge.id">
            <v-badge color="red" :content="badge.count">
                <img style="object-fit: contain; width:40px; height:50px" :src="badge.badge.image"/>
            </v-badge>
        </div>
    </div>
    <div v-if="badges.length === 0">لا شي</div>
  </div>
</template>

<script setup>
const badges = ref([]);
const props = defineProps(['userId']);
const {data,error} = await useSendRequest('/userBadges',{
    user_id:props.userId
});
if(!error.value && data.value?.status){
    badges.value = data.value.data.badges;
}
</script>

<style>

</style>