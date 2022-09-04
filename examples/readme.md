
- most of the other packages in this repository have their own examples
- this directory is to attempt to showcase them all together in a compound manner
- 
- when append new components to the body first
- because their parent might not yet be ready
- do not allow new router transaction if already changing/busy
- to avoid flickering, add element initially to a hidden region
- dim the empty text in the empty page
- approach component.js differently
	- load the page, then extract the javascript to be primary
	- 
	
- get rid  of Example class and use functional instead
- need better selectors for scoping
- 
- get all of the examples to run independently - but also in the main suite
- simply default router registration exit view
- 
- if you clone a component - does it also clone it's children?
- get Component.invoke to work with Component.start
- simplify Example's to not use class
- 

strategy for rebasing
everything will work locally
but need to rebase inside index.html to include in the main view
component.child('void').rebase('../list').redirect('./list.html', { path }, then)

first column in main should be a list