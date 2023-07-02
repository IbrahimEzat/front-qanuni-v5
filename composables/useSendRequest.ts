import { useSettingsStore } from "~/stores/useSettings";

export default async <T>(url: string, payload: any) => {
    const{domain} = useSettingsStore();
    //set option lazy for custom pending and custom laoding
    const urlSend = domain + url;
    const { data, error } = await useFetch<T, Error, string, 'post' | 'get'>(urlSend, { method: 'post', body: payload });
    return {
        data,
        error
    };
}