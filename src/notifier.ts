import {OnValueUpdated} from "@/callback";

export type Notifier<T> = {
    $data: Map<keyof T, any>,
    $listeners: Map<keyof T, Set<OnValueUpdated<any>>>,
    $notify: <K extends keyof T>(key: K, oldValue: T[K]) => void
}

export const notifier = <T extends Object>(data: T, listeners: Map<keyof T, Set<OnValueUpdated<any>>>): Notifier<T> => ({
    $data: new Map(),
    $listeners: listeners,
    $notify: function (key, oldValue) {
        this.$listeners.get(key)?.forEach(callback => callback(this.$data.get(key), oldValue))
    }
})