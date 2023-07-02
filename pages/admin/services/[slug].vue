<template>
    <v-container>
        <v-card>
            <v-card-title class="text-h6 mt-10 font-weight-bold text-start">
                <v-icon icon="mdi-plus"></v-icon>
                تعديل خدمة
            </v-card-title>
            <v-container>
                <v-row>
                    <v-col md="6" cols="12">
                        <p class=" text-h6 font-weight-grey-darken-3">عنوان الخدمة</p>
                        <v-text-field variant="outlined" label="عنوان الخدمة" v-model="title"></v-text-field>
                    </v-col>
                    <v-col md="6" cols="12">
                        <p class=" text-h6 font-weight-grey-darken-3">الصورة المصغرة</p>

                        <v-file-input prepend-icon="" variant="outlined" @change="uploudFile($event)"
                            label="الصورة المصغرة"></v-file-input>
                        <!-- <p class="text-error" v-if="errorMessages.cover">
                            {{ errorMessages.cover[0] }}
                        </p> -->
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md="6" cols="12" class="order-md-2 order-1">
                        <div class="d-flex justify-space-between bg-blue-grey-lighten-5 pa-2" style="height: 82%;">
                            <v-img :src="previewImage" cover style="width: 80%; padding: 0"></v-img>
                        </div>

                    </v-col>

                    <v-col md="6" cols="12" class="order-md-1 order-2">
                        <p class=" text-h6 font-weight-grey-darken-3">تفاصيل الخدمة</p>
                        <v-textarea variant="outlined" label="تفاصيل الخدمة" auto-grow v-model="details"></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md="6" cols="12">
                        <p class="text-h6 font-weight-grey-darken-3">اضف صور جديدة للخدمة</p>
                        <v-file-input variant="outlined" prepend-icon="" multiple label="صور الخدمة"
                            @change="uploadImages($event)"></v-file-input>
                        <p class="text-error" v-if="errorMessages.images">
                            {{ errorMessages.images[0] }}
                        </p>
                    </v-col>
                    <v-col md="6" cols="12">
                        <p class=" text-h6 font-weight-grey-darken-3">قيمة الخدمة (النقاط)</p>
                        <v-text-field variant="outlined" type="number" label="النقاط" v-model="points"></v-text-field>
                    </v-col>
                </v-row>
                <v-row v-if="service">

                    <v-col md="6" cols="12">
                        <p>صور الخدمة الحالية</p>
                        <v-carousel  hide-delimiters>
                            <template v-slot:prev="{props}">
                                <v-btn v-bind="props" icon="mdi-chevron-right" color="white"></v-btn>
                            </template>
                            <template v-slot:next="{props}">
                                <v-btn v-bind="props" icon="mdi-chevron-left" color="white"></v-btn>
                            </template>
                            <v-carousel-item v-for="image in service.images" :key="image.id">
                                <v-img :src="image.file_name" cover style="max-height: 500px;"></v-img>
                            </v-carousel-item>


                        </v-carousel>
                    </v-col>
                </v-row>
                <v-row class="justify-end">
                    <v-btn color="red-darken-3 my-10" @click="$router.push('/admin/services')">إغلاق</v-btn>
                    <v-btn color="primary ma-10" :loading="updateLoading" @click="updateService()">تعديل الخدمة</v-btn>
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
const route = useRoute();

const image = ref<File | null>('');
const previewImage = ref('');
const files = ref([]);
const imageLabel = ref('الصورة المصغرة')

const title = ref('');
const points = ref();
const details = ref('');

const service = ref();


const errorMessages = reactive({
    title: [] as string[],
    details: [] as string[],
    points: [] as string[],
    cover: [] as string[],
    images: [] as string[],
});
const updateLoading = ref(false);

function uploudFile($event: any) {
    image.value = $event.target?.files[0];
    previewImage.value = URL.createObjectURL($event.target?.files[0]);
    imageLabel.value = image.value.name;
    console.log(image.value);
    console.log(imageLabel.value);
}

function deleteImage() {
    image.value = null;
    previewImage.value = '';
    imageLabel.value = 'الصورة المصغرة';
}

function uploadImages($event: any) {

    files.value = [];
    for (let i = 0; i < $event.target?.files.length; i++) {
        files.value.push($event.target?.files[i]);
    }
}

function deleteImages() {
    files.value = [];
}

(async () => {
    const { data, error } = await useSendRequest<responseReturn>(
        "/admin/services/getServiceInfo",
        {
            slug: route.params.slug,
            token: authStore.token
        }
    )

    if (error.value) {
        setToastMessage(error.value.message)
    } else if (data.value?.status) {
        service.value = data.value.data;
        title.value = service.value.title;
        points.value = service.value.points;
        details.value = service.value.details;
        previewImage.value = service.value.cover;
    } else {
        setToastMessage(data.value?.message as string);
    }

})();

function clearError() {
    errorMessages.cover = [];
    errorMessages.title = [];
    errorMessages.details = [];
    errorMessages.images = [];
    errorMessages.points = [];
}

async function updateService() {
    updateLoading.value = true;
    clearError();

    const formdata = new FormData();
    formdata.append('token', JSON.stringify(authStore.token));
    formdata.append('title', title.value);
    formdata.append('slug', route.params.slug);
    formdata.append('details', details.value);
    formdata.append('points', points.value);
    formdata.append('cover', image.value);
    for (let i = 0; i < files.value.length; i++) {
        formdata.append('images[]', files.value[i]);
    }

    const { data, error } = await useSendRequest<responseReturn>(
        '/admin/services/update',
        formdata
    )

    if (error.value) {
        setToastMessage(error.value.message)
    } else if (data.value?.status) {
        setToastMessage(data.value?.message);
        navigateTo('/admin/services');
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
    updateLoading.value = false;
}
</script>
    
<style>
.v-field__clearable {
    display: none !important;
}
</style>