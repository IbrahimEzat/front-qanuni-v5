<template>
  <div>
    <v-row>
      <v-col lg="2" class="d-lg-block d-none">
        <bannar-slide></bannar-slide>
      </v-col>
      <v-col lg="8" cols="12">
        <v-container>
          <v-card min-height="100vh" elevation="6">
            <arrangment-header :usersCount="allUsers.length"/>
            <bannar-center></bannar-center>
            <div class="d-flex px-5">
              <h4 class="mt-4 me-4">ترتيب حسب:</h4>
              <v-select
              v-model="select"
                density="comfortable"
                style="max-width: 200px"
                variant="outlined"
                class="d-inline-block"
                item-title="name"
                item-value="value"
                :items="[
                  { name: 'تاريخ التسجيل', value: 'date' },
                  { name: 'عدد النقاط', value: 'points' },
                ]"
              >
              <template v-slot:item="{props}">
                <v-list-item class="text-end" v-bind="props"></v-list-item>
              </template>
            </v-select>
            </div>
            <arrangment-table :users="users" :admins="admins"/>
          </v-card>
          <div class="d-lg-none d-block">
            <bannar-center></bannar-center>
          </div>
        </v-container>
      </v-col>
      <v-col lg="2" class="d-lg-block d-none">
        <bannar-slide></bannar-slide>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";

const {setToastMessage} = useSettingsStore();
const {data,error} = await useSendRequest<responseReturn>('/arrangementUsers',{});
const allUsers = ref();
const select = ref('date');
if(error.value)
  setToastMessage(error.value.message);
else{
  if(data.value?.status){
    allUsers.value = data.value.data as any[];
  }
}

watch(select,()=>{
  sortUsers();
},{immediate:true});

function sortUsers(){
  if(select.value == 'date'){
    allUsers.value.sort((a:any,b:any)=>{
      if(a.created_at < b.created_at) return 1;
      return -1;
    })
  }else if(select.value == 'points'){
    allUsers.value.sort((a:any,b:any)=>{
      if(a.points < b.points) return 1;
      return -1;
    })
  }
}


const admins = computed(()=>{
  return allUsers.value.filter((item:any)=>{return item.type === 'admin'});
})
const users = computed(()=>{
  return allUsers.value.filter((item:any)=>{return item.type === 'user'});
})

useHead({
  title: 'ترتيب الأعضاء',
  meta: [
    { name: "description", content: 'ترتيب الأعضاء في الموقع' },
    { property: "og:description", content: 'ترتيب الأعضاء في الموقع' },
    { property: "og:image", content: '/images/الشعار.png' },
    { name: "twitter:card", content: "summay_large_image" },
    { property:'og:locale',content:'ar_ar'},
    { property:'og:url',content:'https://alqanoni.com/'},
    { property:'og:type',content:'website'}
  ],
  link:[{rel:'canonical',href:'https://alqanoni.com/'}],
});
</script>

<style>
</style>