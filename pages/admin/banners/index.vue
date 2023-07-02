<template>
    <div>
        <v-alert color="error" v-if="generalError">{{ generalError }}</v-alert>

        <div>
            <v-card style="min-height: 100vh" border color="" class="pt-10" rounded elevation="2">
                <v-card-title class="text-h6 font-weight-bold text-start">
                    <v-icon icon="mdi-google-ads"></v-icon> التحكم في اللافتات
                    الموقع
                </v-card-title>
                <v-container>
                    <v-row class="justify-start">
                        <v-btn color="grey-darken-4 ma-10" @click="$router.push('/admin/banners/add')" prepend-icon="mdi-plus">أضف لافتة جديدة</v-btn>
                    </v-row>
                    <v-sheet border style="overflow-x: auto">
                        <v-table class="" hover>
                            <thead>
                                <tr>
                                    <th class="text-">#</th>
                                    <th class="text-">صورة اللافتة </th>
                                    <th class="text-">القسم</th>
                                    <th class="text">الاجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in currentShown" :key="item">
                                    <td>{{ index + 1 }}</td>
                                    <td>
                                        <v-img class="img" :src="item.cover" alt=""></v-img>
                                    </td>
                                    <td>{{ item.type }}</td>
                                    <td>
                                        <v-btn color="error" prepend-icon="mdi-delete" class="me-4" size="small"
                                            @click="showDeleteDialog(item.id)">حذف</v-btn>
                                        <v-btn color="primary" size="small" prepend-icon="mdi-pencil" @click="$router.push('/admin/banners/' + item.id)">تعديل</v-btn>
                                        <!-- @click="$router.push('/admin/banners/' + item.id)" -->
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                        <v-alert class="ma-3" type="info" v-if="banners.length == 0">لا يوجد نتائج  </v-alert>

                    </v-sheet>
                    <div class="text-center" v-if="lengthPaginate > 1">
                        <v-container>
                            <v-row justify="center">
                                <v-col cols="8">
                                    <v-container class="max-width">
                                        <v-pagination next-icon="mdi-arrow-left-bold-circle"
                                            prev-icon="mdi-arrow-right-bold-circle" rounded="circle" dir="rtl"
                                            v-model="page" class="my-4" :length="lengthPaginate"></v-pagination>
                                    </v-container>
                                </v-col>
                            </v-row>
                            <!-- <div>{{ page }}</div> -->
                        </v-container>
                    </div>
                </v-container>
            </v-card>
        </div>
        <v-dialog v-model="isDeleteDialogShow" persistent width="300px">
            <v-card elevation="10">
                <v-card-text class="text-end">
                    هل انت متاكد من حذف هذه اللافتة
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="black" variant="outlined" @click="() => {
                        isDeleteDialogShow = false;
                        bannerWantDelete = -1;
                    }
                        ">إغلاق</v-btn>
                    <v-btn variant="flat" color="primary" @click="confirmDelete" :loading="loadingDelete">تأكيد</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
const banners = ref();
const itemPerPage = ref(10);
const page = ref(1);

const bannerWantDelete = ref();
const isDeleteDialogShow = ref(false);
const loadingDelete = ref(false);

const generalError = ref();




const { data, error } = await useSendRequest<responseReturn>(
    '/admin/banners/getAllBanners',
    { token: authStore.token }
)

if (error.value) {
    setToastMessage(error.value.message)
} else if (data.value?.status) {
    banners.value = data.value.data;
} else {
    setToastMessage(data.value?.message as string);
}

const filteredArray = computed(() => {
    // if (statusFillter.value === "active") {
    //     return banners.value.filter((item: any) => {
    //         return item.status === "active";
    //     });
    // } else if (statusFillter.value === "pending")
    //     return banners.value.filter((item: any) => {
    //         return item.status === "pending";
    //     });
    return banners.value;
});

const lengthPaginate = computed(() => {
    return Math.ceil(filteredArray.value.length / itemPerPage.value);
});

const currentShown = computed(() => {
    var startIndex = (page.value - 1) * itemPerPage.value;
    var endIndex = page.value * itemPerPage.value;
    return filteredArray.value.slice(startIndex, endIndex);
});

const showDeleteDialog = (id: number) => {
    bannerWantDelete.value = id;
    isDeleteDialogShow.value = true;
};

const confirmDelete = async () => {
    loadingDelete.value = true;
    const { data, error } = await useSendRequest<responseReturn>(
        "/admin/banners/delete",
        {
            banner_id: bannerWantDelete.value,
            token: authStore.token,
        }
    );
    if (error.value) {
        setToastMessage(error.value.message);
    } else if (data.value?.status) {
        isDeleteDialogShow.value = false;
        setToastMessage("تم حذف اللافتة بنجاح" as string);
        banners.value = banners.value.filter((item: any) => {
            return item.id !== bannerWantDelete.value;
        });
        bannerWantDelete.value = -1;
    } else {
        setToastMessage("حدث خطا ما" as string);
    }
    loadingDelete.value = false;
};
</script>
    
<style></style>