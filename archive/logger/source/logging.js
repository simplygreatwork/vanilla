
export function install(selector) {
	
	let parent = document.querySelector(selector || 'body')
	console.log = function(message) {
		let element = document.createElement('div')
		element.innerText = message
		parent.appendChild(element)
	}
}
