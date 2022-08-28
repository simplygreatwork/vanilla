
import { Bus } from '../../bus/source/bus.js'

export function manage_single_selection(component, bus) {
	
	document.onkeydown = function(event) {
		if (event.key == 'ArrowDown') bus.emit('keydown:arrow-down')
		if (event.key == 'ArrowUp') bus.emit('keydown:arrow-up')
	}
	let state = { selections: [] }
	bus.on('selected', function(component) {
		single_select(component, state)
	})
	bus.on('keydown:arrow-down', function() {
		return select_adjacent(find_next(component, state.selections[0]), bus)
	})
	bus.on('keydown:arrow-up', function() {
		return select_adjacent(find_previous(component, state.selections[0]), bus)
	})
}

function select_adjacent(child, bus) {
	
	child.element.querySelector('div.item').classList.toggle('selected')
	window.location.hash = child.data.link
	bus.emit('selected', child)
	return true
}

function single_select(component, state) {
	
	state.selections.forEach(function(each) {
		each.element.querySelector('div.item').classList.remove('selected')
	})
	state.selections  = []
	state.selections.push(component)
}

function find_next(component, child) {
	
	let result = null
	component.children.forEach(function(each, index) {
		if (each == child) {
			result = component.child(index + 1)
		}
	})
	return result
}

function find_previous(component, child) {
	
	let result = null
	component.children.forEach(function(each, index) {
		if (each == child) {
			result = component.child(index - 1)
		}
	})
	return result
}
