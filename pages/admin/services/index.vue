<template>
    <div>
        <!-- <v-alert color="error" v-if="generalError">{{ generalError }}</v-alert> -->

        <div>
            <v-card style="min-height: 100vh" border color="" class="pt-10" rounded elevation="2">
                <v-card-title class="text-h6 font-weight-bold text-start">
                    <v-icon icon="mdi-face-agent"></v-icon> التحكم في خدمات
                    الموقع
                </v-card-title>
                <v-container>

                    <v-row class="justify-start">
                        <v-btn color="grey-darken-4 ma-10" prepend-icon="mdi-plus"
                            @click="$router.push('/admin/services/add')">أضف خدمة جديدة</v-btn>
                    </v-row>
                    <v-row class="justify-start">
                        <v-col md="6" cols="12">
                            <v-text-field v-model="search" variant="outlined" clearable hide-details="auto"
                                prepend-inner-icon="mdi-magnify" label="بحث"></v-text-field>
                        </v-col>
                        <v-col md="6" cols="12">
                            <v-select class="text-center" item-value="value" item-title="state" label="فلترة الترتيب"
                                v-model="filterSelect" :items="[
                                    { state: 'الأحدث', value: 'newest' },
                                    { state: 'الأقدم', value: 'oldest' },
                                ]" variant="outlined">
                                <template v-slot:item="{ props }">
                                    <v-list-item class="text-end" v-bind="props"> </v-list-item>
                                </template>
                            </v-select>
                        </v-col>

                    </v-row>
                    <v-sheet border style="overflow-x: auto">
                        <v-table class="" hover>
                            <thead>
                                <tr>
                                    <th class="text-center">#</th>
                                    <th class="text-center">عنوان الخدمة </th>
                                    <th class="text-center">الصورة المصغرة</th>
                                    <th class="text-center">التقييم</th>
                                    <th class="text">الاجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in currentShown" :key="item">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.title }}</td>
                                    <td>
                                        <v-img class="my-2 " style="height: 80px;object-fit: fill;" :src="item.cover"
                                            alt=""></v-img>
                                    </td>
                                    <td>
                                        <!-- <div class="text-center">
                                            <span class="text-caption">
                                                ({{ item.reviews_count }})
                                            </span>
                                        </div> -->
                                        <div class="text-center">
                                            <rating-stars :rating="item.reviews_avg_rating" />
                                            <!-- <v-rating size="small" v-model="item.reviews_avg_rating" readonly half-increments color="yellow-darken-3"></v-rating> -->
                                        </div>
                                    </td>
                                    <td>
                                        <v-btn color="error" prepend-icon="mdi-delete" class="me-4" size="small"
                                            @click="showDeleteDialog(item.id)">حذف</v-btn>
                                        <v-btn color="primary" size="small"
                                            @click="$router.push('/admin/services/' + item.slug)"
                                            prepend-icon="mdi-pencil">تعديل</v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                        <v-alert class="ma-3" type="info" v-if="currentShown.length == 0">لا يوجد نتائج</v-alert>

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
                        </v-container>
                    </div>
                </v-container>
            </v-card>
        </div>
        <v-dialog v-model="isDeleteDialogShow" persistent width="300px">
            <v-card elevation="10">
                <v-card-text class="text-end">
                    هل انت متاكد من حذف هذه الخدمة
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn color="black" variant="outlined" @click="() => {
                        isDeleteDialogShow = false;
                        serviceWantDelete = -1;
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

const services = ref();
const isDeleteDialogShow = ref(false);
const serviceWantDelete = ref();
const loadingDelete = ref(false);
const itemPerPage = ref(10);
const page = ref(1);
const search = ref();
const filterSelect = ref("newest");


const filteredArray = computed(() => {
    // if (statusFillter.value === "active") {
    //     return services.value.filter((item: any) => {
    //         return item.status === "active";
    //     });
    // } else if (statusFillter.value === "pending")
    //     return services.value.filter((item: any) => {
    //         return item.status === "pending";
    //     });
    return services.value;
});

const filteredServices = computed(() => {
    if (filterSelect.value === "newest") {
        return services.value.sort(function (a: any, b: any): number {
            if (a.created_at < b.created_at) return 1;
            return -1;
        });
    }
    else if (filterSelect.value === "oldest") {
        return services.value.sort(function (a: any, b: any): number {
            if (a.created_at > b.created_at) return 1;
            return -1;
        });
    }
    return services.value;
});

const searchShown = computed(()=> {
  if(search.value){
    return filteredServices.value.filter((item :any)=>{
      page.value = 1;
      return item.title.toLowerCase().search(search.value.toLowerCase()) > -1;
    });
  }
  return filteredServices.value
});


const lengthPaginate = computed(() => {
    return Math.ceil(searchShown.value.length / itemPerPage.value);
});

const currentShown = computed(() => {
    var startIndex = (page.value - 1) * itemPerPage.value;
    var endIndex = page.value * itemPerPage.value;
    return searchShown.value.slice(startIndex, endIndex);
});

const { data, error } = await useSendRequest<responseReturn>(
    '/admin/services/getServices',
    { token: authStore.token }
)
if (error.value) {
    setToastMessage(error.value.message)
} else if (data.value?.status) {
    services.value = data.value.data;
} else {
    setToastMessage(data.value?.message as string);
}

const showDeleteDialog = (id: number) => {
    serviceWantDelete.value = id;
    isDeleteDialogShow.value = true;
};

const confirmDelete = async () => {
    loadingDelete.value = true;
    const { data, error } = await useSendRequest<responseReturn>(
        "/admin/services/delete",
        {
            service_id: serviceWantDelete.value,
            token: authStore.token,
        }
    );
    if (error.value) {
        setToastMessage(error.value.message);
    } else if (data.value?.status) {
        isDeleteDialogShow.value = false;
        setToastMessage("تم حذف الخدمة بنجاح" as string);
        services.value = services.value.filter((item: any) => {
            return item.id !== serviceWantDelete.value;
        });
        serviceWantDelete.value = -1;
    } else {
        setToastMessage("حدث خطا ما" as string);
    }
    loadingDelete.value = false;
};
</script>
    
<style></style>