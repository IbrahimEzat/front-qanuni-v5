<template>
  <div>
    <div class="text-center my-3">
      <div class="d-flex  justify-center pointer"  @click="$router.push('/profile/'+userId)">
        <v-avatar size="100px" >
          <v-img alt="Avatar" :src="userImage"></v-img>
        </v-avatar>
      </div>
      <p class="text-md-h5 text-h6 mt-3">
        {{ userName }}
      </p>
      <p class="text-md-h5 text-h6 mt-3">
        {{ userJob }}
        </p>
        <p class=" d-flex justify-center text-md-h5 text-h6 mt-3">
                <span>عدد الأوسمة التي حصل عليها :</span>
                <user-bades class="" :userId="userId" />
        </p>
          <follow :id="userId" class="mt-3"/>
        
    </div>
    <!-- <v-card color="black" class="bg-blue-grey-darken-5 rounded-t-xl">
      <div class="d-md-flex d-none">
        <div class="text-h5 mt-md-0 mt-4 d-flex align-center ps-sm-10 ps-16">
          <follow :id="userId" />
          <div class="imageHolder d-flex ms-1">
            <v-avatar size="80">
              <v-img class="pointer" cover :src="userImage" @click="$router.push('/profile/' + userId)"></v-img>
            </v-avatar>
          </div>
          <p class="text-h5 mr-3">
            {{ userName }}
          </p>

        </div>
        <v-divider class="mt-5 d-md-none d-block"></v-divider>
        <div class="pr-1 d-flex mr-sm-11 mr-0 py-5">
          <div class="mr-sm-5 mr-8 align-self-center d-md-none d-flex" style="width: 100%">
            <div class="d-flex justify-space-between px-1" style="width: 100%">
              <p>({{ userJob }})</p>
              <span class="mx-1 d-flex align-center">الأوسمة التي حصل عليها : <user-bades class="mx-2"
                  :userId="userId" /></span>
              <span>
                نقاط الكاتب :
                <span class="text-blue">{{ userPoints }}</span></span>
            </div>
          </div>
          <div class="mr-sm-5 mr-8 align-self-center d-md-flex d-none">
            <div>
              <p>({{ userJob }})</p>
              <p class="mx-1 d-flex align-center">
                الأوسمة التي حصل عليها :
                <user-bades class="mx-2" :userId="userId" />
              </p>
              <p>
                نقاط الكاتب :
                <span class="text-blue">{{ userPoints }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="d-md-none d-block text-center py-5 px-1">
        <div class="imageHolder">
          <v-avatar size="80">
            <v-img class="pointer" cover :src="userImage" @click="$router.push('/profile/' + userId)"></v-img>
          </v-avatar>
        </div>
        <p class="text-h5">
          {{ userName }}
        </p>
        <v-divider color="white" class="my-2"></v-divider>
        <follow :id="userId" />
        <v-divider color="white" class="my-2"></v-divider>
        <div class="d-flex justify-space-around px-1 my-4" style="width: 100%">
          <p>({{ userJob }})</p>

          <span>
            نقاط الكاتب :
            <span class="text-blue">{{ userPoints }}</span></span>
        </div>
        <v-divider color="white" class="my-2"></v-divider>
        <div class="mx-1 justify-center d-flex align-center">
          الأوسمة التي حصل عليها : <user-bades class="mx-2" :userId="userId" />
        </div>
      </div>
    </v-card> -->
  </div>
</template>

<script setup lang="ts">
defineProps(["userId", "userName", "userImage", "userJob", "userPoints"]);
</script>

<style></style>