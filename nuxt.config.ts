// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-07-30",
    devtools: { enabled: true },
    // 前端維持 SPA 模式，但 Nitro 依然會產生 server bundle 來處理 server/api 的路由，
    // 因此 Firebase 憑證只存在於伺服器端。
    ssr: false,
    modules: ["@nuxt/icon"],
    css: ["~/assets/scss/main.scss"],
    app: {
        head: {
            title: "Firebase - Nuxt",
            meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
        },
    },
    // 全部放在 runtimeConfig 頂層（非 public），只有 server/ 底下的程式碼讀得到，
    // 不會被打包進瀏覽器的 JS bundle。
    runtimeConfig: {
        firebaseApiKey: process.env.FIREBASE_API_KEY,
        firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
        firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
        public: {},
    },
});
