
import { Bus } from '../../bus/source/bus.js'

export function install_selection(component, bus) {
	
	let state = { selections: [] }
	bus.on('row-will-select', function(child) {
		deselect_rows(component, state)
		state.selections = [child]
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

export function select_row(child, bus) {
	
	bus.emit('row-will-select', child)
	child.element.querySelector('div.item').classList.add('selected')
	return true
}

function deselect_rows(component, state) {
	
	state.selections.forEach(function(each) {
		each.element.querySelector('div.item').classList.remove('selected')
	})
}

function select_adjacent_row(component, state, direction, bus) {
	
	let child = find_adjacent_row(component, state.selections[0], direction)
	if (! child) return
	window.location.hash = child.data.link
	return true
}

function find_adjacent_row(component, child, direction) {
	
	for (let i = 0; i < component.children.length; i++) {
		if (component.children[i] == child) return component.child(i + direction)
	}
}
