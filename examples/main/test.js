
import { Component } from '../../component/source/component.js'

let counter = 0

export function _() {
	
	Component.ready(function({ component }) {
		counter++
		component.element.querySelector('.value').innerText = counter
		console.log(`counter: ${counter}`)
	}, { spread : true })
}
