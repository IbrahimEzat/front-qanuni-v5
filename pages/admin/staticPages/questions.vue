<template>
    <v-container>
        <v-card>
            <v-card-title class="text-h6 mt-10 mb-5 font-weight-bold text-start">
                الاسئلة المكررة
            </v-card-title>
            <v-container>

                <div class="px-5 mb-5">
                    <editor counter_id="counter1" id="content-editor" />
                   
                </div>
                <div class="px-5 text-end">
                    <v-btn :loading="loading" color="info" @click="addInfo">حفظ التعديلات</v-btn>
                </div>
            </v-container>
        </v-card>
    </v-container>
</template>

<script setup>
 import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();

definePageMeta({
    layout: "dashboard",
   
});
const loading = ref(false);
async function addInfo(){
    loading.value = true;
    const content = document.getElementById("content-editor")?.firstChild?.innerHTML;
    const {data , error} = await useSendRequest('/admin/staticPages/addQuestions',{
        content:content,
        token : authStore.token
    });
    loading.value = false;
    if(data.value?.status){
        setToastMessage('تم حفظ التعديلات');
    }else {
        setToastMessage('حدث خظا ما');
    }
}

    const {data , error} = await useSendRequest('/staticPages/ShowQuestions',{});

    if(data.value?.status){
        let interval = setInterval(()=>{
        let myContainer = document.getElementById("content-editor");
        if(myContainer){
            myContainer.innerHTML = data.value.data.content;
            clearInterval(interval)
        }
    },100)
    }else {
        setToastMessage('حدث خظا ما');
    }

</script>

<style>
.ql-toolbar.ql-snow + .ql-container.ql-snow {
    border-top: 0px;
    min-height: 100px;
}</style>