
import { Component } from '../../component/source/component.js'

export function _() {
	
	Component.ready(function(component) {
		
		console.log('list-item.html ready')
		let bus = component.data.bus
		this.element.querySelector('a.item').href = `#/list/${this.data.key}`
		this.element.querySelector('a.item').innerText = this.data.label
		this.element.querySelector('div.item').onmousedown = function() {
			this.element.querySelector('div.item').classList.toggle('selected')
			bus.emit('selected', component)
		}.bind(this)
	})
}
