
import { Router } from './router.js'
import { Bus } from '../../../../bus/source/bus.js'

export class System {
	
	constructor() {
		
		let bus = this.bus = new Bus()
		let router = this.router = new Router(bus)
	}
}
