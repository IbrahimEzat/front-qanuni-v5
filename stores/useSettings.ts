export const useSettingsStore = defineStore('useSettingsStore', {
    state: () => {
        return {
            toastMessage: '',
            isToastFound: false,
            domain: 'http://127.0.0.1:8000/api',
            // notificationMessages:[] as any[],
            realTimeNotification: [] as any[],
            notificationMessages: new Map(),
            countUnreadNotification: 0
        }
    },
    getters: {
        isHasNotification(): boolean {
            return this.notificationMessages.size > 0 || this.realTimeNotification.length > 0;
        },
        isHasUnreadNotification(): boolean {
            return this.countUnreadNotification > 0;
        }
    },
    actions: {
        setToastMessage(msg: string) {
            this.toastMessage = msg;
            this.isToastFound = true;
        },
        clearToastMessage() {
            this.toastMessage = '';
            this.isToastFound = false;
        },
        setNotificationMesseges(notificaions: any[]) {
            // this.notificationMessages = notificaions;
            for (let item of notificaions) {
                this.notificationMessages.set(item.id, item);
            }
        },
        loadMoreNotificationMessages(notificaions: any[]) {
            for (let item of notificaions) {
                let el = this.realTimeNotification.find(el => { return el.id === item.id })
                if (!el)
                    this.notificationMessages.set(item.id, item);
            }
            // this.notificationMessages.push(...notificaions);
        },
        addNewNotification(notification: any) {
            this.realTimeNotification.unshift(notification);
            this.countUnreadNotification++;


            // this.countUnreadNotification++;
            // this.notificationMessages.unshift(notification);
            // if(!this.notificationMessages.has(notification.id)){
            // this.notificationMessages.set(notification.id,notification);
            // this.countUnreadNotification++;
            // }
        },
        setCountUnreadNotification(count: number) {
            this.countUnreadNotification = count;
        },
        markNotificatinAsRead(notification: any) {
            // notification.read_at = true;
            if (this.notificationMessages.has(notification.id)) {
                this.notificationMessages.get(notification.id).read_at = true;
            } else {
                notification.read_at = true;
            }
            this.countUnreadNotification--;

        }
    }
})