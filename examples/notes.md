
tasks:
always use named children
	where the name comes from the element

use child(name) instead of child(index)
perhaps use .component(name) instead of .child(name)
start(then) - use fn and apply like Component.ready
fix Component constructor params
router.register - pass through pass into enter exit fns
demonstrate how to register child routes in child views
	how am I going to manage off()s?

idea: allow MutationObserver only on each single data-component element

idea, when the path is registered, then send message
issue: clearTimeout in router.js might clear other attempts
so needs to have a timeout per path

IMPORTANT: if no handlers for bus pattern, remove the pattern
	else check length of handlers
	actually, this might be the issue because I am looping through channels
	so, in bus.off, remove the key if no handlers
	or handle in router instead
	
the current issue has to do with timing with exits
	so consider using a next() implementation
	also consider continuing only if the previous exit handler has been removed
	overall, allow both techniques
	
component.child('void').load('./columns/feature.html', { part }, then)
component.child('void').load('./empty.html', {}, then)

enter : function({ path, part, index, then }) {
	console.log(`enter ${path}`)
	component.child('void').load('./columns/feature.html', { part }, then)
}.bind(this)

exit : function({ path, part, index, then }) {
	console.log(`exit ${path}`)
	component.child('void').load('./empty.html', {}, then)
}.bind(this)

going to need a way to append new components dynamically - e.g. list items

if router then is never called with "then", warn

test using references modules, also test embedded in data url