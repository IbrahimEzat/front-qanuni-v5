import { useAuthStore } from "~/stores/useAuthStore"

export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client) {
        const { isLogin, tryLogin } = useAuthStore();
        tryLogin();
        if (!isLogin) {
            console.log('not login');

            window.location.href = "/login?redirect=" + from.path;  // this reloads
            // return navigateTo('/login?redirect=' + from.path);
        }
    }

})
