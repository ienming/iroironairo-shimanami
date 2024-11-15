<template>
  <div>
    <img :src="imageUrl" alt="Firebase Image" v-if="imageUrl" style="width: 600px" />
    <p v-else>Loading image...</p>
  </div>
</template>

<script setup>
import { getDownloadURL, ref as storageRef } from 'firebase/storage';

const imageUrl = ref(null);

onMounted(async () => {
  //useNuxtApp 取得 nuxt context
  //nuxtApp.provide 的變數名稱前方會加上一個 $
  //格式為 nuxtApp.provide(name, value)
  //此處是 plugins/firebase.client.js 裡面 provide 出來了 $firestorage
  const { $fireStorage } = useNuxtApp();

  const imagePath = storageRef($fireStorage, 'photos/IMG_4535.JPG');

  try {
    imageUrl.value = await getDownloadURL(imagePath);
  } catch (error) {
    console.error("Error fetching image URL:", error);
  }
});
</script>