
import { Bus } from '../../bus/source/bus.js'
import { install as install_bus } from '../../bus/source/bus.js'

export class Component {
	
	static counter = 0
	static recent = null
	
	static start(fn) {
		
		let component = new Component()
		component.fragment = document.body
		let off = component.on('ready', function(component) {
			off()
			if (false) component.observe()
			fn(component)
		})
		component.scan()
	}
	
	static ready(fn, options) {
		
		let component = Component.recent
		component.fn = fn
		component.options = options
		component.element.appendChild(component.content)
		let off = component.on('ready', function(component) {
			component.observe()
			window.setTimeout(function() {						// observe needs the timeout?
				Component.invoke(component, fn, options)
				component.emit('initialized', component)
				off()
			}, 1)
		})
		component.scan()
	}
	
	static invoke(component, fn, options) {
		
		options = options || {}
		let $ = component.element.querySelector.bind(component.element)
		fn.apply(component, [{ component, $ }])
	}
	
	constructor(path) {
		
		this.id = Component.counter++
		this.path = path
		this.data = {}
		this.children = []
		this.bus = new Bus()
		install_bus(this)
	}
	
	scan() {
		
		if (! this.fragment) return
		this.children = []
		let fragment = this.content || this.fragment
		this.process(Array.from(fragment.querySelectorAll(`[data-component]`)))
	}
	
	process(array) {
		
		if (array.length === 0) return this.emit('ready', this, this.path)
		let each = array.pop()
		let path = each.dataset.component
		let component = new Component(path)
		component.name = each.getAttribute('name')
		component.element = each
		component.parent = this
		component.base = this.base
		this.children.push(component)
		let off = component.on('ready', function(component_) {
			this.process(array)
			if (false) off()
		}.bind(this))
		component.populate()
	}
	
	populate() {
		
		let path = this.resolve_path()
		fetch(`${path}?time=${new Date().getTime()}`)
		.then(function(response) {
			return response.text()
		}).then(function(html) {
			html = this.resolve_links(html)
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
	
	clone(data) {
		
		let deep = true
		let element = this.element.cloneNode(deep)
		let component = new Component()
		// use Object.assign
		component.element = element
		component.options = this.options
		component.path = this.path
		component.parent = this.parent
		component.fn = this.fn
		component.data = data
		this.parent.children.push(component)
		this.element.before(element)
		component.render()
		return component
	}
	
	render() {
		
		if (false) console.log(`render ${this.path} ${JSON.stringify(this.data)}`)
		Component.invoke(this, this.fn, this.options)
	}
	
	remove() {
		
		this.parent.children = this.parent.children.filter(value => value !== this)
		this.parent = null
		this.element.remove()
	}
	
	rebase(base) {
		
		this.base = base
		return this
	}
	
	resolve_path() {
		
		let path = this.element.dataset.component
		if (path.startsWith('./')) {
			if (this.base) path = this.base + path.slice(1)
		}
		return path
	}
	
	resolve_links(text) {
		
		if (this.base) text = text.replace(`from './`, `from '${this.base}/`)
		if (this.base) text = text.replace(`from "./`, `from "${this.base}/`)
		return text
	}
}
