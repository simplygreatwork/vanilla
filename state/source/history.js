
export default function install(store) {
	
	Object.assign(store, {
		
		mark(name) {
			this.changes[this.changes.length - 1].name = name
		},
		
		undo(name) {
			name ? this.undo_many(name) : this.undo_one()
		},
		
		undo_one() {
			
			let change = this.changes[this.index]
			if (change.value_old === undefined) {
				this.delete_(change.path)
			} else {
				this.set(change.path, change.value_old, true)
			}
			this.bus.emit('did-undo-one', { change })
			this.index--
		},
		
		undo_many(name) {
			
			let changes = []
			while (this.index > -1) {
				if (this.changes[this.index].name == name) break 
				changes.push(this.undo_one())
			}
			this.bus.emit('did-undo-many', { changes })
		},
		
		redo(name) {
			name ? this.redo_many(name) : this.redo_one()
		},
		
		redo_one() {
			
			this.index++
			let change = this.changes[this.index]
			if (change.value === undefined) {
				this.delete_(change.path)
			} else {
				this.set(change.path, change.value, true)
			}
			this.bus.emit('did-redo-one', { change })
		},
		
		redo_many(name) {
			
			let changes = []
			while (this.index < this.changes.length) {
				if (this.changes[this.index].name == name) break 
				changes.push(this.redo_one())
			}
			this.bus.emit('did-redo-many', { changes })
		}
	})
}
