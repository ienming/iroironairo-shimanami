<template>
  <section>
    <div
      class="container">
      <p>contents</p>
      <button @click="loadImage('IMG_4535')">Get image</button>
      <div v-if="imageIsLoading">
        <p>Loading image...</p>
      </div>
      <div v-else>
        <img :src="imageUrl" alt="Firebase Image" v-if="imageUrl" style="width: 600px" />
      </div>
      <div class="divider">
        ...
      </div>
      <div
        class="target"
        data-zoom-to="sannomiya">
        <p>Zoom in to Sannomiya</p>
      </div>
      <div class="divider">
        ...
      </div>
      <div
        class="target"
        data-zoom-to="kyoto">
        <p>Zoom in to kyoto</p>
      </div>
      <div class="divider">
        ...
      </div>
      <div
        class="target"
        data-zoom-to="shizuoka">
        <p>Zoom in to shizuoka</p>
      </div>
      <div class="divider">
        ...
      </div>
      <div
        class="target"
        data-zoom-to="nikko">
        <p>Zoom in to nikko</p>
      </div>
      <div class="divider">
        ...
      </div>
    </div>
    <Map :zoom-to="nowZoomedTo" />
  </section>
</template>

<script setup>
import { getDownloadURL, ref as storageRef } from 'firebase/storage';

const imageUrl = ref(null);
const imageIsLoading = ref(false);
const nowZoomedTo = ref('');

async function loadImage(imgName) {
  //useNuxtApp 取得 nuxt context
  //nuxtApp.provide 的變數名稱前方會加上一個 $
  //格式為 nuxtApp.provide(name, value)
  //此處是 plugins/firebase.client.js 裡面 provide 出來了 $firestorage
  const { $fireStorage } = useNuxtApp();

  imageIsLoading.value = true;
  const imagePath = storageRef($fireStorage, `photos/${imgName}.JPG`);

  try {
    imageUrl.value = await getDownloadURL(imagePath);
  } catch (error) {
    console.error("Error fetching image URL:", error);
  }

  imageIsLoading.value = false;
}

onMounted(() => {
  window.addEventListener('scroll', onScroll);
  createObserve();
})

function onScroll(e) {
  // console.log(window.scrollY);
}

function createObserve() {
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  const observer = new IntersectionObserver(observeHandler, options);

  const targets = document.querySelectorAll(".target");
  targets.forEach(target => {
    observer.observe(target);
  });
}

function observeHandler(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      nowZoomedTo.value = entry.target.dataset['zoomTo'];
    }
  });
}
</script>

<style lang="scss" scoped>
.divider {
  height: 95vh;
}

.container {
  position: relative;
  z-index: 1;
  min-height: 1800px;
  border: 1px solid #000;
  pointer-events: none;
}
</style>
