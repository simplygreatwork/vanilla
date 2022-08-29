
import { Bus } from '../../bus/source/bus.js'

export function manage_single_selection(component, bus) {
	
	let state = {}
	state.selections = []
	bus.on('selected', function(component) {
		single_select(component, state)
	})
	document.onkeydown = function(event) {
		if (event.key == 'ArrowDown') bus.emit('keydown:arrow-down')
		if (event.key == 'ArrowUp') bus.emit('keydown:arrow-up')
	}
	bus.on('keydown:arrow-down', function() {
		return select_adjacent_row(component, state, 1, bus)
	})
	bus.on('keydown:arrow-up', function() {
		return select_adjacent_row(component, state, -1, bus)
	})
}

function select_adjacent_row(component, state, direction, bus) {
	
	let child = find_adjacent_row(component, state.selections[0], direction)
	if (! child) return
	child.element.querySelector('div.item').classList.toggle('selected')
	window.location.hash = child.data.link
	bus.emit('selected', child)
	return true
}

function find_adjacent_row(component, child, direction) {
	
	for (let i = 0; i < component.children.length; i++) {
		if (component.children[i] == child) return component.child(i + direction)
	}
}

function select_row(child, bus) {
	
	child.element.querySelector('div.item').classList.add('selected')
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
