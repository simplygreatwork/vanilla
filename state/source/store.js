
import { Bus, install as install_bus } from '../../bus/source/bus.js'
import { clone } from './utility.js'

export class Store {
	
	constructor() {
		
		this.bus = new Bus()
		this.root_ = {}
		this.changes = []
		this.index = -1
		this.use(install_bus)
		this.listen()
	}
	
	use(fn) {
		
		if (fn) fn(this)
		return this
	}
	
	listen() {
		
		this.bus.on('did-set-value', function({ path }) {
			this.bus.emit('change', ...arguments)
			this.bus.emit(`change:${path.join('.')}`, ...arguments)
		}.bind(this))
	}
	
	get(path) {
		
		path = this.translate(path)
		if (path.length === 0) return this.root_
		return this.find(path, function({ item, key }) {
			return item[key]
		})
	}
	
	set(path, value, silent) {
		
		path = this.translate(path)
		silent = silent === undefined ? false : true
		let value_old = this.get([...path])
		value = clone(value)
		value_old = (value_old === undefined || value_old === null) ? value_old : clone(value_old)
		path = clone(path)
		this.find(path, function({ item, key }) {
			item[key] = value
		})
		this.bus.emit('did-set-value', { path, value, value_old })
		if (! silent) {
			this.changes.push({ path, value_old, value })
			this.index++
		}
	}
	
	patch(path, values) {
		
		path = this.translate(path)
		Object.keys(values).forEach(function(key) {
			this.set(path.concat([key]), values[key])
		}.bind(this))
		this.bus.emit('did-patch-values', { path, values })
	}
	
	update(path, fn) {
		
		path = this.translate(path)
		let value = this.get(path)
		value = fn(value)
		this.set(path, value)
	}
	
	delete_(path, value) {
		
		path = this.translate(path)
		this.find(path, function({ item, key }) {
			delete item[key]
		})
	}
	
	find(path, fn) {
		
		path = this.translate(path)
		let item = this.root_
		let key = path.pop()
		path.forEach(function(each) {
			item = item[each]
		})
		path.push(key)
		return fn({ item, key })
	}
	
	select(path_) {
		
		path_ = this.translate(path_)
		let bus = this.bus
		
		return {
			type: 'substore',
			get: (path__) => this.get(path_.concat(this.translate(path__) || [])),
			set: (path__, value, silent) => this.set(path_.concat(this.translate(path__) || []), value, silent),
			patch: (path__, values, silent) => this.patch(path_.concat(this.translate(path__) || []), values, silent),
			update: (path__, fn) => this.update(path_.concat(this.translate(path__) || []), fn),
			delete_: (path__) => this.delete_(path_.concat(this.translate(path__) || [])),
			on(key, fn_) {
				if (key != 'change') return
				return bus.on(key, function({ path, value, old }) {
					if (path_.join('.') == path.join('.')) {
						fn_({ path, value })
					}
				})
			},
			select: (path__) => this.select(path_.concat(this.translate(path__) || [])),
			path: () => path_
		}
	}
	
	derive(path_, fn) {
		
		let store = this.select(path_)
		let bus = this.bus
		return {
			get(path__) {
				return fn(store.get())
			},
			on(key, fn_) {
				if (key != 'change') return
				return bus.on(key, function({ path, value, old }) {
					if (path_.join('.') == path.join('.')) {
						fn_({ path, value: fn(value) })
					}
				})
			}
		}
	}
	
	translate(path) {
		
		if (path === null || path == undefined) {
			return []
		} else if (typeof path == 'string') {
			return path.split('.')
		} else {
			return path
		}
	}
	
	path() {
		return []
	}
}
