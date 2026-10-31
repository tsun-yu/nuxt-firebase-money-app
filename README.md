# Firebase - Nuxt

以 Nuxt 3 重寫的 `firebase-react` 專案，功能與畫面一致。

## 對照表

| React (firebase-react)                    | Nuxt (firebase-nuxt)                          |
| ----------------------------------------- | --------------------------------------------- |
| src/App.tsx                               | app.vue                                       |
| src/router.tsx                            | pages/ 目錄（檔案式路由）                     |
| src/pages/Home.tsx                        | pages/index.vue                               |
| src/pages/Login.tsx                       | pages/login.vue                               |
| src/pages/ErrorPage.tsx                   | error.vue                                     |
| src/components/common/Header.tsx          | components/common/Header.vue                  |
| src/components/common/Sidebar.tsx         | components/common/Sidebar.vue                 |
| src/components/common/Hamburger.tsx       | components/common/Hamburger.vue               |
| src/components/Button.tsx                 | components/Button.vue                         |
| src/components/home/Item.tsx              | components/home/Item.vue                      |
| src/components/loginPage/LoginSection.tsx | components/loginPage/LoginSection.vue         |
| src/util/firebase.ts                      | server/utils/firebaseAdmin.ts（改為伺服器端） |
| src/util/errorMessages.ts                 | utils/errorMessages.ts                        |
| styled-components                         | `<style scoped lang="scss">`                  |
| react-icons                               | @nuxt/icon (`<Icon name="..." />`)            |

## 安全性架構

Firebase 憑證**完全不會出現在前端**，所有與 Firebase 的溝通都經由自家的 API 路由：

```
瀏覽器  ──fetch──▶  server/api/*  ──▶  Firebase Admin SDK / Identity Toolkit
（無任何金鑰）      （Vercel Serverless Function，讀取環境變數）
```

- `runtimeConfig` 全部放在非 `public` 區塊，只有 `server/` 底下的程式碼讀得到。
- 登入後以 **httpOnly session cookie** 保存狀態，JS 無法讀取，可防止 XSS 竊取。
- 每支 API 都會呼叫 `requireUser()` 驗證身份，且資料以 `uid` 隔離，使用者無法存取他人資料。
- 金額、日期等欄位一律在 server 端重新驗證／產生，不信任前端傳來的值。

### API 路由

| 方法   | 路徑               | 說明                      |
| ------ | ------------------ | ------------------------- |
| POST   | /api/auth/login    | 登入並設定 session cookie |
| POST   | /api/auth/register | 註冊並設定 session cookie |
| POST   | /api/auth/logout   | 清除 session cookie       |
| GET    | /api/auth/me       | 取得目前登入者            |
| GET    | /api/items         | 取得自己的項目清單        |
| POST   | /api/items         | 新增項目                  |
| PUT    | /api/items/:id     | 更新項目                  |
| DELETE | /api/items/:id     | 刪除項目                  |

## 開始

```bash
cd firebase-nuxt
cp .env.example .env   # 填入 Firebase 設定
npm install
npm run dev
```

### 環境變數

到 Firebase Console → 專案設定 → 服務帳戶 → **產生新的私密金鑰**，取得 JSON 後填入：

| 變數                    | 說明                                     |
| ----------------------- | ---------------------------------------- |
| `FIREBASE_API_KEY`      | Web API Key（僅 server 端呼叫登入 API）  |
| `FIREBASE_PROJECT_ID`   | 服務帳戶 JSON 的 `project_id`            |
| `FIREBASE_CLIENT_EMAIL` | 服務帳戶 JSON 的 `client_email`          |
| `FIREBASE_PRIVATE_KEY`  | 服務帳戶 JSON 的 `private_key`（含引號） |

部署到 Vercel 時，於 **Settings → Environment Variables** 加入以上四項即可，`.env` 請勿 commit。

Firestore 使用的 collection 名稱為 `admin`，文件欄位為 `uid`、`item`、`dollar`、`date`。
由於改用 Admin SDK，Firestore Security Rules 可全部關閉對外存取（deny all），
因為前端已無法直接連線 Firestore。
