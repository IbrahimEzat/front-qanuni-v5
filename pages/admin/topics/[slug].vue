<template>
    <div>
        <v-container style="border: 1px solid grey; border-radius: 5px;">
            <label for="">أضف اسم الكلمة المفتاحية</label>
            <v-text-field v-model="name"></v-text-field>
            <p class="text-error" v-if="errorMessages.name">
                {{ errorMessages.name[0] }}
            </p>
            <label for="">أضف صورة جديدة للكلمة المفتاحية</label>
            <v-file-input label="File input" @change="uploadImage($event)"></v-file-input>
            <p class="text-error" v-if="errorMessages.images">
                {{ errorMessages.images[0] }}
            </p>

            <div class="my-4">
                <label class="me-3"> الصورة الحالية: </label>
                <v-img :src="topicInfo.image" style="max-width: 200px; max-height: 200px;"></v-img>
            </div>

            <div class="d-flex">
                <label class="me-3 mt-2"> اختر القسم </label>
                <v-select v-model="dataType" style="max-width: 250px" variant="outlined" density="compact" item-title="name"
                    item-value="value" :items="[
                        { name: 'المقالات', value: 'blog' },
                        { name: 'المناقشات', value: 'disscusion' },
                        { name: 'المكتبة', value: 'library' },
                        { name: 'الاستطلاعات', value: 'survey' },
                        { name: 'المسابقات', value: 'competition' },
                        { name: 'الاختبارات', value: 'exam' },
                    ]">
                    <template v-slot:item="{ props }">
                        <v-list-item v-bind="props" class="text-end"></v-list-item>
                    </template>
                </v-select>
            </div>
            <div style="text-align: end">
                <v-btn :loading="addLoading" variant="outlined" class="rounded-pill mt-3" @click="updateTopic"
                    style="color: white; background-color: rgb(28, 173, 76)">
                    <p class="text-h6">تعديل</p>
                </v-btn>
                <v-btn variant="outlined" class="rounded-pill mt-3" @click="$router.push('/admin/topics')"
                    style="color: white; background-color: rgb(179, 23, 23)">
                    <p class="text-h6">إغلاق</p>
                </v-btn>
            </div>
        </v-container>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["auth"],
    layout: "dashboard",
});
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
import { responseReturn } from "~/types/tpes";
const authStore = useAuthStore();
const route = useRoute();
const { setToastMessage } = useSettingsStore();
const dataType = ref('')
const addLoading = ref(false);
const name = ref('');
const image = ref<File | null>();
const errorMessages = reactive({
    name: [] as string[],
    images: [] as string[],
});

const topicInfo = ref();

const { data, error } = await useSendRequest('/topics-details', {
    slug: route.params.slug,
    token: authStore.token,
});

if (error.value) {
    setToastMessage(error.value.message)
} else if (data.value?.status) {
    topicInfo.value = data.value.data;
    name.value = topicInfo.value.name;
    dataType.value = topicInfo.value.type;
} else {
    setToastMessage('حدث خطأ ما');
    navigateTo('/admin/topics');
}

function clearError() {
    errorMessages.name = [];
    errorMessages.images = [];
}

async function updateTopic() {
    clearError()
    addLoading.value = true;

    const formdata = new FormData();
    formdata.append('token', JSON.stringify(authStore.token));
    formdata.append('slug', route.params.slug as string);
    formdata.append('name', name.value);
    formdata.append('type', dataType.value);
    formdata.append('image', image.value as any);

    const { data, error } = await useSendRequest<responseReturn>(
        '/admin/topics/update',
        formdata
    )
    if (error.value) {
        setToastMessage(error.value.message)
    } else if (data.value?.status) {
        setToastMessage(data.value?.message as string);
        navigateTo('/admin/topics')
    } else {
        const errors = data.value?.errors || [];
        for (let i = 0; i < errors.length; i++) {
            const obj = errors[i] as { filed_name: string; message: string[] };
            if (obj.filed_name === "name") {
                errorMessages.name = obj.message;
            } else if (obj.filed_name === "image") {
                errorMessages.images = obj.message;
            }
        }
    }
    addLoading.value = false;

}
function uploadImage($event: any) {
    image.value = $event.target?.files[0];
}

</script>