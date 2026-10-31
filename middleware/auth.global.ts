/**
 * 全域路由守衛：僅作為使用者體驗上的導向，
 * 真正的權限控管在 server/api 的 requireUser()。
 */
export default defineNuxtRouteMiddleware(async (to) => {
    const { user, ready, fetchUser } = useAuth();

    if (!ready.value) await fetchUser();

    const isLoginPage = to.path === "/login";

    if (!user.value && !isLoginPage) return navigateTo("/login");
    if (user.value && isLoginPage) return navigateTo("/");
});
