<template>
    <v-container>
        <v-card>
            <v-card-title class="text-h6 mt-10 font-weight-bold text-start">
                <v-icon icon="mdi-plus"></v-icon>
                إضافة خدمة جديدة
            </v-card-title>
            <v-container>
                <v-row>
                    <v-col md="6" cols="12">
                        <p class="mb-4 text-h6 font-weight-grey-darken-3">عنوان الخدمة</p>
                        <v-text-field variant="outlined" label="عنوان الخدمة" v-model="title"></v-text-field>
                        <p class="text-error" v-if="errorMessages.title">
                            {{ errorMessages.title[0] }}
                        </p>
                    </v-col>

                    <v-col md="6" cols="12">
                        <p class="mb-4 text-h6 font-weight-grey-darken-3">الصورة المصغرة</p>

                        <v-file-input clearable="true"  prepend-icon="" variant="outlined" @change="uploudFile($event)"
                            label="صورة مصغرة" >
                            </v-file-input>
                        <p class="text-error" v-if="errorMessages.cover">
                            {{ errorMessages.cover[0] }}
                        </p>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md="6" cols="12" class="order-md-2 order-1">
                        <div class="d-flex justify-space-between bg-blue-grey-lighten-5 pa-2" style="height: 82%;" v-if="image">
                            <img :src="image ? previewImage : ''" cover style="width: 80%; padding: 0" />
                            
                        </div>
                    </v-col>
                    <v-col md="6" cols="12" class="order-md-1 order-2 ">
                        <p class="mb-4 text-h6 font-weight-grey-darken-3">تفاصيل الخدمة</p>
                        <v-textarea variant="outlined" label="تفاصيل الخدمة" auto-grow v-model="details"></v-textarea>
                        <p class="text-error" v-if="errorMessages.details">
                            {{ errorMessages.details[0] }}
                        </p>
                    </v-col>

                </v-row>
                <v-row>
                    <v-col md="6" cols="12">
                        <p class="mb-4 text-h6 font-weight-grey-darken-3">صور الخدمة</p>
                        <v-file-input prepend-icon="" variant="outlined" multiple label="صور الخدمة"
                            @change="uploadImages($event)"></v-file-input>
                        <p class="text-error" v-if="errorMessages.images">
                            {{ errorMessages.images[0] }}
                        </p>
                        <!-- <v-btn absolute top right v-if="files.length > 0" @click="deleteImages()" color="red">حذف
                            الصور</v-btn> -->
                            
                        <!-- <v-file-input clearable v-model="files" placeholder="Upload your documents" label="File input" multiple
                            prepend-icon="mdi-paperclip">
                            
                            <template v-slot:selection="{ fileNames }">
                                <template v-for="fileName in fileNames" :key="fileName">
                                    <v-chip size="small" label color="primary" class="me-2">
                                        {{ fileName }}
                                    </v-chip>
                                </template>
                            </template>
                        </v-file-input> -->
                    </v-col>
                    <v-col md="6" cols="12">
                        <p class="mb-4 text-h6 font-weight-grey-darken-3">قيمة الخدمة (النقاط)</p>
                        <v-text-field variant="outlined" type="number" label="النقاط" v-model="points"></v-text-field>
                        <p class="text-error" v-if="errorMessages.points">
                            {{ errorMessages.points[0] }}
                        </p>
                    </v-col>
                </v-row>
                <v-row class="justify-end">
                    <v-btn color="red-darken-3 my-10" @click="$router.push('/admin/services')">إغلاق</v-btn>
                    <v-btn color="primary ma-10" :loading="addLoading" @click="addService()">أضف خدمة</v-btn>
                </v-row>
            </v-container>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";
definePageMeta({
    layout: "dashboard",
    middleware: ["auth", "is-admin"],
});

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();

const image = ref<File | null>();
const previewImage = ref('');
const files = ref([]);
const imageLabel = ref('الصورة المصغرة');
const title = ref('');
const details = ref('');
const points = ref('');


const errorMessages = reactive({
    title: [] as string[],
    details: [] as string[],
    points: [] as string[],
    cover: [] as string[],
    images: [] as string[],
});
const addLoading = ref(false);

function uploudFile($event: any) {
    image.value = $event.target?.files[0];
    previewImage.value = URL.createObjectURL($event.target?.files[0]);
    imageLabel.value = image.value.name;
}

function uploadImages($event: any) {

    files.value = [];
    for (let i = 0; i < $event.target?.files.length; i++) {
        files.value.push($event.target?.files[i]);
    }
}

function deleteImage() {
     imageLabel.value = 'الصورة المصغرة';
    image.value = null;
    previewImage.value = '';
}

function deleteImages() {
    files.value = [];
}

function clearError() {
    errorMessages.cover = [];
    errorMessages.title = [];
    errorMessages.details = [];
    errorMessages.images = [];
    errorMessages.points = [];
}

async function addService() {
    clearError();
    addLoading.value = true;
    const formdata = new FormData();
    formdata.append('token', JSON.stringify(authStore.token));
    formdata.append('title', title.value);
    formdata.append('details', details.value);
    formdata.append('points', points.value);
    formdata.append('cover', image.value);

    for (let i = 0; i < files.value.length; i++) {
        formdata.append('images[]', files.value[i]);
    }

    const { data, error } = await useSendRequest<responseReturn>(
        '/admin/services/add',
        formdata
    )

    if (error.value) {
        setToastMessage(error.value.message)
    } else if (data.value?.status) {
        setToastMessage(data.value?.message as string);
        navigateTo('/admin/services')
    } else {
        const errors = data.value?.errors || [];
        for (let i = 0; i < errors.length; i++) {
            const obj = errors[i] as { filed_name: string; message: string[] };
            if (obj.filed_name === "cover") {
                errorMessages.cover = obj.message;
            } else if (obj.filed_name === "title") {
                errorMessages.title = obj.message;
            } else if (obj.filed_name === "details") {
                errorMessages.details = obj.message;
            } else if (obj.filed_name === "points") {
                errorMessages.points = obj.message;
            } else if (obj.filed_name === "images") {
                errorMessages.images = obj.message;
            }
        }
    }
    addLoading.value = false;
}




</script>
    
<style>
.v-field__clearable {
    display: none !important;
}</style>