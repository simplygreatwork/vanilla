
export class Store {
	
	constructor({ bus, store }) {
		
		this.bus = bus
		this.store = store
		
		bus.on('get-value', function(key, result) {
			key = key.split('/').join('.')
			result.value = this.store.get(key)
		}.bind(this))
		
		bus.on('set-value', function(key, value, source) {
			console.log(`${key} = ${value}`)
			key = key.split('/').join('.')
			this.store.set(key, value)
		}.bind(this))
	}
}
