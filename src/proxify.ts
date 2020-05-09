import {Notifier} from "./notifier";

const getter = <T>(proxy: Notifier<T>, key: keyof T) => ({
    get: function () {
        return proxy.$data.get(key);
    }
})

const setter = <T, K extends keyof T>(proxy: Notifier<T>, key: keyof T) => ({
    set: function (value: T[K]) {
        if (proxy.$data.get(key) !== value) {
            const oldValue = proxy.$data.get(key)
            proxy.$data.set(key, value)
            proxy.$notify(key, oldValue)
        }
    }
})

const setterAndGetter = <T>(proxy: Notifier<T>, key: keyof T) => {
    Object.defineProperty(proxy, key, {
        ...getter(proxy, key),
        ...setter(proxy, key),
    })
}

export const proxify = <T>(data: T, proxy: Notifier<T>) => {
    Object.getOwnPropertyNames(data).forEach((property: string) => {
        const key = property as keyof T
        proxy.$data.set(key, data[key])
        setterAndGetter(proxy, key);
    })
    return proxy as Notifier<T> & T
}
