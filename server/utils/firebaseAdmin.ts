import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | undefined;

/**
 * 初始化 Firebase Admin SDK。
 * 這支檔案位於 server/ 底下，只會在 Nitro（Vercel Serverless Function）內執行，
 * 永遠不會被打包進前端 bundle，因此可以安全地讀取服務帳戶私鑰。
 */
const getAdminApp = (): App => {
    if (app) return app;
    if (getApps().length) {
        app = getApp();
        return app;
    }

    const config = useRuntimeConfig();
    const projectId = config.firebaseProjectId;
    const clientEmail = config.firebaseClientEmail;
    // .env 中的換行符號是以字面上的 "\n" 儲存，需還原成真正的換行
    const privateKey = config.firebasePrivateKey?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
        throw createError({
            statusCode: 500,
            statusMessage:
                "Firebase Admin 憑證未設定，請確認 FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY。",
        });
    }

    app = initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
    });
    return app;
};

export const adminAuth = (): Auth => getAuth(getAdminApp());

export const adminDb = (): Firestore => getFirestore(getAdminApp());
