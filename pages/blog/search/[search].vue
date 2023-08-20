<template>
    <v-card dir="rtl">
        <div class="bg-white">
            <div v-if="!authStore.isLogin" class="text-center py-5" style="background-color: #fcc628">
                <h4>قم بتسجيل الدخول لكي تستطيع إضافة مقالة أو التفاعل مع الاخرين</h4>
                <div class="d-flex justify-center mt-5">
                    <NuxtLink to="/signup?redirect=/blogs"><v-btn class="bg-green" style="border-radius: 0">أنشئ حساب
                            مجانا</v-btn>
                    </NuxtLink>
                    <NuxtLink to="/login?redirect=/blogs">
                        <v-btn class="ms-3 bg-blue" style="border-radius: 0">تسجيل دخول</v-btn>
                    </NuxtLink>
                </div>
            </div>
            <div v-else class="text-center py-5 text-white" style="background-color: #27343a">
                <h4>
                    مرحبا
                    <span v-if="authStore.user_gender == 'male'">سيدي
                        <span style="color: #10b7d5">{{ authStore.user_name }}</span>
                        نتمنى أن تشاركنا بمقالة من إنجازك

                    </span>
                    <span v-else>سيدتي
                        <span style="color: #a63ab8">{{ authStore.user_name }}</span>
                        نتمنى أن تشاركينا بمقالة من إنجازك
                    </span>
                </h4>
                <div class="d-flex justify-center mt-5">
                    <v-btn class="rounded-pill d-flex align-center" style="background-color: #fcc628"
                        @click="tryGoToAddBlog"><img style="object-fit: cover; width: 24px; height: 24px"
                            src="/images/add-blog.png" /><span class="ms-3">إضافة
                            مقالة</span></v-btn>
                </div>
            </div>
            <div class="text-center mt-8 mb-16">
                <h4>
                    مجموع عدد نتائج البحث عن:
                    <span class="text-red">{{ route.params.search }}</span> في قسم المقالات بمنصة القانوني
                    يبلغ: <span class="text-green">{{ total }}</span>مقالة
                </h4>
                <div>
                    <v-text-field @keyup.enter.prevent="goToSearchPage" v-model="search" clearable
                        style="width: 320px; height: 9px" class="rounded-pill mx-auto mt-3" label="ابحث" density="compact"
                        prepend-inner-icon="mdi-magnify" variant="outlined"></v-text-field>
                </div>
            </div>

            <section style="background-color: #f0f0f0; padding: 0 1rem">
                <v-row>
                    <v-col v-if="total != 0" md="8" cols="12">
                        <div class="py-5 ps-5">
                            <v-select label="Select" style="width: 230px; height: 45px" variant="outlined" density="compact"
                                v-model="sorting" item-title="name" item-value="value" :items="[
                                    {
                                        name: 'الاحدث اولا',
                                        value: { orderBy: 'desc', sortBy: 'created_at' },
                                    },
                                    {
                                        name: 'الاقدم اولا',
                                        value: { orderBy: 'asc', sortBy: 'created_at' },
                                    },
                                    {
                                        name: 'الاكثر مشاهدة',
                                        value: { orderBy: 'desc', sortBy: 'blog_views' },
                                    },
                                    {
                                        name: 'الاقل مشاهدة',
                                        value: { orderBy: 'asc', sortBy: 'blog_views' },
                                    },
                                    {
                                        name: 'الاكثر تفضيلا',
                                        value: { orderBy: 'desc', sortBy: 'wishlist_count' },
                                    },
                                    {
                                        name: 'الاكثر تعليقا',
                                        value: { orderBy: 'desc', sortBy: 'blog_comments' },
                                    },
                                    {
                                        name: 'الاقل تعليقا',
                                        value: { orderBy: 'asc', sortBy: 'blog_comments' },
                                    },
                                    {
                                        name: 'الاقل تقييما',
                                        value: { orderBy: 'asc', sortBy: 'blog_points' },
                                    },
                                    {
                                        name: 'الأكثر تقييما',
                                        value: { orderBy: 'desc', sortBy: 'blog_points' },
                                    },
                                ]">
                                <template v-slot:item="{ props }">
                                    <v-list-item v-bind="props" class="text-end"></v-list-item>
                                </template>
                            </v-select>
                        </div>
                        <p class="text-center text-h5" v-if="sortLoading">جاري التحميل ...</p>
                        <v-card border class="mb-5 pointer card" style="border-radius: 10px" v-for="blog in blogs"
                            :key="blog.id">
                            <div @click="$router.push('/blog/' + blog.slug)">
                                <div class="image-holder">
                                    <img :src="blog.blog_image" alt="" />
                                </div>
                                <div class="px-4">
                                    <h3 class="my-5" style="color: #4b565b">
                                        {{ blog.title }}
                                    </h3>
                                    <div style="
                      display: -webkit-box;
                      -webkit-line-clamp: 3;
                      -webkit-box-orient: vertical;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    ">{{ blog.subtitle }}</div>
                                </div>
                                <v-divider class="mt-3"></v-divider>
                                <div class="d-sm-flex px-2">
                                    <div class="d-flex ps-2 py-2 align-center flex-grow-1">
                                        <div class="imageHolder" style="width: 40px; height: 40px">
                                            <v-avatar>
                                                <v-img cover :src="blog.user_image"></v-img>
                                            </v-avatar>
                                        </div>
                                        <span class="mx-3">{{ blog.username }}</span>
                                        <span class="blue-color" style="">
                                            {{
                                                new Date(blog.created_at).toLocaleString([], {
                                                    hour12: false,
                                                })
                                            }}
                                        </span>
                                    </div>
                                    <v-divider class="d-sm-none d-block"></v-divider>
                                    <div class="d-flex justify-center">
                                        <span class="d-flex justify-center align-center pa-2 flex-column border-left">
                                            <span>مشاهدات</span>
                                            <span class="blue-color">{{ blog.blog_views }}</span>
                                        </span>
                                        <span class="d-flex justify-center align-center pa-2 flex-column border-left">
                                            <span>تعليقات</span>
                                            <span class="blue-color">{{ blog.blog_comments }}</span>
                                        </span>
                                        <span class="d-flex justify-center align-center pa-2 flex-column border-left">
                                            <span>احتفاظ</span>
                                            <span class="blue-color">{{ blog.wishlist_count }}</span>
                                        </span>
                                        <span class="d-flex justify-center align-center pa-2 flex-column">
                                            <span>تقييم</span>
                                            <span class="blue-color">{{ blog.blog_points }}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </v-card>
                        <div v-if="urlNextRoute" class="text-center mb-5">
                            <v-btn :loading="showMoreLoading" @click="showMoreBlogs" color="#fdc52c"
                                class="rounded-pill">عرض
                                المزيد</v-btn>
                        </div>
                    </v-col>

                    <v-col v-else md="8" cols="12" class="mt-16">
                        <h4 class="text-center">لا يوجد نتائج بحث</h4>
                    </v-col>
                    <v-col md="4" cols="12">
                        <TopBlogs></TopBlogs>
                    </v-col>
                </v-row>
            </section>
        </div>
    </v-card>
</template>
  
<script setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { useSettingsStore } from "~/stores/useSettings";
const { setToastMessage } = useSettingsStore();
const route = useRoute();
const authStore = useAuthStore();
const blogs = ref();
const urlNextRoute = ref(null);
const sortLoading = ref(false);

const sorting = ref({
    name: "الاحدث اولا",
    value: { orderBy: "desc", sortBy: "created_at" },
});

const search = ref();
const total = ref();
const showMoreLoading = ref(false);

const { data, error } = await useSendRequest("/blogs/search", {
    search: route.params.search,
});

if (error.value) {
    setToastMessage("حدث خطأ ما");
} else {
    if (data.value?.status) {
        blogs.value = data.value.data.data;
        urlNextRoute.value = data.value.data.next_page_url;
        total.value = data.value.data.total;
    }
}

function goToSearchPage() {
    if (search.value) navigateTo("/blog/search/" + search.value);
}

function tryGoToAddBlog() {
    if (authStore.isLogin) return (window.location.href = "/addBlog");
    dialog.value = true;
}

watch(sorting, () => {
    sortBlogs();
});

async function sortBlogs() {
    sortLoading.value = true;
    let querys = {
        orderBy: sorting.value.orderBy,
        sortBy: sorting.value.sortBy,
        page: 1,
    };
    const { data, error } = await useSendRequest(
        "/blogs/search",
        {
            search: route.params.search,
        },
        querys
    );
    if (error.value) {
        setToastMessage("حدث خطأ ما");
    } else {
        if (data.value?.status) {
            blogs.value = Array.from(data.value.data.data);
            urlNextRoute.value = data.value.data.next_page_url;
            total.value = data.value.data.total;
        }
    }
    sortLoading.value = false;
}
async function showMoreBlogs() {
    showMoreLoading.value = true;
    let querys = {
        orderBy: sorting.value.orderBy,
        sortBy: sorting.value.sortBy,
    };
    const { data, error } = await useFetch(urlNextRoute.value, {
        method: "post",
        body: {
            search: route.params.search,
        },
        query: querys,
    });
    showMoreLoading.value = false;
    if (error.value) {
        setToastMessage("حدث خطأ ما");
    } else {
        if (data.value?.status) {
            blogs.value.push(...data.value.data.data);
            urlNextRoute.value = data.value.data.next_page_url;
        }
    }
}

useHead({
    title: "مقالات - نتائج بحث| " + route.params.search,
    meta: [
        { name: "description", content: route.params.search },
        { property: "og:description", content: route.params.search },
        { property: "og:image", content: "/images/مقالات.png" },
        { name: "twitter:card", content: "summay_large_image" },
        { property: "og:locale", content: "ar_ar" },
        { property: "og:url", content: "https://alqanoni.com/" },
        { property: "og:type", content: "website" },
    ],
    link: [{ rel: "canonical", href: "https://alqanoni.com/" }],
});

</script>
  
<style scoped>
.image-holder {
    height: 400px;
}

.image-holder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.25s;
}

.content :v-deep * {
    text-align: right !important;
}

.content :v-deep img {
    display: none;
}

.blue-color {
    color: #4a9bca;
}

.border-left {
    border-left: 1px solid #ddd;
}

.card:hover img {
    transform: scale(1.01);
}
</style>
  