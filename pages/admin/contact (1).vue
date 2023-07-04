<template>
    <div>
        <v-alert color="error" v-if="generalError">{{ generalError }}</v-alert>

        <div>
            <v-card style="min-height: 100vh" border color="" class="pt-10" rounded elevation="2">
                <v-card-title class="text-h6 font-weight-bold text-start">
                    <v-icon icon="mdi-google-ads"></v-icon> التحكم في طلبات التواصل
                </v-card-title>
                <v-container>
                    <div>
                        <div v-for="item in currentContact" :key="item.id" class="bg-blue-grey-darken-4 px-2 pt-2 pb-2 ma-5">
                            <div class="d-flex justify-space-between mb-2">
                                <div class="">
                                    <p class=" align-self-center ms-3">
                                        {{ item.name }}
                                    </p>
                                    <p class=" align-self-center ms-3">
                                        البريد : {{ item.email }}
                                    </p>
                                    <p class=" align-self-center ms-3">
                                        رقم الهاتف : {{ item.phone ? item.phone : 'لا يوجد' }}
                                    </p>

                                </div>
                                <div class="d-flex">
                                    <div class="imageHolder align-self-center" style="width: 25px; height: 25px">
                                        <v-img src="/images/تاريخ.png" style="width: 100%; height: 100%"></v-img>
                                    </div>
                                    <div class="d-md-flex d-block">
                                        <p class="my-1 mx-2 align-self-center">
                                            {{
                                                new Date(item.created_at).toLocaleString(['ban', 'id'], {
                                                    hour12: false,
                                                })
                                            }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-white pa-2">
                                <p>{{ item.message }}</p>
                            </div>
                        </div>
                        <v-card v-if="contacts.length === 0" class="my-5 pa-3" elevation="2">
                            <v-icon icon="mdi-alert-circle"></v-icon> لا يوجد طلبات تواصل</v-card>
                    </div>
                    <div class="text-center">
                        <v-btn variant="tonal" color="black" v-if="currentContact.length < contacts.length"
                            @click="page++">عرض المزيد</v-btn>
                    </div>
                </v-container>
            </v-card>
        </div>
    </div>
</template>
    
<script setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";

definePageMeta({
    layout: "dashboard",
    middleware: ["auth", "is-admin"],
});

const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();
const itemPerPage = ref(10);
const page = ref(1);

const contacts = ref();

const { data, error } = await useSendRequest('/getContacts', {
    token: authStore.token
});

if (error.value) {
    setToastMessage('حدث خطأ ما');
} else {
    if (data.value?.status) {
        contacts.value = data.value.data;
    }
}



const currentContact = computed(() => {
    return contacts.value.slice(0, itemPerPage.value * page.value);
});

</script>
    
<style></style>