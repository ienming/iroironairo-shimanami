import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

export default defineNuxtPlugin(nuxtApp => {
    //useRuntimeConfig 可以取得 runtime 時
    //在 nuxt.confdig.ts 設定暴露的 config
    //如果有在根目錄建立 .env 檔案，則 .env 裡面的值會覆蓋掉原本 config.ts 中設定的預設值
    const runtimeConfig = useRuntimeConfig().public
    const { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } = runtimeConfig

    const firebaseConfig = {
        apiKey,
        authDomain,
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
        measurementId,
    };

    const app = initializeApp(firebaseConfig);
    const fireStorage = getStorage(app);

    nuxtApp.provide('fireStorage', fireStorage);
})