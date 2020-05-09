import {OnValueUpdated} from "./callback";

export type Observable<T> = {
    $observe: <K extends keyof T>(key: K, callback: OnValueUpdated<T[K]>) => void,
    $stop: <K extends keyof T>(key: K, callback: OnValueUpdated<T[K]>) => void,
}

export const observable = <T extends Object>(data: T, listeners: Map<keyof T, Set<OnValueUpdated<any>>>): Observable<T> => ({
    $observe: function (key, onChange) {
        listeners.set(key, (listeners.get(key) || new Set()).add(onChange))
    },
    $stop: function (key, onChange) {
        listeners.get(key)?.delete(onChange)
    }
})