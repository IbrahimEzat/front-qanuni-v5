<template>
    <div>
        <v-container>
            <v-card style="min-height: 100vh" border color="" class="pt-10" rounded elevation="2">
                <v-card-title class="text-h6 font-weight-bold text-start">
                    <v-icon icon="mdi-post-outline"></v-icon>تعديل المكتبة</v-card-title>
                <div style="width:90%; margin: auto">
                    <div class="d-flex mb-5">
                        <div style="width: 20%;">
                            <v-lable class="text-subtitle-1">صورة الغلاف</v-lable>
                            <div>
                                <v-img :src="library.file_cover"></v-img>
                            </div>
                        </div>
                        <div class="mx-10" style="width: 40%;">
                            <v-lable class="text-subtitle-1">عنوان المكتبة</v-lable>
                            <v-text-field disabled variant="outlined">{{ library.file_name }}</v-text-field>
                        </div>
                    </div>
                    <v-row>
                        <v-col cols="3">
                            <v-lable class="text-subtitle-1">عدد الصفحات</v-lable>
                            <v-text-field disabled variant="outlined">{{ library.num_of_pages }}</v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-lable class="text-subtitle-1">اسم المؤلف</v-lable>
                            <v-text-field disabled variant="outlined">{{ library.author_name }}</v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-lable class="text-subtitle-1">تاريخ الإصدار</v-lable>
                            <v-text-field type="date" disabled variant="outlined"
                                :value="library.release_date"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-lable class="text-subtitle-1">المستخدم الذي أضاف المكتبة</v-lable>
                            <!-- <v-text-field disabled variant="outlined">ششش</v-text-field> -->
                            <v-text-field disabled variant="outlined">{{ library.user.name }}</v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <v-lable class="text-subtitle-1">نوع الملف</v-lable>
                            <v-select :items="items" disabled :label="library.file_property.file_type"
                                variant="outlined"></v-select>
                        </v-col>
                        <v-col cols="4">
                            <v-lable class="text-subtitle-1">حجم الملف</v-lable>
                            <v-text-field disabled variant="outlined">{{ library.file_property.file_size +
                                'جيجا' }}</v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-lable class="text-subtitle-1">حقوق الملكية</v-lable>
                            <v-select :items="property_rights" disabled :label="property_right"
                                variant="outlined"></v-select>
                        </v-col>
                    </v-row>
                    <div class="mb-5">
                        <v-lable class="font-weight-regular">نبذة عن المؤلف</v-lable>
                        <div class="border pa-2 content" v-html=" library.about_library.about_author"></div>
                    </div>

                    <div class="mb-5">
                        <v-lable class="font-weight-regular">نبذة عن الملف</v-lable>
                        <div class="border pa-2 content" v-html="library.about_library.about_file "></div>
                    </div>
                    <div class="d-flex mb-5">
                        <div style="width: 20%;">
                            <v-lable class="text-subtitle-1">صورة المؤلف</v-lable>
                            <div>
                                <v-img :src="library.about_library.author_image"></v-img>
                            </div>
                        </div>
                        <div class="mx-10" style="width:40%">
                            <v-lable class="text-subtitle-1">الملف</v-lable>
                            <v-file-input disabled :label="fileName" variant="outlined"></v-file-input>
                        </div>
                    </div>
                    <p class="text-error" v-if="errorMessages.points">
                        {{ errorMessages.points[0] }}
                    </p>
                    <v-label class="text-h6 ">أدخل النقاط الخاصة بالمكتبة</v-label>
                    <v-text-field type="number" v-model="points" required placeholder="النقاط"
                        variant="outlined"></v-text-field>
                    <div>
                        <p class="text-error" v-if="errorMessages.categories">
                            {{ errorMessages.categories[0] }}
                        </p>
                        <v-lable class="text-h6">اختر التصنيف للمقالة</v-lable>
                        <v-select v-model="categorySelect" :items="categories" item-title="name" item-value="id"
                            label="Select" variant="outlined" multiple chips closable-chips persistent-hint>
                            <template v-slot:item="{ props }">
                                <v-list-item v-bind="props" class="text-end"></v-list-item>
                            </template>
                        </v-select>
                    </div>
                </div>

                <div class="d-flex justify-space-between ma-10">
                    <div style="">
                        <v-btn variant="outlined" class="" @click="$router.push('/admin/library')"
                            style="color: white; background-color: rgb(241, 82, 82)">
                            <p class="text-h6">إغلاق</p>
                        </v-btn>
                    </div>
                    <div style="">
                        <v-btn variant="outlined" class="mx-2" @click="updateLibrary()" :loading="updateLoading"
                            style="color: white; background-color: rgb(28, 173, 76)">
                            <p class="text-h6">تعديل الملف</p>
                        </v-btn>

                        <v-btn variant="outlined" class="mx-2" :loading="activeLoading" @click="activeLibrary()"
                            :disabled="library.status === 'active'"
                            style="color: white; background-color: rgb(71, 28, 173)">
                            <p class="text-h6">اعتماد الملف</p>
                        </v-btn>
                    </div>

                </div>

            </v-card>
        </v-container>

    </div>
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


const categorySelect = ref();
const categories = ref();
const points = ref();

const route = useRoute();

const activeLoading = ref(false);
const updateLoading = ref(false);

let fileName = ref();
const items = ['pdf', 'docx', 'image', 'paper'];
const property_rights = ['رفعه المؤلف بنفسه', 'مكلية عامة', 'غير مسموح بنشره رقميا', 'سمح بنشره رقميا']
const property_right = ref();
const library = ref();

const errorMessages = reactive({
    points: [] as string[],
    categories: [] as string[],
});

const { data, error } = await useSendRequest<responseReturn>(
    "/admin/library/getLibraryInfo",
    {
        token: authStore.token,
        library_id: route.params.id
    }
);
if (error.value) {
    setToastMessage(error.value.message);
}
if (data.value?.status) {
    library.value = data.value.data;
    let arr = library.value.about_library.file.split("/")
    fileName = arr[arr.length - 1];
    points.value = library.value.points;
    switch (library.value.file_property.property_rights) {
        case 'allow':
            property_right.value = property_rights[3];
            break;
        case 'author':
            property_right.value = property_rights[0];
            break;
        case 'public':
            property_right.value = property_rights[1];
            break;
        default:
            property_right.value = property_rights[2];
            break;
    }

} else {
    setToastMessage(data.value?.message as string);
}

(async () => {
    const { data, error } = await useSendRequest<responseReturn>(
        "/categories",
        { token: authStore.token }
    );
    if (error.value) {
        setToastMessage(error.value.message);
        return;
    }
    if (data.value?.status) {
        categories.value = data.value.data;
    } else {
        setToastMessage(data.value?.message as string);
    }
})();

(async () => {
    const { data, error } = await useSendRequest<responseReturn>(
        "/admin/library/getCategories",
        {
            library_id: route.params.id,
            token: authStore.token
        }
    );
    if (error.value) {
        setToastMessage(error.value.message);
        return;
    }
    if (data.value?.status) {
        categorySelect.value = data.value.data;
    } else {
        setToastMessage(data.value?.message as string);
    }
})();

function clearError() {
    errorMessages.categories = [];
    errorMessages.points = [];
}
async function activeLibrary() {
    clearError()
    activeLoading.value = true;
    const { data, error } = await useSendRequest<responseReturn>(
        "/admin/library/activateLibrary",
        {
            token: authStore.token,
            library_id: route.params.id,
        }
    )

    if (error.value) {
        setToastMessage(error.value.message);
        activeLoading.value = false;
        return;
    }
    if (data.value?.status) {
        library.value.status = 'active';
        setToastMessage('تم تفعيل المكتبة بنجاح');
        sendAcceptNotification(data.value.data);
    } else {
        setToastMessage(data.value?.message as string);
    }
    activeLoading.value = false;
}
async function sendAcceptNotification(dataNotify:any){
  useSendRequest('/notificatoin/accept-file',{
    'dataNotify':dataNotify
  })
}
async function updateLibrary() {
    clearError()
    updateLoading.value = true;
    const { data, error } = await useSendRequest<responseReturn>(
        "/admin/library/update",
        {
            token: authStore.token,
            library_id: route.params.id,
            points: points.value,
            categories: categorySelect.value,
        }
    )

    if (error.value) {
        setToastMessage(error.value.message);
        updateLoading.value = false;
        return;
    }
    if (data.value?.status) {
        setToastMessage('تم تعديل المكتبة بنجاح');
    } else {
        setToastMessage(data.value?.message as string);
        const errors = data.value?.errors || [];
        for (let i = 0; i < errors.length; i++) {
            const obj = errors[i] as { filed_name: string; message: string[] };
            if (obj.filed_name === "categories") {
                errorMessages.categories = obj.message;
            } else if (obj.filed_name === "points") {
                errorMessages.points = obj.message;
            }
        }
    }
    updateLoading.value = false;
}

</script>
<style scoped>
.content img {
  max-width: 100%;
  max-height: 500px;
}
</style>