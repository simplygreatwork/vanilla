
- a very simple harness for single file components using vanilla.js
- try to avoid using MutationObserver for redirect (go direct)
- 

for scanning
	I can kick off loading asynchrously
	but fire ready synchronously for now

Instead of Component.ready(fun)
Instead of Component.ready({
	init: function() {}
	render: function() {}
})
