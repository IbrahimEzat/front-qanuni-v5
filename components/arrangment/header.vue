<template>
  <div class="px-2 py-3  bg-orange-lighten-5">
    <div
      class=" d-flex align-baseline justify-space-between"
    >
      <h3>ترتيب الاعضاء</h3>
      <div class="d-flex align-baseline">
        <h4 class="d-md-block d-none me-3">
        تحتوي المنصة على: <span class="text-red">{{ usersCount }} عضو</span>
        </h4>
        <!-- <div class="d-flex align-center" style="position: relative">
          <input
            style="
              min-width: 180px;
              border: 1px solid #333;
              border-radius: 10px;
              min-height: 34px;
            "
            type="text"
            class="px-2"
            placeholder="ابحث"
          />
          <v-icon
            icon="mdi-magnify"
            size="small"
            style="position: absolute; top: 6px; left: 2px"
          ></v-icon>
        </div> -->
        <!-- <v-text-field density="compact" style="min-width: 200px;" variant="outlined" label="ابحث" append-inner-icon="mdi-magnify"></v-text-field> -->
      </div>
    </div>
    <h4 class="d-md-none d-block me-3">
      تحتوي المنصة الان على : <span class="text-red">{{ usersCount }} عضو</span>
    </h4>
  </div>
</template>

<script setup lang="ts">
defineProps({
  usersCount:{
    type:Number,
    default:0
  }
})
</script>

<style>
</style>