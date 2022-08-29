
import { Component } from '../../component/source/component.js'

export function _() {
	
	Component.ready(function(component) {
		
		if (! component.data.item ) return
		let { item, link, bus } = this.data
		let element = this.element
		let a = element.querySelector('a.item')
		let div = element.querySelector('div.item')
		a.href = `#/tasks/${item.id}`
		a.innerText = item.title
		div.onmousedown = function() {
			window.location.hash = link
		}
		bus.on(`item-changed:${item.id}`, function({ item }) {
			a.innerText = item.title
		})
	})
}
