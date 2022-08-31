
import { Component } from '../../component/source/component.js'

export function _() {
	
	Component.ready(function(component) {
		
		if (! component.data.item ) return
		let { item, link, bus } = this.data
		let element = this.element
		let a = element.querySelector('a.row')
		let div = element.querySelector('div.row')
		a.href = link
		a.innerText = item.title
		div.onmousedown = function() {
			window.location.hash = link
		}
		bus.on(`item-changed:${item.id}`, function({ item }) {
			a.innerText = item.title
		})
	})
}
