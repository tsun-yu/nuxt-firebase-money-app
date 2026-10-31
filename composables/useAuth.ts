interface SessionUser {
    uid: string;
    email: string | null;
}

/**
 * 前端的登入狀態管理。
 * 注意：這裡完全沒有 Firebase 設定，只是呼叫自家的 /api/auth/* 路由。
 * 真正的身份驗證是由 server 端的 httpOnly session cookie 完成。
 */
export const useAuth = () => {
    const user = useState<SessionUser | null>("auth:user", () => null);
    const ready = useState<boolean>("auth:ready", () => false);

    const fetchUser = async () => {
        try {
            const { user: fetched } = await $fetch<{ user: SessionUser | null }>("/api/auth/me");
            user.value = fetched;
        } catch {
            user.value = null;
        } finally {
            ready.value = true;
        }
        return user.value;
    };

    const login = async (email: string, password: string) => {
        await $fetch("/api/auth/login", { method: "POST", body: { email, password } });
        await fetchUser();
    };

    const register = async (email: string, password: string) => {
        await $fetch("/api/auth/register", { method: "POST", body: { email, password } });
        await fetchUser();
    };

    const logout = async () => {
        await $fetch("/api/auth/logout", { method: "POST" });
        user.value = null;
    };

    return {
        user: readonly(user),
        ready: readonly(ready),
        isLoggedIn: computed(() => !!user.value),
        fetchUser,
        login,
        register,
        logout,
    };
};
