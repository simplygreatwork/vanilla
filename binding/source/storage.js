
export class Storage {
	
	constructor({ bus }) {
		
		this.bus = bus
		this.data = {}
		
		bus.on('get-value', function(key, result) {
			result.value = key + '!'
			this.data[key] = result.value
		}.bind(this))
		
		bus.on('set-value', function(key, value, source) {
			this.data[key] = value
			console.log(`${key} = ${value}`)
		}.bind(this))
	}
}
