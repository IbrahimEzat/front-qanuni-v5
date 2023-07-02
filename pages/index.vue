<template>
  <div>
    <v-container class="mt-10">
      <v-row>
        <v-col class="mb-10" cols="6" sm="6" md="3">
          <div class="section">
            <NuxtLink to="/blogs">
              <div class="imageHolder">
                <v-img
                  :width="200"
                  style="width: 100%; height: 200px"
                  src="images/مقالات.png"
                ></v-img>
              </div>
              <div class="sectionFooter rounded-b-xl">
                <h3 class="text-center">مقالات</h3>
              </div>
            </NuxtLink>
          </div>
        </v-col>
        <v-col class="mb-10" cols="6" sm="6" md="3">
          <div class="section">
            <NuxtLink to="/discussions">
              <div class="imageHolder">
                <v-img
                  :width="200"
                  style="width: 100%; height: 200px"
                  src="images/مناقشات.png"
                ></v-img>
              </div>
              <div class="sectionFooter rounded-b-xl">
                <h3 class="text-center">مناقشات</h3>
              </div>
            </NuxtLink>
          </div>
        </v-col>
        <v-col class="mb-10" cols="6" sm="6" md="3">
          <div class="section">
            <NuxtLink to="/library">
              <div class="imageHolder">
                <v-img
                  :width="200"
                  style="width: 100%; height: 200px"
                  src="images/المكتبة.png"
                ></v-img>
              </div>
              <div class="sectionFooter rounded-b-xl">
                <h3 class="text-center">المكتبة</h3>
              </div>
            </NuxtLink>
          </div>
        </v-col>
        <v-col class="mb-10" cols="6" sm="6" md="3">
          <div class="section">
            <NuxtLink to="/surveys">
              <div class="imageHolder">
                <v-img
                  :width="200"
                  style="width: 100%; height: 200px"
                  src="images/استطلاعات.png"
                ></v-img>
              </div>
              <div class="sectionFooter rounded-b-xl">
                <h3 class="text-center">استطلاعات</h3>
              </div>
            </NuxtLink>
          </div>
        </v-col>

        <v-col class="mb-10" cols="6" sm="6" md="3">
          <div class="section">
            <NuxtLink to="/competitions">
              <div class="imageHolder">
                <v-img
                  :width="200"
                  style="width: 100%; height: 200px"
                  src="images/مسابقات.png"
                ></v-img>
              </div>
              <div class="sectionFooter rounded-b-xl">
                <h3 class="text-center">مسابقات</h3>
              </div>
            </NuxtLink>
          </div>
        </v-col>
        <v-col class="mb-10" cols="6" sm="6" md="3">
          <div class="section">
            <NuxtLink to="/exams">
              <div class="imageHolder">
                <v-img
                  :width="200"
                  style="width: 100%; height: 200px"
                  src="images/اختبارات.png"
                ></v-img>
              </div>
              <div class="sectionFooter rounded-b-xl">
                <h3 class="text-center">اختبارات</h3>
              </div>
            </NuxtLink>
          </div>
        </v-col>
        <v-col @click="dialog=true" class="mb-10" cols="6" sm="6" md="3">
          <div class="section">
            <NuxtLink>
              <div class="imageHolder">
                <v-img
                  :width="200"
                  style="width: 100%; height: 200px"
                  src="images/استشارات.png"
                ></v-img>
              </div>
              <div class="sectionFooter rounded-b-xl">
                <h3 class="text-center">استشارات</h3>
              </div>
            </NuxtLink>
          </div>
        </v-col>
        <v-col class="mb-10" cols="6" sm="6" md="3">
          <div class="section">
            <NuxtLink to="/services">
              <div class="imageHolder">
                <v-img
                  :width="200"
                  style="width: 100%; height: 200px"
                  src="images/market.png"
                ></v-img>
              </div>
              <div class="sectionFooter rounded-b-xl">
                <h3 class="text-center">خدمات</h3>
              </div>
            </NuxtLink>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog" transition="dialog-top-transition" width="auto">
      <v-card elevation="4" class="text-center" max-width="300">
        <v-card-text class="text-h6">
          <v-card-title class="text-error text-h4">عفوا</v-card-title>
          <div class="">
            هذا القسم غير متاح حاليا نعمل على تجهيزه في أقرب وقت
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="flat" color="success" @click="dialog = false"
            >موافق</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
const dialog = ref(false);

useHead({
  title:'القانوني - الصفحة الرئيسية',
  meta: [
    { name: "description", content: 'القانوني - الصفحة الرئيسية' },
    { property: "og:description", content: 'القانوني - الصفحة الرئيسية' },
    { property: "og:image", content: '/images/الشعار.png' },
    { name: "twitter:card", content: "summay_large_image" },
    { property:'og:locale',content:'ar_ar'},
    { property:'og:url',content:'https://alqanouni.com/'},
    { property:'og:type',content:'website'}

  ],
  link:[{rel:'canonical',href:'https://alqanouni.com/'}],

});
</script>

<style scoped>
.section {
  height: 250px;
  cursor: pointer;
}
.imageHolder {
  width: 100%;
}
.sectionFooter {
  background-color: #333;
  height: 50px;
  color: white;
}

.sectionFooter h3 {
  font-size: 32px;
}

a{
  text-decoration: none;
}
</style>