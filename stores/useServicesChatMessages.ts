
export const useServicesChatMessages = defineStore('useServicesChatMessages', {
    state: () => {
        return {
            realTimeMessagesForService: [] as any[]
        }
    },
    getters: {
    },
    actions: {

        addMessageToRealTimeMessages(data: any) {
            const route = useRoute();
            console.log(route.path);
            
            console.log(route.path.startsWith('/services/holdings/') && route.path.endsWith('details'));
            if (!route.path.startsWith('/services/holdings/') || !route.path.endsWith('details')) return;
            if (route.params.id == data.subscribe_id) {
                this.realTimeMessagesForService.unshift(data);
            }
        }
    }
})