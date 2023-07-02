<template>
  <div class="my-5">
    <div :id="id" class="content"></div>
    <div
      style="font-size: 15px"
      class="text-black mb-10 font-weight-medium d-flex justify-space-between"
    >
      <p v-show="counter !== 0">عدد كلمات المقالة يجب ان يزيد عن 300 كلمة</p>
      <p v-show="counter !== 0" :id="counter_id"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  link: [
    {
      rel: "stylesheet",
      type: "text/css",
      href: "https://cdn.quilljs.com/1.3.6/quill.snow.css",
    },
  ],
  script: [
    {
      src: "https://cdn.quilljs.com/1.3.6/quill.js",
    },
  ],
});
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

// const emit = defineEmits(['returnContent']);
const props = defineProps({
  id: { type: String },
  counter_id: { type: String },
  counter: { type: Number, default: 0 },
});

const wordCount = ref(0);
function initEditor() {
  class Counter {
    quill: any;
    options: any;
    container: any;
    constructor(quill: any, options: any) {
      this.quill = quill;
      this.options = options;
      this.container = document.querySelector(options.container);
      quill.on("text-change", this.update.bind(this));
      this.update(); // Account for initial contents
    }

    calculate() {
      let text = this.quill.getText();
      if (this.options.unit === "word") {
        text = text.trim();
        // Splitting empty text returns a non-empty array
        return text.length > 0 ? text.split(/\s+/).length : 0;
      } else {
        return text.length;
      }
    }

    update() {
      var length = this.calculate();
      var label = this.options.unit;
      if (length !== 1) {
        label += "s";
      }
      wordCount.value = length;
      this.container.innerText = "عدد الكلمات" + " : " + length;
    }
  }

  Quill.register("modules/counter", Counter);
  var quill = new Quill("#" + props.id, {
    theme: "snow",
    modules: {
      toolbar: toolbarOptions,
      counter: {
        container: "#" + props.counter_id,
        unit: "word",
      },
    },
  });
  quill.format("align", "right");
  return quill;
}
onMounted(() => {
  let interval = setInterval(() => {
    console.log("interval");
    if (initEditor()) clearInterval(interval);
  }, 100);
});
</script>

<style scoped>
.content img {
  max-width: 100%;
  max-height: 500px;
}
</style>