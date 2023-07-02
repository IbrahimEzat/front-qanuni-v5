<template>
  <div class="bg-grey-lighten-3 pointer" @click="$router.push('/library/view/' + library.id)">
    <div class="d-flex pa-4">
      <v-img
        :src="library.file_cover"
        height="160"
        max-width="115"
        min-width="115"
        cover
        class="rounded-lg me-3"
      ></v-img>
      <div>
        <p class="text-h6 my-1">{{ library.file_name }}</p>
        <p class="font-weight-medium">
          المؤلف : <span class="text-red">{{ library.author_name }}</span>
        </p>
        <p class="font-weight-medium">
          رفعه بالموقع : <span>{{ library.user.name }}</span>
        </p>
        <p class="font-weight-medium">
          قيمة التحميل :
          <span class="text-lime-darken-1"
            >{{ useFormatNumber(library.points ?? 0) }} نقطة</span
          >
        </p>
        <p class="font-weight-medium">
          نوع الملف :
          <span class="text-green">{{ formatFileType }}</span>
        </p>
        <p class="font-weight-medium">
          حقوق الملكية :
          <span class="text-green">{{ formatFilePropertyRights }}</span>
        </p>
      </div>
    </div>
    <v-divider class="border-opacity-100"></v-divider>

    <div class="py-1 d-flex text-body-2 font-weight-bold">
      <div class="me-2">
        <span class="mdi mdi-calendar-month-outline me-1"></span>
        <span>{{
          new Date(library.created_at).toLocaleDateString(["ban", "id"])
        }}</span>
      </div>
      <div class="me-2">
        <span class="mdi mdi-eye me-1"></span>
        <span>{{ useFormatNumber(library.library_view.views_count ?? 0) }}</span>
      </div>
      <div class="me-2">
        <span class="mdi mdi-message-processing text-red me-1"></span>
        <span>{{ useFormatNumber(library.library_comment_count.comment_count ?? 0) }}</span>
      </div>
      <div class="me-2">
                    <span class="mdi mdi-star text-yellow me-1"></span>
                    <span>{{ useFormatNumber(library.library_wish_list_count.wishlist_count) }}</span>
                  </div>
      <div class="me-2 d-flex">
        <div class="d-flex flex-column">
          <span
            class="mdi mdi-chevron-up mb-3 text-blue"
            style="
              font-size: 25px;
              margin: 0 !important;
              max-height: 8px;
              margin-top: -2px;
            "
          ></span>
          <span
            class="mdi mdi-chevron-down text-red"
            style="font-size: 25px; margin: 0 !important; max-height: 8px"
          ></span>
        </div>
        <span>{{ useFormatNumber(library.library_point_count.point_count ?? 0) }}</span>
      </div>
      <div class="d-flex">
        <span
          class="mdi mdi-tray-arrow-down text-green"
          style="font-size: 20px"
        ></span>
        <span>{{ useFormatNumber(library.library_download_count.download_count ?? 0) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["library"]);

const formatFileType = computed(() => {
  if (props.library.file_property.file_type == "pdf") {
    return "مستند منقول PDF";
  } else if (props.library.file_property.file_type == "docs") {
    return "قابل للتحرير DOC";
  } else if (props.library.file_property.file_type == "image") {
    return "صور";
  } else if (props.library.file_property.file_type == "paper") {
    return "ملف ورقي";
  }
});

const formatFilePropertyRights = computed(() => {
  if (props.library.file_property.property_rights == "public") {
    return "ملكية عامة";
  } else if (props.library.file_property.property_rights == "author") {
    return "رفعه المؤلف بنفسه";
  } else if (props.library.file_property.property_rights == "allowed") {
    return "سمح المؤلف بنشره";
  } else if (props.library.file_property.property_rights == "not_allowed") {
    return "غير مسموح بنشره";
  }
});

</script>

<style>
.pointer{
    cursor: pointer;
}
.mdi-tray-arrow-down::before {
    font-size: 20px !important;
}
</style>