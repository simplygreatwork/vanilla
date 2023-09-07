
export class Value {
	
	constructor({ bus, key }) {
		
		this.bus = bus
		this.key = key
		let result = {}
		bus.emit('get-value', key, result)
		bus.emit('get-value:${key}', result)
		this.value = result.value
		
		this.offs = []
		this.offs[0] = bus.on(`set-value:${key}`, function(value, source) {
			if (source == this) return
			element.value = format(value)
		}.bind(this))
	}
	
	set_(value) {
		
		let key = this.key
		let source = this
		this.bus.emit(`set-value`, key, value, source)
		this.bus.emit(`set-value:${key}`, value, source)
	}
	
	get_() {
		return this.value
	}
	
	fn() {
		
		let self = this
		return function(value) {
			if (value) {
				self.set_(value)
			} else {
				return self.get_()
			}
		}
	}
	
	release() {
		
		this.offs.forEach(function(off) {
			off()
		})
	}
}
