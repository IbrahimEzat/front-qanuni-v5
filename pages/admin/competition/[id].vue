<template>
    <v-container >
        <v-card >
            <v-card-title class="text-h6 mt-10 mb-5 font-weight-bold text-start">
                تعديل مسابقة
            </v-card-title>
            <v-container>
                <div class="px-5 mb-5">
                    <p class="mb-2">عنوان المسابقة</p>
                    <v-text-field v-model="title" variant="outlined"></v-text-field>
                    <p class="text-error" v-if="errorMessages.title">
                        {{ errorMessages.title[0] }}
                    </p>
                </div>
             


                <div class="px-5 mb-5">
                    <p class="mb-2">صورة جائزة المسابقة </p>
                    <v-file-input @change="uploadPrize($event)" label="ارفق صورة" variant="outlined"></v-file-input>
                    <p class="text-error" v-if="errorMessages.prize">
                        {{ errorMessages.prize[0] }}
                    </p>
                </div>
                <div class="px-5 mb-8 text-start">
                    <p class="mb-2"> صورة جائزة المسابقة:</p>
                    <v-img style="max-height: 300px;" :src="competition.prize_image"></v-img>
                </div>
                <v-row>

                    <v-col cols="12" md="6">
                        <div class="px-5">
                            <p class="mb-2">المسابقة برعاية</p>
                            <v-file-input @change="uploadSusponsor($event)" label="ارفق صورة"
                                variant="outlined"></v-file-input>
                            <p class="text-error" v-if="errorMessages.susponsor_image">
                                {{ errorMessages.susponsor_image[0] }}
                            </p>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6">
                        <div class="px-5">
                            <p class="mb-2">الرابط المنبثق من صورة الرعاية </p>
                            <v-text-field v-model="susponsor_link" variant="outlined"></v-text-field>
                            <p class="text-error" v-if="errorMessages.susponsor_link">
                                {{ errorMessages.susponsor_link[0] }}
                            </p>
                        </div>
                    </v-col>

                </v-row>
                
                <div  class="px-5 mb-8">
                    <p class="mb-2">المسابقة برعاية:</p>
                    <a v-if="competition.sponsor_image" :href="competition.sponsor_url" target="_blank">
                        <v-img style="max-height: 300px;cursor: pointer;" :src="competition.sponsor_image"></v-img>
                    </a>
                    <div v-else class="m-auto text-center pa-5 bg-red-darken-2"> 
                        لا يوجد رعاة لهذه المسابقة
                    </div>
                </div>

                <v-row>
                    <v-col cols="12" md="6">
                        <div class="px-5 mb-5">
                            <p class="mb-2">نقاط المسابقة</p>
                            <v-text-field type="number" v-model="points" variant="outlined"></v-text-field>
                            <p class="text-error" v-if="errorMessages.points">
                                {{ errorMessages.points[0] }}
                            </p>
                        </div>

                    </v-col>
                    <v-col cols="12" md="6">
                        <div class="px-5 mb-5">
                            <p class="mb-2"> تاريخ انتهاء المسابقة </p>
                            <v-text-field type="date" v-model="duration" variant="outlined"></v-text-field>
                            <p class="text-error" v-if="errorMessages.duration">
                                {{ errorMessages.duration[0] }}
                            </p>
                        </div>
                    </v-col>
                </v-row>
                <div class="px-5 mb-5">
                    <p class="mb-2">تعديل محتوى المسابقة</p>
                    <editor counter_id="counter1" id="content-editor" />

                    <p class="text-error" v-if="errorMessages.content">
                        {{ errorMessages.content[0] }}
                    </p>
                </div>  
                <div class="px-5 mb-10">
                    <v-lable class="text-h6">اختر التصنيف للمناقشة</v-lable>
                    <v-select v-model="categorySelect" :items="categories" item-title="name" item-value="id" label="Select"
                        variant="outlined" multiple chips closable-chips persistent-hint>
                        <template v-slot:item="{ props }">
                            <v-list-item v-bind="props" class="text-end"></v-list-item>
                        </template>
                    </v-select>
                    <p class="text-error" v-if="errorMessages.category">
                        {{ errorMessages.category[0] }}
                    </p>
                </div>
                <div class="px-5 text-end">
                    <v-btn color="info" :loading="updateLoading" @click="updateCompetition">تعديل مسابقة</v-btn>
                </div>
            </v-container>
        </v-card>
    </v-container>
</template>
        
<script setup >
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import auth from "../../../middleware/auth";



definePageMeta({
    layout: "dashboard",
    middleware: ["auth", "is-admin"],
});

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();
const route = useRoute();

const updateLoading = ref(false);

const title = ref();
const prize = ref();
const susponsor_image = ref();
const susponsor_link = ref();

const points = ref();
const duration = ref();
const categories = ref();
const content = ref();
const categorySelect = ref([]);
const competition = ref();


function uploadSusponsor($event) {
    susponsor_image.value = $event.target?.files[0];
    competition.value.sponsor_image = URL.createObjectURL(susponsor_image.value);
}
function uploadPrize($event) {
    prize.value = $event.target?.files[0];
    competition.value.prize_image =  URL.createObjectURL(prize.value);
    // points.value=4654;
}

const { data, error } = await useSendRequest("/admin/competitions/competitionInfo", {
    competition_id: route.params.id,
    token: authStore.token
});
if (error.value) {
    setToastMessage(error.value.message);
} else if (data.value?.status) {
    competition.value = data.value.data;
    title.value = competition.value.title;
    points.value = competition.value.points;
    duration.value = competition.value.duration;
    competition.value.categories.forEach(element => {
        categorySelect.value.push(element.category_id);
    });
    // content.value = competition.value.question;
    // if(process.client){
    //     let myContainer = document.getElementById("content-editor");
    //   myContainer.innerHTML = competition.value.question;
    // }

    let interval = setInterval(()=>{
        let myContainer = document.getElementById("content-editor");
        if(myContainer){
            myContainer.innerHTML = competition.value.question;
            clearInterval(interval)
        }
    },100)
}

const { data: dataCat, error: errorCat } = await useSendRequest("/categories", {});
if (errorCat.value) {
    setToastMessage(errorCat.value.message);
} else if (dataCat.value?.status) {
    categories.value = dataCat.value.data;
}

const errorMessages = reactive({
    // title: [],
    // prize: [],
    points: [],
    duration: [],
    content: [],
    category: [],
});

function clearError() {
    // errorMessages.prize = [];
    // errorMessages.title = [];
    errorMessages.points = [];
    errorMessages.duration = [];
    errorMessages.content = [];
    errorMessages.category = [];
}

async function updateCompetition() {
    clearError();
    
    if (!points.value) {
        errorMessages.points.push('الرجاء ادخال نقاط المسابقة')
    }
    if (!duration.value) {
        errorMessages.duration.push('الرجاء ادخال تاريخ انتهاء المسابقة')
    }
    const content = document.getElementById("content-editor")?.innerHTML;
    console.log(content);
    if (!content) {
        errorMessages.content.push('الرجاء ادخال محتوى المسابقة')
    }
    if (!categorySelect.value) {
        errorMessages.category.push('الرجاء تصنيف المسابقة')
    }

    if (!points.value || !duration.value || !categorySelect.value) {
        return;
    }

    
    updateLoading.value = true;
    const formdata = new FormData();
    formdata.append('token', JSON.stringify(authStore.token));
    formdata.append('duration', duration.value);
    formdata.append('points', points.value);
    formdata.append('content', content);
    formdata.append('competition_id', route.params.id);
    formdata.append('category_ids', categorySelect.value);
    formdata.append('title', title.value);
    formdata.append('susponsor_link', susponsor_link.value);
    formdata.append('susponsor_image', susponsor_image.value);
    formdata.append('prize_image', prize.value);

    const { data, error } = await useSendRequest(
        '/admin/competitions/update',
        formdata
    )

    if (error.value) {
        setToastMessage(error.value.message)
    } else if (data.value?.status) {
        setToastMessage(data.value?.message);
        navigateTo('/admin/competition')
    } else {
        const errors = data.value?.errors || [];
        for (let i = 0; i < errors.length; i++) {
            const obj = errors[i];
            if (obj.filed_name == "title") {
                errorMessages.title = obj.message;
            } else if (obj.filed_name == "duration") {
                errorMessages.duration = obj.message;
            } else if (obj.filed_name == "points") {
                errorMessages.points = obj.message;
            } else if (obj.filed_name == "susponsor_link") {
                errorMessages.susponsor_link = obj.message;
            } else if (obj.filed_name == "susponsor_image") {
                errorMessages.susponsor_image = obj.message;
            } else if (obj.filed_name == "prize") {
                errorMessages.prize = obj.message;
            } else if (obj.filed_name == "question") {
                errorMessages.content = obj.message;
            } else if (obj.filed_name == "category") {
                errorMessages.category = obj.message;
            }
        }
    }
    updateLoading.value = false;
}




</script>
    
<style> scoped>.content img {
     max-width: 100%;
     max-height: 500px;
 }
</style>
      