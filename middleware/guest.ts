import { useAuthStore } from "~/stores/useAuthStore"

export default defineNuxtRouteMiddleware((to, from) => {
    const {isLogin,tryLogin} = useAuthStore();
    tryLogin();    
    if(isLogin){
        console.log(from.path);
        if(from.path && from.path !== '/login' && from.path !== '/signup' && from.path !== '/forgetPassword')
            return navigateTo(from.path);
        return navigateTo('/');    
    }
})