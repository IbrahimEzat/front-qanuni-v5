<template>
    <div>
        <v-card elevation="5" class="pa-4">
            <div>
                <p class="font-weight-bold text-h5">إضافة نبذة لقسم الاختبارات</p>
            </div>

            <div>
                <div>
                    <p class="font-weight-regular text-h6">النبذة: </p>
                    <div id="summernote"></div>
                </div>

                <div style="text-align: end">
                    <v-btn :loading="confirmLoading" @click="storeAbout" variant="outlined" class="rounded-pill mt-3"
                        style="color: white; background-color: rgb(28, 173, 76)">
                        <p class="text-h6">تأكيد</p>
                    </v-btn>
                </div>
            </div>
        </v-card>
    </div>
</template>
      
<script setup >
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";

useHead({
    link: [

        {
            rel: "stylesheet",
            type: "text/css",
            href: "https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css",
        },
        {
            rel: "stylesheet",
            type: "text/css",
            href: "https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css",
        },
    ],
    script: [

        {
            src: "https://code.jquery.com/jquery-3.5.1.min.js",
        },
        {
            src: "https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js",
        },
        {
            src: "https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js",
        },
    ],
});
definePageMeta({
    middleware: ["auth"],
    layout: "dashboard",
});
const { setToastMessage } = useSettingsStore();
const authStore = useAuthStore();
const confirmLoading = ref(false);
const sectionInfo = ref();

const toolbarOptions = [
    [{ font: [] }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "super" }, { script: "sub" }],
    [{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["direction", { align: [] }],
    ["link", "image", "video", "formula"],
    ["clean"],
];
const { data, error } = await useSendRequest('/get-about-section', {
    section_name: 'exams',
});

if (error.value) {
    setToastMessage('حدث خطأ ما');
}
if (data.value.status) {
    sectionInfo.value = data.value.data
}

async function storeAbout() {
    confirmLoading.value = true
    let content = document.getElementsByClassName("note-editable")[0].innerHTML;
    const { data, error } = await useSendRequest('/about-section', {
        token: authStore.token,
        section_name: 'exams',
        about_section: content
    });

    if (error.value) {
        setToastMessage('حدث خطأ ما');
        confirmLoading.value = false
        return;
    }
    if (data.value.status) {
        setToastMessage('تم تعديل النبذة بنجاح');
        confirmLoading.value = false
    } else {
        setToastMessage(data.value.message)
        confirmLoading.value = false
    }

}

onMounted(() => {
    // initEditor();
    $(document).ready(function () {
        $("#summernote").summernote();
    });
    let interval = setInterval(() => {
        const noteDom = document.getElementsByClassName("note-editable")[0];
        if (noteDom) {
            noteDom.innerHTML = sectionInfo.value ? sectionInfo.value.about_section : '';
            clearInterval(interval);
        }
    }, 200);
});
</script>
<style scoped>
.content img {
    max-width: 100%;
    max-height: 500px;
}

.modal-backdrop {
    position: relative !important;
}

.note-editor.note-frame .note-editing-area .note-editable {
    direction: rtl !important;
}
</style>
    
    