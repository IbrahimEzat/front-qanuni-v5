import { useAuthStore } from "./useAuthStore";

export const useChatStore = defineStore('useChatStore', {
    state: () => {
        return {
            chatConnects: [] as any[],

            // isInitialConnects:true
            // isInChatPage: false,
            // currentChatOtherSideId: -1,
            realTimeMessagesForCurrentChat: [] as any[]
        }
    },
    getters: {
        getTopConnect(): any {
            return this.chatConnects[0] ?? null;
        },
        getConnects(): any[] {
            return this.chatConnects;
        },
        isHasNewMessage(): boolean {
            const { token } = useAuthStore();
            for (let i of this.chatConnects) {
                if (i.last_chat_message && !i.last_chat_message.is_read && i.last_chat_message.message.user_send_id !== token.user_id)
                    return true;
            }
            return false;
        },

    },
    actions: {
        setChatMesseges(connects: any[]) {
            this.chatConnects = connects;
        },

        addNewNotification(connect: any) {
            // console.log('dddd');
            // return;
            // this.isInitialConnects = false;
            this.chatConnects = this.chatConnects.filter((item) => { return item.id !== connect.id })
            this.chatConnects.unshift(connect);
            console.log('dddd');
            
            const route = useRoute();
            console.log(route.path.startsWith('/chat/'));
            
            if (!route.path.startsWith('/chat/')) return;
            if (route.params.user_id == connect.user_id1 || route.params.user_id == connect.user_id2) {
                this.realTimeMessagesForCurrentChat.unshift(connect.last_chat_message.message);
            }
        },
        addMessageToRealTimeMessages(message: any) {
            this.realTimeMessagesForCurrentChat.unshift(message);
        }
        ,
        markchatConnectAsRead(chat: any) {
            chat.last_chat_message.is_read = true;
        }
    }
})