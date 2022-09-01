
import { Component } from '../../component/source/component.js'

export function _() {
	
	Component.ready(function({ component, $ }) {
		
		if (! this.data.item ) return
		let { item, link, bus } = this.data
		let a = $('a.row')
		let div = $('div.row')
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
