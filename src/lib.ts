type OnValueUpdated<T> = (newValue: T, oldValue?: T) => void

export type Observable<T> = {
    $observe: <K extends keyof T>(key: K, callback: OnValueUpdated<T[K]>) => void,
    $stop: <K extends keyof T>(key: K, callback: OnValueUpdated<T[K]>) => void,
}

const observable = <T extends Object>(data: T, listeners: Map<keyof T, Set<OnValueUpdated<any>>>): Observable<T> => ({
    $observe: function (key, onChange) {
        listeners.set(key, (listeners.get(key) || new Set()).add(onChange))
    },
    $stop: function (key, onChange) {
        listeners.get(key)?.delete(onChange)
    }
})

type Notifier<T> = {
    $data: Map<keyof T, any>,
    $listeners: Map<keyof T, Set<OnValueUpdated<any>>>,
    $notify: <K extends keyof T>(key: K, oldValue: T[K]) => void
}

const notifier = <T extends Object>(data: T, listeners: Map<keyof T, Set<OnValueUpdated<any>>>): Notifier<T> => ({
    $data: new Map(),
    $listeners: listeners,
    $notify: function (key, oldValue) {
        this.$listeners.get(key)?.forEach(callback => callback(this.$data.get(key), oldValue))
    }
})

function proxify<T>(data: T, proxy: Notifier<T>) {
    Object.getOwnPropertyNames(data).forEach((property: string) => {
        const key = property as keyof T
        proxy.$data.set(key, data[key])
        setterAndGetter(proxy, key);
    })
    return proxy as Notifier<T> & T
}

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

export default <T extends Object>(data: T): Observable<T> & T => {
    const listeners = new Map()
    return Object.assign(
        proxify(data, notifier(data, listeners)),
        observable(data, listeners)
    );
}


