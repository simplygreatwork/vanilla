
import { format_default } from '../source/format.js'
import { parse_default } from '../source/parse.js'

export class Element {
	
	constructor({ bus, key, scope, selector, format, parse }) {
		
		this.key = key
		format = format || format_default
		parse = parse || parse_default
		scope = scope || document.querySelector('body')
		let $ = scope.querySelector.bind(scope)
		selector = selector || `#${key.split('/').pop()}`
		let element = $(selector)
		let result = {}
		bus.emit(`get-value`, key, result)
		bus.emit(`get-value:${key}`, result)
		element.value = format(result.value)
		
		let fn
		element.addEventListener('input', fn = function(event) {
			let value = event.target.value
			let source = this
			bus.emit(`set-value`, key, value, source)
			bus.emit(`set-value:${key}`, value, source)
		}.bind(this))
		this.offs = []
		this.offs[0] = function() {
			element.removeEventListener('input', fn)
		}
		this.offs[1] = bus.on(`set-value:${key}`, function(value, source) {
			if (source == this) return
			element.value = format(value)
		}.bind(this))
	}
	
	release() {
		
		this.offs.forEach(function(off) {
			off()
		})
	}
}
