
function create_items() {
	
	return new Array(20).fill(0).map(function(each, index) {
		return index + 1
	})
}

function manage_single_selection(component) {
	
	let bus = new Bus()
	let state = {}
	state.selections = []
	bus.on('selected', function(component) {
		single_select(component, state)
	})
	document.onkeydown = function(event) {
		if (event.key == 'ArrowDown') {
			let child = find_next(component, state.selections[0])
			child.element.querySelector('div.item').classList.toggle('selected')
			window.location.hash = `#/list/${child.data.key}`
			bus.emit('selected', child)
			return true
		}
		if (event.key == 'ArrowUp') {
			let child = find_previous(component, state.selections[0])
			child.element.querySelector('div.item').classList.toggle('selected')
			window.location.hash = `#/list/${child.data.key}`
			bus.emit('selected', child)
			return true
		}
	}.bind(this)
	return { bus, state }
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
