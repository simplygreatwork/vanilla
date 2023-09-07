
export function find_top_level_component(component) {
	
	while (component.parent) {
		component = component.parent
	}
	return component
}

export function walk_components(component, fn) {
	
	fn(component)
	component.children.forEach(function(child) {
		walk_components(child, fn)
	})
}
