import { responseReturn, tokenType } from "~/types/tpes"
import { useSettingsStore } from "./useSettings";

export const useAuthStore = defineStore('useAuthStore', {

    state: () => {
        return {

            token: <tokenType>{
                returnedToken: '',
                id: -1,
                user_id: -1,
            },
            user_image: '',
            user_type: '',
            tokenCookieShortcut: 'tf'
        }
    },
    getters: {
        isLogin(): boolean {
            return this.token.returnedToken !== '';
        },
        isAdmin(): boolean {
            return this.user_type === 'admin';
        }
    },
    actions: {
        async tryLogin() {
            const { setToastMessage } = useSettingsStore();

            if (this.token.returnedToken === '') {
                const tokenFromCookie = useCookie<{ token: tokenType, user_type: string, user_image: string }>(this.tokenCookieShortcut);

                if (tokenFromCookie.value) {
                    const { data, error } = await useSendRequest<any>('/checkToken', { 'token': tokenFromCookie.value.token });
                    if (error.value)
                        return setToastMessage(error.value.message)

                    if (!data.value.status) return;
                    this.token = tokenFromCookie.value.token;
                    this.user_type = tokenFromCookie.value.user_type;
                    this.user_image = tokenFromCookie.value.user_image;
                }
            }
        },
        async logout() {
            const { data, error } = await useSendRequest<responseReturn>('/logout', { 'token': this.token });
            if (!error.value && data.value?.status) {
                const tokenFromCookie = useCookie<{ token: tokenType, user_type: string } | null>(this.tokenCookieShortcut);
                this.token = {
                    returnedToken: '',
                    id: -1,
                    user_id: -1
                };
                this.user_type = '';
                this.user_image = '';
                if (tokenFromCookie.value) {
                    tokenFromCookie.value = null;
                }
                window.location.href = "/";
            }
        }
    }
})
