<template>
  <div>
    <!-- header -->
    <div style="background-color: #fdfcf8;">
      <div class="d-flex  mx-auto align-center" style="width: 80%;">
        <div class="mb-2">
          <div style="width: 80%;" class="d-md-none d-block mx-auto">
          <v-img style="height: 250px;" src="images/Layer-0.png"></v-img>
        </div>
          <h1 class="mb-2 text-md-start text-center">مرحبا بك في القانوني</h1>
          <p class="text-h6 my-3 ">أكبر منصة مغربية مخصصة للباحثين في علم القانون من موظفين ومهنيين و طلبة</p>
        </div>
        <div style="width: 80%;" class="d-md-block d-none">
          <v-img style="height: 400px;"  src="images/Layer-0.png"></v-img>
        </div>
      </div>
    </div>
    <!-- hello or sign up -->
    
    <div v-if="authStore.isLogin" class="py-7 bg-grey-darken-4">
      <p class="text-center text-sm-h5">مرحبا <span>{{ (authStore.user_gender == 'male') ? 'سيدي' : 'سيدتي' }}</span> <span
          :class="{ 'text-light-blue-darken-4': (authStore.user_gender == 'male'), 'text-red-accent-4': (authStore.user_gender == 'female') }">
          {{ authStore.user_name }}</span> نتمنى لك تعليما موفقا</p>
    </div>
    <div v-else class="py-7 bg-grey-darken-4 d-flex justify-center">
      <v-btn @click="$router.push('/signup')" class="me-5 text-white font-weight-black" style="height: 50px;background-color: #0d8836">أنشئ حساب
       مجانا</v-btn>
      <v-btn @click="$router.push('/login')" class="text-white font-weight-black" style="height: 50px;background-color: #0aaaf2;">تسجيل دخول</v-btn>
    </div>
    <!-- swiper -->

    <div class="py-10" style="background-color: #fdfcf8;">
      <div class="text-center">
        <div class="d-flex justify-center">
          <v-img style="max-width: 40px;" src="images/قائمة-المفضلة-قبل-الضغط.png"></v-img>
          <p class="text-sm-h4 text-h5 ms-2">ما الذي يميز منصة القانوني</p>
        </div>
        <p style="max-width: 700px;text-align: justify; font-size: 18px;" class="mx-auto my-5 px-5 ">
          منصة غير تقليدية , تحتوي على الكثير من الخصائص المحفزة على البحث والدراسة من قبيل التنقيط والجوائز
          كما تحتوي على محتوى متنوع و متعدد موزع على أقسام متعددة
          فمنها المقالات والمناقشات والاستطلاعات والمسابقات والمؤلفات والخدمات والاإستشارات
        </p>
      </div>
      <Swiper class="py-10  w-100  text-center" :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperPagination]"
        :slides-per-view="1" :space-between="20" :loop="true" :pagination="true" :autoplay="{
          delay: 4000,
          disableOnInteraction: true,
        }">
        <SwiperSlide class="">
          <v-img style="max-width: 120px;" class="mx-auto" src="images/مميزات-1.png"></v-img>
          <p class="mx-auto" style="font-size: 18px;white-space: pre-line;max-width: 345px;;">
            يمكنك إكتساب النقاط عن طريق القراءة والتفاعل
            خصوصا عند المساهمة والمشاركة بالمقالات والمناقشات
            والفوز بالمسابقات والإجابة عن الاختبارات
            وهذة اهم النقاط يمكن استبدالها حاليا بالخدمات الموجودة بالمنصة
            أو يمكن إنشاء الإستطلاعات ونشر المقالات بها
            ومستقبلا يمكن استبدالها بالمال
          </p>
        </SwiperSlide>
        <SwiperSlide>
          <v-img style="max-width: 120px;" class="mx-auto" src="images/مميزات-3.png"></v-img>
          <p class="mx-auto" style="font-size: 18px;max-width: 200px;">يمكنك اكتساب الأوسمة عند كل إنجاز مميز تحققه</p>
        </SwiperSlide>
        <SwiperSlide>
          <v-img style="max-width: 120px;" class="mx-auto" src="images/مميزات-2.png"></v-img>
          <p class="mx-auto" style="font-size: 18px;max-width: 300px;">
            الحصول على حساب بالمنصة
            مما يعرفك للغير بصفحة شخصية بتصميم جميل
            ويمكنك من نشر المقالات والمشاركات باسمك وصورتك

          </p>
        </SwiperSlide>
      </Swiper>
    </div>
    <!-- الاقسام -->
    <div class="" style="background-color: #eefcfd;">
      <v-container class=" px-4">
        <div class="mb-8">
          <v-img style="width:30px ; display: inline-block;" src="images/أقسام.png"></v-img>
          <span class="text-h4 ms-3">أقسام منصة القانوني</span>
        </div>
        <v-row>
          <v-col class="mb-10 " cols="6" sm="6" md="3">
            <div class="section21 sectionBlog bg-blue-lighten-5">
              <NuxtLink to="/blogs" class=" " style="text-decoration: none;
  color: black;">
                <div class="imageHolder" style="height: 100px">
                  <v-img style="width: 100%" src="images/قسم-المقالات.png"></v-img>
                </div>
                <div class="sectionFooter rounded-b-xl" style=" height: 50px;">
                  <h2 class="text-center mt-2">مقالات</h2>
                </div>
              </NuxtLink>
            </div>
          </v-col>
          <v-col class="mb-10" cols="6" sm="6" md="3">
            <div class="section21 sectionDiss bg-blue-lighten-5">
              <NuxtLink to="/discussions" style="text-decoration: none;
  color: black;">
                <div class="imageHolder" style="height: 100px">
                  <v-img style="width: 100%; height: 200px" src="images/قسم-المناقشات.png"></v-img>
                </div>
                <div class="sectionFooter rounded-b-xl" style=" height: 50px;">
                  <h2 class="text-center mt-2">مناقشات</h2>
                </div>
              </NuxtLink>
            </div>
          </v-col>
          <v-col class="mb-10" cols="6" sm="6" md="3">
            <div class="section21 sectionlib bg-blue-lighten-5">
              <NuxtLink to="/library" style="text-decoration: none;
  color: black;">
                <div class="imageHolder" style="height: 100px">
                  <v-img :width="200" style="width: 100%; height: 200px" src="images/قسم-المكتبة.png"></v-img>
                </div>
                <div class="sectionFooter rounded-b-xl" style=" height: 50px;">
                  <h2 class="text-center mt-2">المكتبة</h2>
                </div>
              </NuxtLink>
            </div>
          </v-col>
          <v-col class="mb-10" cols="6" sm="6" md="3">
            <div class="section21 sectionSur  bg-blue-lighten-5">
              <NuxtLink to="/surveys" style="text-decoration: none;
  color: black;">
                <div class="imageHolder" style="height: 100px">
                  <v-img :width="200" style="width: 100%; height: 200px" src="images/قسم-الاستطلاعات.png"></v-img>
                </div>
                <div class="sectionFooter rounded-b-xl" style=" height: 50px;">
                  <h2 class="text-center mt-2">استطلاعات</h2>
                </div>
              </NuxtLink>
            </div>
          </v-col>

          <v-col class="mb-10" cols="6" sm="6" md="3">
            <div class="section21 sectionComp bg-blue-lighten-5">
              <NuxtLink to="/competitions" style="text-decoration: none;
  color: black;">
                <div class="imageHolder" style="height: 100px">
                  <v-img :width="200" style="width: 100%; height: 200px" src="images/قسم-المسابقات.png"></v-img>
                </div>
                <div class="sectionFooter rounded-b-xl" style=" height: 50px;">
                  <h2 class="text-center mt-2">مسابقات</h2>
                </div>
              </NuxtLink>
            </div>
          </v-col>
          <v-col class="mb-10" cols="6" sm="6" md="3">
            <div class="section21 sectionExam bg-blue-lighten-5">
              <NuxtLink to="/exams" style="text-decoration: none;
  color: black;">
                <div class="imageHolder" style="height: 100px">
                  <v-img :width="200" style="width: 100%; height: 200px" src="images/قسم-الإختبارات.png"></v-img>
                </div>
                <div class="sectionFooter rounded-b-xl" style=" height: 50px;">
                  <h2 class="text-center mt-2">اختبارات</h2>
                </div>
              </NuxtLink>
            </div>
          </v-col>
          <v-col @click="dialog = true" class="mb-10" cols="6" sm="6" md="3">
            <div class="section21 sectionEss bg-blue-lighten-5">
              <NuxtLink style="text-decoration: none;
  color: black;">
                <div class="imageHolder" style="height: 100px">
                  <v-img :width="200" style="width: 100%; height: 200px" src="images/قسم-الاستشارات.png"></v-img>
                </div>
                <div class="sectionFooter rounded-b-xl" style=" height: 50px;">
                  <h2 class="text-center mt-2">استشارات</h2>
                </div>
              </NuxtLink>
            </div>
          </v-col>
          <v-col class="mb-10" cols="6" sm="6" md="3">
            <div class="section21 sectionSer bg-blue-lighten-5">
              <NuxtLink to="/services" style="text-decoration: none;
  color: black;">
                <div class="imageHolder" style="height: 100px">
                  <v-img :width="200" style="width: 100%; height: 200px" src="images/قسم-الخدمات.png"></v-img>
                </div>
                <div class="sectionFooter rounded-b-xl" style=" height: 50px;">
                  <h2 class="text-center mt-2">خدمات</h2>
                </div>
              </NuxtLink>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- نبذة عن المقالات -->
    <div style="background-color: #fdfcf8;">
      <v-container class=" px-16">
      <div class="pb-8 d-flex" >
          <v-img style="max-width:45px ; display: inline-block;" src="images/قسم-المقالات.png"></v-img>
          <span class="text-md-h4 text-h6 ms-3 justify-self-center ">من هو قسم المقالات</span>
        </div>
        <div class="w-75 mx-auto" v-html="sectionsInfo.blogs[0].about_section">
        
        </div>
      </v-container>
    </div>
    <!-- نبذة عن المناقشات -->
    <div style="background-color: #eefcfd;">
       <v-container class=" px-16">
      <div class="pb-8 d-flex">
          <v-img style="max-width:45px ; display: inline-block;" src="images/قسم-المناقشات.png"></v-img>
          <span class="text-md-h4 text-h6 ms-3 justify-self-center ">من هو قسم المناقشات</span>
        </div>
        <!-- <div class="w-75 mx-auto" v-html="sectionsInfo.discussions[0].about_section">
          
        </div> -->
      </v-container>
    </div>
    <!-- نبذة عن المكتبة -->
    <div style="background-color: #fdfcf8;">
       <v-container class=" px-16">
        <div class="pb-8 d-flex">
          <v-img style="max-width:45px ; display: inline-block;" src="images/قسم-المكتبة.png"></v-img>
          <span class="text-md-h4 text-h6 ms-3 justify-self-center ">من هو قسم المكتبة</span>
        </div>
        <!-- <div class="w-75 mx-auto" v-html="sectionsInfo.library[0].about_section">
          
        </div> -->
      </v-container>

    </div>
    <!-- نبذة عن الاستطلاعات -->
    <div style="background-color: #eefcfd;">
       <v-container class=" px-16">
        <div class="pb-8 d-flex">
          <v-img style="max-width:45px ; display: inline-block;" src="images/قسم-الاستطلاعات.png"></v-img>
          <span class="text-md-h4 text-h6 ms-3 justify-self-center ">من هو قسم الاستطلاعات</span>
        </div>
        <!-- <div class="w-75 mx-auto" v-html="sectionsInfo.surveys[0].about_section">
          
        </div> -->
      </v-container>
    </div>
    <!-- نبذة عن المسابقات -->
    <div style="background-color: #fdfcf8;">
       <v-container class=" px-16">
        <div class="pb-8 d-flex">
          <v-img style="max-width:45px ; display: inline-block;" src="images/قسم-المسابقات.png"></v-img>
          <span class="text-md-h4 text-h6 ms-3 justify-self-center ">من هو قسم المسابقات</span>
        </div>
        <!-- <div class="w-75 mx-auto" v-html="sectionsInfo.competition[0].about_section">
          
        </div> -->
      </v-container>
    </div>
    <!-- نبذة عن الاخبارات -->
    <div style="background-color: #eefcfd;">
       <v-container class=" px-16">
        <div class="pb-8 d-flex">
          <v-img style="max-width:45px ; display: inline-block;" src="images/قسم-الإختبارات.png"></v-img>
          <span class="text-md-h4 text-h6 ms-3 justify-self-center ">من هو قسم الإختبارات</span>
        </div>
        <!-- <div class="w-75 mx-auto" v-html="sectionsInfo.exams[0].about_section">
          
        </div> -->
      </v-container>
    </div>
    <!-- نبذة عن الاستشارات -->
    <!-- <div style="background-color: #fdfcf8;">
       <v-container class=" px-16">
        <div class="pb-8 d-flex">
          <v-img style="max-width:45px ; display: inline-block;" src="images/قسم-الاستشارات.png"></v-img>
          <span class="text-md-h4 text-h6 ms-3 justify-self-center ">من هو قسم الاستشارات</span>
        </div>
        <div class="w-75 mx-auto">
          
        </div>
      </v-container>
    </div> -->
    
    <!-- نبذة عن الخدمات -->
    <div style="background-color: #fdfcf8;">
       <v-container class=" px-16">
        <div class="pb-8 d-flex">
          <v-img style="max-width:45px ; display: inline-block;" src="images/قسم-الخدمات.png"></v-img>
          <span class="text-md-h4 text-h6 ms-3 justify-self-center ">من هو قسم الخدمات</span>
        </div>
        <!-- <div class="w-75 mx-auto" v-html="sectionsInfo.services[0].about_section">
          
        </div> -->
      </v-container>
    </div>

    <v-dialog v-model="dialog" transition="dialog-top-transition" width="auto">
      <v-card elevation="4" class="text-center" max-width="300">
        <v-card-text class="text-h6">
          <v-card-title class="text-error text-h4">عفوا</v-card-title>
          <div class="">
            هذا القسم غير متاح حاليا نعمل على تجهيزه في أقرب وقت
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="flat" color="success" @click="dialog = false">موافق</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
const dialog = ref(false);
import { useSettingsStore } from "~/stores/useSettings";
import { useAuthStore } from "~/stores/useAuthStore";
const authStore = useAuthStore();
const { setToastMessage } = useSettingsStore();

useHead({
  title: 'القانوني - الصفحة الرئيسية',
  meta: [
    { name: "description", content: 'القانوني - الصفحة الرئيسية' },
    { property: "og:description", content: 'القانوني - الصفحة الرئيسية' },
    { property: "og:image", content: '/images/الشعار.png' },
    { name: "twitter:card", content: "summay_large_image" },
    { property: 'og:locale', content: 'ar_ar' },
    { property: 'og:url', content: 'https://alqanoni.com/' },
    { property: 'og:type', content: 'website' }

  ],
  link: [{ rel: 'canonical', href: 'https://alqanoni.com/' }],

});
const sectionsInfo = ref();
const { data, error } = await useSendRequest('/get-about-section-all', {
});

if (error.value) {
    setToastMessage('حدث خطأ ما');
}
if (data.value) {
    sectionsInfo.value = data.value.data
}
</script>

<style >
.swiper-pagination-bullet {
  width: 40px !important;
  border-radius: 10px;
}

.swiper-pagination-bullet-active {
  background: #008062;
}


.section21 {
  cursor: pointer;
  border: 1px solid #333;
  padding: 20px;
  border-radius: 10px;
}

.sectionBlog:hover {
  background-color: #8ac7f6 !important;
}

.sectionDiss:hover {
  background-color: #f3c7fa !important;
}

.sectionSur:hover {
  background-color: #c5faff !important;
}

.sectionlib:hover {
  background-color: #e7e2dc !important;
}

.sectionComp:hover {
  background-color: #fbe6bb !important;
}

.sectionExam:hover {
  background-color: #fedde4 !important;
}

.sectionEss:hover {
  background-color: #e4e9fc !important;
}

.sectionSer:hover {
  background-color: #e4fbe9 !important;
}
</style>