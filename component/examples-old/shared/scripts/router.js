
export class Router {
	
	constructor(bus) {
		
		this.bus = bus
		window.addEventListener('hashchange', function() {
			this.fire()
		}.bind(this), false)
	}
	
	go(path) {
		
		console.log('Router.go: ' + path)
		this.parts = path.split('/')
		this.go_part(this.parts, -1)
	}
	
	go_part(parts, index) {
		
		index++
		let part = parts[index]
		let done = function() {
			if (index < parts.length) {
				this.go_part(parts, index)
			}
		}.bind(this)
		console.log(`emitting route:${index}`)
		this.bus.emit(`route:${index}`, part, done)
		this.bus.emit(`route:${index}:${part}`, done)
	}
	
	fire() {
		
		let path = window.location.hash
		let parts = path.split('/')
		parts.shift()
		path = parts.join('/')
		this.go(path)
	}
}
