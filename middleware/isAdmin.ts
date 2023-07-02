import { useAuthStore } from "~/stores/useAuthStore"

export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return;
    const { isLogin, isAdmin } = useAuthStore();
    if (!isLogin) {
        return navigateTo('/login?redirect=' + from.path);
    }
    if (!isAdmin) {
        if (from.path && from.path !== to.path)
            return navigateTo(from.path);
        return navigateTo('/');
    }

})