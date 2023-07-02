<template>
    <v-container>
        <v-card>
            <v-card-title class="text-h6 mt-10 mb-5 font-weight-bold text-start">
                إضافة مسابقة جديدة جديدة
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
                    <p class="mb-2">اضف محتوى المسابقة</p>
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
                    <v-btn color="info" :loading="addLoading" @click="addCompetition">اضافة مسابقة</v-btn>
                </div>
            </v-container>
        </v-card>
    </v-container>
</template>

<script setup >
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";

definePageMeta({
    layout: "dashboard",
    middleware: ["auth", "is-admin"],
});

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();



const addLoading = ref(false);
const title = ref();
const prize = ref();
const susponsor_image = ref();
const susponsor_link = ref();
// const content = ref();
const points = ref();
const duration = ref();
const categories = ref();
const categorySelect = ref();
const image = ref('');


function uploadSusponsor($event) {
    susponsor_image.value = $event.target?.files[0];
}
function uploadPrize($event) {
    prize.value = $event.target?.files[0];
    // points.value=4654;
}


const { data, error } = await useSendRequest("/categories", {});
if (error.value) {
    setToastMessage(error.value.message);
} else if (data.value?.status) {
    categories.value = data.value.data;
}

const errorMessages = reactive({
    title: [],
    prize: [],
    points: [],
    duration: [],
    content: [],
    category: [],
});

function clearError() {
    errorMessages.title = [];
    errorMessages.prize = [];
    errorMessages.points = [];
    errorMessages.duration = [];
    errorMessages.content = [];
    errorMessages.category = [];
}

async function addCompetition() {
    clearError();
    if (!title.value) {
        errorMessages.title.push('الرجاء ادخال عنوان المسابقة')
    }
    if (!prize.value) {
        errorMessages.prize.push('الرجاء ارفاق صورة الجائزة')
    }
    if (!points.value) {
        errorMessages.points.push('الرجاء ادخال نقاط المسابقة')
    }
    if (!duration.value) {
        errorMessages.duration.push('الرجاء ادخال تاريخ انتهاء المسابقة')
    }
    const content = document.getElementById("content-editor")?.innerHTML;
    if (!content) {
        errorMessages.content.push('الرجاء ادخال محتوى المسابقة')
    }
    if (!categorySelect.value) {
        errorMessages.category.push('الرجاء تصنيف المسابقة')
    }

    if (!title.value || !prize.value || !points.value || !duration.value || !content || !categorySelect.value) {
        return;
    }

    addLoading.value = true;
    const formdata = new FormData();
    formdata.append('token', JSON.stringify(authStore.token));
    formdata.append('title', title.value);
    formdata.append('duration', duration.value);
    formdata.append('points', points.value);
    formdata.append('susponsor_link', susponsor_link.value);
    formdata.append('susponsor_image', susponsor_image.value);
    formdata.append('prize', prize.value);
    formdata.append('content', content);
    formdata.append('category_ids', categorySelect.value);

    const { data, error } = await useSendRequest(
        '/admin/competitions/add',
        formdata
    )

    if (error.value) {
        setToastMessage('حدث خظا ما')
    } else if (data.value?.status) {
        setToastMessage('تم اضافة المسابقة بنجاح');
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
            } else if (obj.filed_name == "content") {
                errorMessages.content = obj.message;
            } else if (obj.filed_name == "category_ids") {
                errorMessages.category = obj.message;
            }
        }
    }
    addLoading.value = false;
}




</script>
    
<style>
.v-text-field .v-input__details {
    display: none;
}

.v-file-input .v-input__details {
    display: none;
}
</style>