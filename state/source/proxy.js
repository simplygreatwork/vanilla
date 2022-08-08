
export default function(store) {
	store.root = create_proxy(store.select([]))
}

function create_proxy(store) {
	
	return new Proxy({}, {
		
		get: function(target, key) {
			
			if (key == 'on' && ! store.get(['on'])) return store.on 
			if (key == 'toJSON') return function() {
				return store.get([])
			}
			let substore = store.select([key])
			let value = substore.get([])
			if (typeof value === 'object') {
				return create_proxy(substore)
			} else {
				let wrapper = get_primitive_wrapper(value)
				if (wrapper) {
					wrapper.on = function(key, fn) {
						substore.on('change', function({ path, value, old }) {
							fn({ path, value, old })
						})
					}
					return wrapper
				} else {
					return value
				}
			}
		},
		
		set: function(target, key, value) {
			
			let substore = store.select([key])
			substore.set([], value)
			return true
		}
	})
}

function get_primitive_wrapper(value) {
	
	if (typeof value === 'number') {
		return new Number(value)
	} else if (typeof value === 'string') {
		return new String(value)
	} else if (typeof value === 'boolean') {
		return new Boolean(value)
	}
}
