
import { Bus } from '../../bus/source/bus.js'
import { install as install_bus } from '../../bus/source/bus.js'

export class Component {
	
	static counter = 0
	static recent = null
	
	static start(then) {
		
		let component = new Component()
		component.fragment = document.body
		let off = component.on('ready', function(component, path) {
			off()
			if (false) component.observe()
			then(component)
		})
		component.scan()
	}
	
	static ready(fn) {
		
		let component = Component.recent
		component.element.appendChild(component.content)
		let off = component.on('ready', function(component, path) {
			component.observe()
			window.setTimeout(function() {			// observe needs the timeout?
				fn.apply(component, [component])		// second param was window.system
				component.emit('initialized', component)
				off()
			}, 1)
		})
		component.scan()
	}
	
	constructor(path, options) {
		
		install_bus(this)
		this.id = Component.counter++
		this.path = path
		this.bus = new Bus()
		this.children = []
	}
	
	scan() {
		
		if (! this.fragment) return
		this.children = []
		let fragment = this.content || this.fragment
		this.process(Array.from(fragment.querySelectorAll(`[data-component]`)))
	}
	
	// I can kick off loading asynchrously
	// but fire ready synchronously for now
	
	process(array) {
		
		if (array.length === 0) return this.emit('ready', this, this.path)
		let each = array.pop()
		let path = each.dataset.component
		let component = new Component(path, {})
		component.name = each.getAttribute('name')
		this.children.push(component)
		component.element = each
		let off = component.on('ready', function(component_) {
			this.process(array)
			if (false) off()
		}.bind(this))
		component.populate()
	}
	
	populate() {
		
		let path = this.element.dataset.component
		fetch(`${path}?time=${new Date().getTime()}`)
		.then(function(response) {
			return response.text()
		}).then(function(html) {
			this.element.innerHTML = ''
			Component.recent = this
			this.fragment = document.createRange().createContextualFragment(html)
			this.emit('initialized')
			this.content = document.createElement('div')
			this.content.appendChild(this.fragment)
			this.content = this.content.children[0]
			document.body.appendChild(this.content)
			this.emit('attached')
		}.bind(this))
	}
	
	redirect(path, data, then) {
		
		if (then) {
			let off = this.on('initialized', function() {
				off()
				then()
			})
		}
		this.data = data
		this.element.setAttribute('data-component', path)
	}
	
	observe() {		// need to call scan again?
		
		let self = this
		if (this.observer) return
		this.observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.type == 'attributes') {
					if (mutation.attributeName == 'data-component') {
						let path = mutation.target.getAttribute('data-component')
						self.path = path
						self.populate()
					}
				}
			}.bind(this))
		}.bind(this))
		this.observer.observe(this.element, {
			attributes: true
		})
	}
	
	child(key) {
		
		if (typeof key === 'number') {
			return this.children[key]
		} else if (typeof key === 'string') {
			let result = null
			this.children.forEach(function(child) {
				if (child.name == key) {
					result = child
				}
			})
			return result
		}
	}
	
	clone() {
		
		let element = this.element.cloneNode()
		let component = new Component()
	}
}
