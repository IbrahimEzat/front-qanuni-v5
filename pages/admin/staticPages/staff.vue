<template>
    <div>
        <v-container>
            <v-card>
                <v-card-title class="text-h6 mt-10 mb-5 font-weight-bold text-start">
                    التحكم بطاقم الموقع
                </v-card-title>
                <v-container>
                    <v-btn class="mb-5" @click="isAddMember = true"><span style="font-size: 22px;">+</span> اضافة عضو في
                        الطاقم</v-btn>
                    <v-sheet border style="overflow-x: auto">

                        <v-table class="" hover>
                            <thead>
                                <tr>
                                    <th class="text-">#</th>
                                    <th class="text-" style="max-width: 50% !important;">الاسم</th>
                                    <th class="text-" style="max-width: 50% !important;">المهنة</th>
                                    <th class="text-" style="width: 20% !important;">الصورة</th>
                                    <th class="text-" style="width: 30% !important;">الاجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in members" :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.job }}</td>
                                    <td>
                                        <v-avatar size="x-large" class="my-2">
                                            <v-img :src="item.image" cover></v-img>
                                        </v-avatar>
                                    </td>
                                    <td>
                                        <v-btn color="error" prepend-icon="mdi-delete" class="me-5"
                                            @click="showDelete(item)" size="small">حذف</v-btn>
                                        <v-btn color="primary" size="small" prepend-icon="mdi-pencil"
                                            @click="showUpdate(item)">تعديل</v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                        <v-alert class="ma-3" type="info" v-if="members.length == 0">لا يوجد طاقم للموقع </v-alert>
                    </v-sheet>
                </v-container>
            </v-card>
        </v-container>
        <v-dialog v-model="isAddMember" persistent width="450px">
            <v-card elevation="10">
                <v-card-text class="text-end font-weight-bold text-h6">
                    اضافة عضو
                    <div dir="rtl" class="my-3">
                        <v-text-field v-model="name" clearable label="اسم العضو" variant="outlined"></v-text-field>
                        <p class="text-error text-start text-subtitle-1 " v-if="errorMessages.name">
                            {{ errorMessages.name[0] }}
                        </p>
                    </div>
                    <div dir="rtl" class="my-3">
                        <v-text-field v-model="job" clearable label="مهنة العضو" variant="outlined"></v-text-field>
                        <p class="text-error text-start text-subtitle-1 " v-if="errorMessages.job">
                            {{ errorMessages.job[0] }}
                        </p>
                    </div>
                    <div dir="rtl" class="my-3">
                        <v-file-input @change="uploadImage($event)" label="صورة العضو" variant="outlined"></v-file-input>
                        <p class="text-error text-start text-subtitle-1 " v-if="errorMessages.image">
                            {{ errorMessages.image[0] }}
                        </p>
                    </div>
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn color="black" variant="outlined" @click="isAddMember = false">إغلاق</v-btn>
                    <v-btn variant="flat" color="primary" @click="addMember" :loading="loadingAddMember">تأكيد</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="isUpdateDialogShow" persistent width="450px">
            <v-card elevation="10">
                <v-card-text class="text-end font-weight-bold text-h6">
                    تحديث بيانات هضا عضو
                    <div dir="rtl" class="my-3">
                        <v-text-field v-model="name" clearable label="تحديث اسم العضو" variant="outlined"></v-text-field>
                        <p class="text-error text-start text-subtitle-1 " v-if="errorMessages.name">
                            {{ errorMessages.name[0] }}
                        </p>
                    </div>
                    <div dir="rtl" class="my-3">
                        <v-text-field v-model="job" clearable label="تحديث مهنة العضو" variant="outlined"></v-text-field>
                        <p class="text-error text-start text-subtitle-1 " v-if="errorMessages.job">
                            {{ errorMessages.job[0] }}
                        </p>
                    </div>
                    <div dir="rtl" class="my-3">
                        <v-file-input @change="uploadUpdateImage($event)" label="تحديث صورة العضو"
                            variant="outlined"></v-file-input>
                        <p class="text-error text-start text-subtitle-1 " v-if="errorMessages.image">
                            {{ errorMessages.image[0] }}
                        </p>
                    </div>
                    <div>
                        <v-img :src="imageUpdate" cover></v-img>
                    </div>
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn color="black" variant="outlined" @click="isUpdateDialogShow = false">إغلاق</v-btn>
                    <v-btn variant="flat" color="primary" @click="updateMember" :loading="loadingAddMember">تأكيد</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="isDeleteDialogShow" persistent width="300px">
            <v-card elevation="10">
                <v-card-text class="text-end">
                    هل انت متاكد من حذف هذا العضو
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn color="black" variant="outlined" @click="isDeleteDialogShow = false">إغلاق</v-btn>
                    <v-btn variant="flat" color="primary" @click="deleteMember" :loading="loadingDelete">تأكيد</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();

definePageMeta({
    layout: "dashboard",

});

const isAddMember = ref(false);
const loadingAddMember = ref(false);

const name = ref();
const job = ref();
const image = ref();

const members = ref([]);

const { data, error } = await useSendRequest('/getAllMember', {});
if (!error.value && data.value?.status) {
    members.value = data.value.data
}
const errorMessages = reactive({
    name: [],
    job: [],
    image: [],

});

function clearError() {
    errorMessages.name = [];
    errorMessages.job = [];
    errorMessages.image = [];
}

function uploadImage($event) {
    image.value = $event.target?.files[0];
}

async function addMember() {
    clearError();
    if (!name.value) {
        errorMessages.name.push('الرجاء ادخال اسم العضو')
    }
    if (!job.value) {
        errorMessages.job.push('الرجاء ادخال مهنة العضو')
    }
    if (!image.value) {
        errorMessages.image.push('الرجاء ارفاق صورة العضو')
    }
    if (!name.value || !job.value || !image.value) {
        return;
    }


    const formdata = new FormData();
    formdata.append('token', JSON.stringify(authStore.token));
    formdata.append('name', name.value);
    formdata.append('job', job.value);
    formdata.append('image', image.value);

    loadingAddMember.value = true;
    const { data, error } = await useSendRequest(
        '/admin/addMember',
        formdata
    )
    loadingAddMember.value = false;

    if (error.value) {
        setToastMessage('حدث خظا ما')
    } else if (data.value?.status) {
        setToastMessage('تم اضافة العضو بنجاح');
        members.value.push(data.value.data);

        isAddMember.value = false;
        name.value = '';
        job.value = '';
        image.value = null;
    } else {
        const errors = data.value?.errors || [];
        for (let i = 0; i < errors.length; i++) {
            const obj = errors[i];
            if (obj.filed_name == "name") {
                errorMessages.name = obj.message;
            } else if (obj.filed_name == "job") {
                errorMessages.job = obj.message;
            } else if (obj.filed_name == "image") {
                errorMessages.image = obj.message;
            }
        }
    }
}
// ******************
const isDeleteDialogShow = ref(false);
const loadingDelete = ref(false);
const memberWentDelete = ref('');

function showDelete(member) {
    isDeleteDialogShow.value = true;
    memberWentDelete.value = member
}

async function deleteMember() {
    loadingDelete.value = true;
    const { data, error } = await useSendRequest('/admin/deleteMember', {
        member_id: memberWentDelete.value.id,
        token: authStore.token
    })
    loadingDelete.value = false;
    if (error.value) {
        setToastMessage('حدث خظا ما')
    } else if (data.value?.status) {
        members.value = members.value.filter(item => {
            return item != memberWentDelete.value;
        })
        setToastMessage('تم حدف العضو بنجاح');
        memberWentDelete.value = '';
        isDeleteDialogShow.value = false;

    }
}
// **********************************************

const imageUpdate = ref();
function uploadUpdateImage($event) {
    image.value = $event.target?.files[0];
    imageUpdate.value = URL.createObjectURL(image.value);
}

const isUpdateDialogShow = ref(false);
const memberWentUpdate = ref();

function showUpdate(member) {
    isUpdateDialogShow.value = true;
    memberWentUpdate.value = member;
    name.value = member.name;
    job.value = member.job;
    image.value = member.image;
    imageUpdate.value = member.image;
}

async function updateMember() {
    clearError();
    if (!name.value) {
        errorMessages.name.push('الرجاء ادخال اسم العضو')
    }
    if (!job.value) {
        errorMessages.job.push('الرجاء ادخال مهنة العضو')
    }
    if (!image.value) {
        errorMessages.image.push('الرجاء ارفاق صورة العضو')
    }
    if (!name.value || !job.value || !image.value) {
        return;
    }


    const formdata = new FormData();
    formdata.append('token', JSON.stringify(authStore.token));
    formdata.append('name', name.value);
    formdata.append('job', job.value);
    formdata.append('image', image.value);
    formdata.append('member_id', memberWentUpdate.value.id);

    loadingAddMember.value = true;
    const { data, error } = await useSendRequest(
        '/admin/updateMember',
        formdata
    )
    loadingAddMember.value = false;
    if (error.value) {
        setToastMessage('حدث خظا ما')
    } else if (data.value?.status) {
        let index = members.value.indexOf(memberWentUpdate.value);
        members.value[index] = data.value.data;
    
        name.value = '';
        job.value = '';
        name.image = '';

        setToastMessage('تم تحديث العضو بنجاح');
        memberWentUpdate.value = '';
        isUpdateDialogShow.value = false;

    }
}


</script>

<style>
.v-input--horizontal .v-input__prepend {
    display: none;
}

.v-text-field .v-input__details {
    display: none;
}

.v-file-input .v-input__details {
    display: none;
}
</style>