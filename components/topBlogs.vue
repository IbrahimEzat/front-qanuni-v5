<template>
    <div class="align-center">
        <div class="py-8 text-md-center ">
            <h4 class="text-h5">مواضيع قد تهمك</h4>
            <div class="d-flex flex-wrap justify-md-start justify-center px-10" style="min-width: 300px ; width: 90%;">
                <v-card v-for="item in topBlogs" :key="item.id" class="my-8 mx-2 pointer card"  style="min-width: 300px ; width: 100%;">
                <div @click="$router.push('/blog/' + item.slug)">
                    <div class="imageHolder">
                        <img style="max-height: 260px;min-width:100% ;" :src="item.blog_image" alt="" />
                    </div>
                    <div style="border-radius: 0 0 10px 10px" class="bg-white text-start px-3">
                        {{ item.title }}
                    </div>
                    <div style="border-radius: 0 0 10px 10px" class="bg-white text-start pa-3">
                        {{ item.username }}
                    </div>
                </div>
            </v-card>
            </div>
        </div>
    </div>
</template>

<script setup>
const topBlogs = ref([]);
const { data, error } = await useSendRequest('/blogs/top-blogs', {});
if (error.value) {
    setToastMessage("حدث خطأ ما");
} else {
    if (data.value?.status) {
        topBlogs.value = data.value.data;
    }
}
</script>

<style scoped>
.card:hover {
    transform: scale(1.01);
    box-shadow: 0px 0px 20px #aaa;

}
</style>