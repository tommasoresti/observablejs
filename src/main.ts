type OnValueUpdated<T> = (newValue: T, oldValue?: T) => void

type Observable<T> = {
	$data: any,
	$listeners: Map<keyof T, Set<OnValueUpdated<any>>>,
	$listen: <K extends keyof T>(key: K, callback: OnValueUpdated<T[K]>) => void,
	$stop: <K extends keyof T>(key: K, callback: OnValueUpdated<T[K]>) => void,
	$notify: <K extends keyof T>(key: K, oldValue: T[K]) => void
}

const observe = <T>(data: T): Observable<T> & T => {
	const proxy: Observable<T> & T = {
		...data,
		$data: {},
		$listeners: new Map(),
		$listen: function(key, onChange) {
			this.$listeners.set(key, (this.$listeners.get(key) || new Set()).add(onChange))
		},
		$stop: function(key, onChange) {
			this.$listeners.get(key)?.delete(onChange)
		},
		$notify: function(key, oldValue) {
			this.$listeners.get(key)?.forEach(callback => callback(this.$data[key], oldValue))
		}
	}

	for(let key in data) {
		proxy.$data[key] = data[key]
		delete proxy[key]
		Object.defineProperty(proxy, key, {
		    get: function() { return proxy.$data[key]; },
		    set: function(value) {
		        if (proxy.$data[key] !== value) {
					const oldValue = proxy.$data[key]
		            proxy.$data[key] = value;
		            proxy.$notify(key, oldValue)
		        }
		    },
		})
	}

	return proxy;
}
