/*

NB: gdoc published format does not use hierarchical lists, each list is at the same level

- load a gdoc
- iterate through all the li's
	- look at indentation level
	- if deeper than previous li, add to list as child
	- if same as or shallower than previous li, add as sibling of ancestor with same indentation level

desired output:

list = array of tasks
task = object, properties: name (string), [children (list)]

var list = [
	{
		name: 'task1',
		children: [
			{
				name: 'blah'
			},
			{
				name: 'blah'
			}
		]
	},
	{
		name: 'task2'
	},
	{
		name: 'task3',
		children: [
			{
				name: 'blah2'
			},
			{
				name: 'parent',
				children: [ ... ]
			}
		]
	}
];

functions needed:

getIndentationLevel
addAsChild
addAsSiblingOfAncestor

*/
var list = {
		level: 0
	},
	currentItem = list,
	$ = jQuery;

function getIndentationLevel(elem) {
	return parseInt($(elem).css('marginLeft'),10);
}

function formItem(elem, level) {
	return {
		text: $(elem).text(),
		level: level
	}
}

function addAsChild(elem, level) {
	var item = formItem(elem, level);
	if(!currentItem.children) {
		currentItem.children = [];
	}
	currentItem.children.push(item);
	item.parentItem = currentItem;
	currentItem = item;
}

function addAsSiblingOfAncestor(elem, level) {
	var item = formItem(elem, level),
		parentItem = currentItem.parentItem;
	while(level<=parentItem.level) {
		parentItem = parentItem.parentItem;
	}
	parentItem.children.push(item);
	item.parentItem = parentItem;
	currentItem = item;
}

$(function() {
	var previousLevel = 0;
	$('li').each(function() {
		var level = getIndentationLevel(this);
		level > previousLevel ? addAsChild(this, level) : addAsSiblingOfAncestor(this, level);
		previousLevel = level;
	});
	console.log(list);
});