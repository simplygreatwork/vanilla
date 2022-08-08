
import { Bus, install as install_bus } from '../../bus/source/bus.js'

export class Router {
	
	constructor(bus) {
		
		window.addEventListener('hashchange', function() {
			this.go(window.location.hash)
		}.bind(this), false)
		this.then = this.now = []
		this.routes = { enter: new Bus(), exit: new Bus()}
		this.offs = []
		this.changing = false			// need a queue
	}
	
	go(path) {
		
		if (this.changing === true) return 
		let then = this.then = this.now
		let now = this.now = path.split('/').slice(1)
		let marker = -1
		then.forEach(function(item, index) {
			if (! this['same?'](then, now, index)) {
				if (marker === -1) marker = index
			}
		}.bind(this))
		if (marker === -1) marker = then.length
		if (false) console.log(`At index ${marker} exited "${this.then.slice(marker)}" and entered "${this.now.slice(marker)}"`)
		if (false) console.log(`------`)
		this.changing = true
		this.fire_exits(this.then.length - 1, marker, function() {
			this.fire_enters(marker, marker, function() {
				this.changing = false
			}.bind(this))
		}.bind(this))
	}
	
	'same?'(a, b, index) {
		
		if (a == null) return false
		if (b == null) return false
		if (index >= a.length) return false
		if (index >= b.length) return false
		if (a[index] != b[index]) return false
		return true
	}
	
	fire_enters(index, marker, then) {
		
		if (index === this.now.length) return then()
		let path = this.now.join('/').split('/').slice(0, index + 1)
		let subject = path.join('/')
		let found = false
		Object.keys(this.routes.enter.channels).forEach(function(pattern) {
			if (this.routes.enter.channels[pattern].length === 0) return
			let result = this.match(subject, pattern)
			if (result.matches) {
				found = true
				let parts = subject.split('/')
				this.routes.enter.emit(`${pattern}`, {
					path: subject,
					index: parts.length - 1,
					part: parts[parts.length - 1],
					values: result.values,
					then: function() {
						window.setTimeout(function() {				// fix me, omit timeout
							this.fire_enters(++index, marker, then)
						}.bind(this), 50)
					}.bind(this)
				})
			}
		}.bind(this))
		if (found === false) then()
	}
	
	fire_exits(index, marker, then) {
		
		if (index < marker) return then()
		let path = this.then.join('/').split('/').slice(0, index + 1)
		let subject = path.join('/')
		let found = false
		Object.keys(this.routes.exit.channels).forEach(function(pattern) {
			let result = this.match(subject, pattern)
			if (result.matches) {
				let parts = subject.split('/')
				let index = parts.length - 1
				found = true
				this.routes.exit.emit(`${pattern}`, {
					path: subject,
					index: index,
					part: parts[parts.length - 1],
					values: result.values,
					then: function() {
						this.fire_exits(--index, marker, then)
					}.bind(this)
				})
			}
		}.bind(this))
		if (found === false) then()
	}
	
	enter(path, fn) {
		return this.routes.enter.on(path, fn)
	}
	
	exit(path, fn) {
		return this.routes.exit.on(path, fn)
	}
	
	match(subject, pattern) {
		
		let result = { matches: false }
		let names = {}
		pattern = pattern.split('/').map(function(each) {
			if (each.startsWith(':')) {
				let id = each.substring(1)
				names[id] = Object.keys(names).length
				return `([^/]+)`
			} else {
				return each
			}
		}).join('\\\/')
		pattern = `^${pattern}$`
		let regex = new RegExp(pattern, 'g')
		let result_ = regex.exec(subject)
		if (result_) {
			result = { matches: true, values: names }
			Object.keys(names).forEach(function(name) {
				let index = names[name]
				names[name] = result_[index + 1]
			})
		}
		return result
	}
	
	register(path, options) {
		
		let length = path.split('/').length
		let offs = []
		offs[0] = this.enter(path, function(data) {
			options.enter(data)
		}.bind(this))
		offs[1] = this.exit(path, function(data) {
			let offs_ = this.offs[length]
			if (offs_ && offs_[0]) offs_[0]()
			if (offs_ && offs_[1]) offs_[1]()
			options.exit(data)
		}.bind(this))
		this.offs[length - 1] = offs
	}
}
