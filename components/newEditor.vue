<template>
  <div id="summernote"></div>
</template>

<script setup lang="ts">
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
onMounted(() => {
  $(document).ready(function () {
    $("#summernote").summernote();
  });
});
</script>

<style>
.modal-backdrop {
  position: relative !important;
}
.note-editor.note-frame .note-editing-area .note-editable {
  direction: rtl !important;
}

</style>