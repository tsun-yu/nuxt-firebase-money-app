import type { H3Event } from "h3";

interface IdentityToolkitResponse {
    idToken: string;
    email: string;
    localId: string;
    refreshToken: string;
}

/**
 * 呼叫 Firebase Identity Toolkit REST API。
 * API Key 只在此處（server 端）使用，不會外流到瀏覽器。
 */
export const identityToolkit = async (
    endpoint: "signInWithPassword" | "signUp",
    email: string,
    password: string,
): Promise<IdentityToolkitResponse> => {
    const apiKey = useRuntimeConfig().firebaseApiKey;
    if (!apiKey) {
        throw createError({ statusCode: 500, statusMessage: "FIREBASE_API_KEY 未設定" });
    }

    try {
        return await $fetch<IdentityToolkitResponse>(
            `https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}`,
            {
                method: "POST",
                query: { key: apiKey },
                body: { email, password, returnSecureToken: true },
            },
        );
    } catch (error: any) {
        // Firebase 回傳格式：{ error: { message: "EMAIL_NOT_FOUND", ... } }
        const code = error?.data?.error?.message ?? "UNKNOWN_ERROR";
        throw createError({ statusCode: 400, statusMessage: code, data: { code } });
    }
};

/** 基本的輸入驗證，避免把垃圾資料直接送到 Firebase */
export const readCredentials = async (event: H3Event) => {
    const body = await readBody<{ email?: string; password?: string }>(event);
    const email = body?.email?.trim() ?? "";
    const password = body?.password ?? "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw createError({ statusCode: 400, statusMessage: "INVALID_EMAIL", data: { code: "INVALID_EMAIL" } });
    }
    if (password.length < 6) {
        throw createError({ statusCode: 400, statusMessage: "WEAK_PASSWORD", data: { code: "WEAK_PASSWORD" } });
    }

    return { email, password };
};
