<template>
    <v-container>
        <v-card>
            <v-card-title class="text-h6 mt-10 font-weight-bold text-start">
                <v-icon icon="mdi-plus"></v-icon>
                إضافة لافتة جديدة
            </v-card-title>
            <v-container>
                <v-row>
                    <v-col md="4" cols="12">
                        <!-- <v-label class="text-h6">صورة اللافتة</v-label> -->
                        <v-file-input label="صورة اللافتة" @change="uploudFile($event)"></v-file-input>
                        <p class="text-error" v-if="errorMessages.cover">
                            {{ errorMessages.cover[0] }}
                        </p>
                        <div style="margin: auto; width:70%">
                            <img ref="previewImage" style="width: 100%; padding: 0" />
                        </div>
                        
                    </v-col>
                    <v-col md="4" cols="12">
                        <!-- <v-label class="text-h6">رابط اللافتة</v-label> -->
                        <v-text-field label="الرابط الخاص باللافتة" v-model="banner_url"></v-text-field>
                        <p class="text-error" v-if="errorMessages.url">
                            {{ errorMessages.url[0] }}
                        </p>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md="6" cols="12">
                        <v-select clearable class="text-center" v-model="banner_type" item-value="value" item-title="state"
                            label="القسم" :items="types" variant="outlined">
                            <template v-slot:item="{ props }">
                                <v-list-item class="text-end" v-bind="props"></v-list-item>
                            </template>
                        </v-select>
                        <p class="text-error" v-if="errorMessages.type">
                            {{ errorMessages.type[0] }}
                        </p>
                    </v-col>
                    <!-- <v-col md="4" cols="12">
                        <v-text-field type="number" label="الترتيب" v-model="banner_order"></v-text-field>
                        <p class="text-error" v-if="errorMessages.order">
                            {{ errorMessages.order[0] }}
                        </p>
                    </v-col> -->
                </v-row>
                <v-row class="justify-end">
                    <v-btn color="red-darken-3 my-10" @click="$router.push('/admin/banners')">إغلاق</v-btn>
                    <v-btn color="primary ma-10" :loading="addLoading" @click="addBanner">أضف لافتة</v-btn>
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
const image = ref('');
const previewImage = ref();

function uploudFile($event: any) {
    image.value = $event.target?.files[0];
    previewImage.value.src = URL.createObjectURL($event.target?.files[0]);
}

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();
const types = [
    { state: 'المقالات', value: 'blog' },
    { state: 'المناقشات', value: 'discussion' },
    { state: 'الاستطلاعات', value: 'survey' },
    { state: 'المكتبة', value: 'library' },
    { state: 'الاختبارات', value: 'test' },
    { state: 'المسابقات', value: 'competition' },
    { state: 'الخدمات', value: 'service' },
    { state: 'الاستشارات', value: 'consultation' },
]

const banner_url = ref('');
const banner_type = ref('');
// const banner_order = ref();

const type = ref('')
const addLoading = ref(false);
const errorMessages = reactive({
    cover: [] as string[],
    url: [] as string[],
    type: [] as string[],
    // order: [] as string[],
});

function clearError() {
    errorMessages.cover = [];
    errorMessages.url = [];
    errorMessages.type = [];
    // errorMessages.order = [];
}

async function addBanner() {
    addLoading.value = true;
    clearError();

    const formdata = new FormData();
    formdata.append("url", banner_url.value);
    formdata.append("cover", image.value);
    formdata.append("type", banner_type.value);
    // formdata.append("order", banner_order.value);
    formdata.append("token", JSON.stringify(authStore.token as any));


    const { data, error } = await useSendRequest<responseReturn>(
        '/admin/banners/add', formdata
        // {
        //     token: authStore.token,
        //     cover: image,
        //     url: banner_url.value,
        //     type: banner_type.value,
        //     order: banner_order.value
        // }
    );
    if (error.value) {
        setToastMessage(error.value.message)
    } else if (data.value?.status) {
        // addLoading.value = false;
        setToastMessage(data.value?.message as string);
        navigateTo('/admin/banners')
    } else {
        setToastMessage(data.value?.message as string);
        const errors = data.value?.errors || [];
        for (let i = 0; i < errors.length; i++) {
            const obj = errors[i] as { filed_name: string; message: string[] };
            if (obj.filed_name === "cover") {
                errorMessages.cover = obj.message;
            } else if (obj.filed_name === "url") {
                errorMessages.url = obj.message;
            } else if (obj.filed_name === "type") {
                errorMessages.type = obj.message;
            }
        }
    }

    addLoading.value = false;
}
</script>
    
<style>
.v-field__clearable {
    display: none !important;
}
</style>