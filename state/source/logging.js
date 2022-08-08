
export default function(store) {
	
	console.log = function(message) {
		let element = document.createElement('div')
		element.innerText = message
		document.querySelector('body').appendChild(element)
	}
}
