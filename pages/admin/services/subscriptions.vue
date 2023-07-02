<template>
    <div>
        <!-- <v-alert color="error" v-if="generalError">{{ generalError }}</v-alert> -->
        <div>
            <v-card style="min-height: 100vh" border color="" class="pt-10" rounded elevation="2">
                <v-card-title class="text-h6 font-weight-bold text-start">
                    <v-icon icon="mdi-post-outline"></v-icon> التحكم في خدمات
                    الموقع
                </v-card-title>
                <v-container>
                    <v-row class="justify-start">
                        <v-col md="4" cols="12">
                            <v-select class="text-center" clearable v-model="statusFillter" item-value="value"
                                item-title="state" label="فلترة الحالة" :items="[
                                    { state: 'مكتملة', value: 1 },
                                    { state: 'قيد التنفيذ', value: 0 },
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
                                    <th class="text">#</th>
                                    <th class="text">عنوان الخدمة </th>
                                    <th class="text">اسم المشتري</th>
                                    <th class="text">حالة الخدمة</th>
                                    <th class="text">الاجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in currentShown" :key="item">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.service.title }}</td>
                                    <td>{{ item.user.name }}</td>
                                    <td>
                                        <span class="font-weight-medium text-green" v-if="item.status == 1" append-icon="mdi-check-circle-outline">
                                            مكتملة
                                        </span>
                                        <span v-else class="font-weight-medium text-orange" append-icon="mdi-timer-sand">قيد التنفيذ</span>

                                    </td>
                                    <td>
                                        <v-btn @click="$router.push('/services/holdings/'+item.id+'/details')" color="success" prepend-icon="mdi-chat-processing-outline">التوجه إلى المحادثة</v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                        <v-alert v-if="subscriptions.length === 0" class="text-center" text="لا يوجد اشتراكات في خدمات الموقع"></v-alert>

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

const subscriptions = ref();
const statusFillter = ref();
const itemPerPage = ref(2);
const page = ref(1);

const filteredArray = computed(() => {
    if (statusFillter.value == 1) {
        return subscriptions.value.filter((item: any) => {
            return item.status == 1;
        });
    } else if (statusFillter.value == 0)
        return subscriptions.value.filter((item: any) => {
            return item.status == 0;
        });
    return subscriptions.value;
});

const lengthPaginate = computed(() => {
    return Math.ceil(filteredArray.value.length / itemPerPage.value);
});

const currentShown = computed(() => {
    var startIndex = (page.value - 1) * itemPerPage.value;
    var endIndex = page.value * itemPerPage.value;
    return filteredArray.value.slice(startIndex, endIndex);
});

const { data, error } = await useSendRequest<responseReturn>(
    '/admin/services/getAllSubscriptions',
    { token: authStore.token }
)
if (error.value) {
    setToastMessage(error.value.message)
} else if (data.value?.status) {
    subscriptions.value = data.value.data;
} else {
    setToastMessage(data.value?.message as string);
}

</script>
    
<style></style>