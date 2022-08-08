
// adapted from https://github.com/AntonLapshin/proxy-observable

import { Bus } from '../../bus/source/bus.js'

export default function(target) {
	
	if (target.on && target.off) {
		return target
	}
	const bus = new Bus()
	const observable = new Proxy(target, {
		
		get: function(target, key) {
			if (key in target) {
				if (target.constructor === Array) {
					let value = observable
					if (key === 'pop') {
						value = target[target.length - 1]
					} else if (key === 'shift') {
						value = target[0]
					}
					if (key !== 'push' && key !== 'length') {
						bus.emit(key, value)
					}
				}
				return target[key]
			} else if (key === 'on') {
				return bus.on.bind(bus)
			} else if (key === 'unshift') {
				return bus.unshift.bind(bus)
			} else if (key === 'once') {
				return bus.once.bind(bus)    
			} else if (key === 'off') {
				return bus.off.bind(bus)
			}
			return undefined
		},
		
		set: function(target, key, value) {
			if (target.constructor === Array) {
				if (key !== 'length') {
					bus.emit('change', value)
				}
			} else {
				bus.emit('value', key, value, target[key])
				bus.emit(`value:${key}`, value, target[key])
			}
			target[key] = value
			return true
		}
	})
	
	return observable
}
