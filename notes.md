
For Component.ready(function
pass { component, $ = component.element.querySelector }
but beware that the element chould change after redirect
the workaround is to not pass element.querySelector - but pass a function