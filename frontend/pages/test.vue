<template>
    <div>
      <img :src="imageUrl" alt="Firebase Image" v-if="imageUrl" />
      <p v-else>Loading image...</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getDownloadURL, ref as storageRef } from 'firebase/storage';
  
  const imageUrl = ref(null);
  
  onMounted(async () => {
    const { $fireStorage } = useNuxtApp(); // 使用 $fireStorage
  
    const imagePath = storageRef($fireStorage, 'photos/IMG_4535.JPG'); // 指定 Firebase Storage 中的路徑
  
    try {
      imageUrl.value = await getDownloadURL(imagePath); // 取得圖片的下載 URL
    } catch (error) {
      console.error("Error fetching image URL:", error);
    }
  });
  </script>
  