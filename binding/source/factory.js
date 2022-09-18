
import { Store } from './store.js'
import { Element } from './element.js'
import { Value } from './value.js'

export class Factory {
	
	constructor(options) {
		
		this.options = options
		this.children = []
	}
	
	storage() {
		return new Storage({ bus: this.options.bus })
	}
	
	store(options) {
		return new Store(Object.assign(options || {}, this.options))
	}
	
	value(options) {
		
		let result = new Value(Object.assign(options || {}, this.options))
		this.children.push(result)
		return result.fn()
	}
	
	element(options) {
		
		let result = new Element(Object.assign(options || {}, this.options))
		this.children.push(result)
		return result 
	}
	
	multi(options, fn) {
		return
	}
	
	release(options) {
		
		options = options || {}
		let key = options.key
		this.children.forEach(function(child) {
			let release = true
			if (key && key != child.key) release = false
			if (release) {
				child.release()
				this.children = this.children.filter(value => value !== child)
			} 
		}.bind(this))
	}
}
