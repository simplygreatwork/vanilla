
- instead of animating the inputs
- present them in a single selection list
- and navigate using the arrow keys
- the other benefit is that the user can switch to any input
- another benefit is that the user can take their time to study the changes
- 

ideas:
walk each part of old parts in reverse order
if slot is the same, stop
if slot is different or , exit
might be nice to have a path object to be able to avoid index out of bounds

maybe perform this in a recursive manner,
	so I can iterate downward 4,3,2, and then upward 3,4,5
	instead of two separate loops
	
create a function for get_path_value


walk full extent of then
	when no match mark exit point
	advance to end of then items
	exit 'then' items from end of then items to marker
	enter 'now' items from marker to end of now items 