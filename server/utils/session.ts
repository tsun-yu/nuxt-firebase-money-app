import type { H3Event } from "h3";

export const SESSION_COOKIE = "__session";

/** Session cookie 有效期限：5 天 */
export const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000;

export const setSessionCookie = (event: H3Event, sessionCookie: string) => {
    setCookie(event, SESSION_COOKIE, sessionCookie, {
        httpOnly: true, // JS 讀不到，可防止 XSS 竊取
        secure: !import.meta.dev, // 正式環境僅透過 HTTPS 傳送
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE_MS / 1000,
    });
};

export const clearSessionCookie = (event: H3Event) => {
    deleteCookie(event, SESSION_COOKIE, { path: "/" });
};

/**
 * 驗證 session cookie，回傳解碼後的使用者資訊。
 * 驗證失敗時回傳 null。
 */
export const getSessionUser = async (event: H3Event) => {
    const cookie = getCookie(event, SESSION_COOKIE);
    if (!cookie) return null;

    try {
        const decoded = await adminAuth().verifySessionCookie(cookie, true);
        return { uid: decoded.uid, email: decoded.email ?? null };
    } catch {
        return null;
    }
};

/**
 * 保護 API 用：未登入直接丟出 401，後續程式碼不會執行。
 */
export const requireUser = async (event: H3Event) => {
    const user = await getSessionUser(event);
    if (!user) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    return user;
};
