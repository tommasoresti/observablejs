const dataProvider = () => ({
	foo: "bar",
	n: 0
});

const proxify = (dataProvider) => {
	if(typeof dataProvider !== 'function') {
		throw new Error("Not a function");
	}

	const proxy = {
		$data: {},
		$listeners: {},
		$listen: function(key, onChange) {
			this.$listeners[key] = (this.$listeners[key] || new Set()).add(onChange)
		},
		$stop: function(key, onChange) {
			if(this.$listeners[key]) this.$listeners[key].delete(onChange)
		},
		$notify: function(key) {
			if(this.$listeners[key]) {
				const value = 
				this.$listeners[key].forEach(callback => callback(this.$data[key]))
			}
		}
	}

	const data = dataProvider()
	for(let key in data) {
		proxy.$data[key] = data[key]
		Object.defineProperty(proxy, key, {
		    get: function(value) { return proxy.$data[key]; },
		    set: function(value) {
		        if (proxy.$data[key] !== value) {
		            proxy.$data[key] = value;
		            proxy.$notify(key)
		        }
		    },
		})
	}

	return proxy;
}

const proxy = proxify(dataProvider);

const fooListener = (value) => console.log("Foo changed to " + value)
const nListener = (value) => console.log("N changed to " + value)

proxy.$listen('foo', fooListener)
proxy.$listen('n', nListener)

proxy.foo = "new value"
proxy.n++;

proxy.$stop('n', nListener)

proxy.n++;

console.log(proxy)
