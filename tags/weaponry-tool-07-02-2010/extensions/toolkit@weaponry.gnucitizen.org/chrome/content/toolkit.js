/**
 * TOOLKIT FILTER TEXTBOX CHANGE
 **/
function toolkit_filter_textbox_change() {
	var filter = document.getElementById('toolkit-filter-textbox').value.replace('\\', '\\\\').replace("'", "\\'");
	document.getElementById('toolkit-richlistbox-query').setAttribute('expr', "module[contains(@description, '" + filter + "')]");
	document.getElementById('toolkit-richlistbox').builder.rebuild();
}

/**
 * TOOLKIT RICHLISTITEM DBLCLICK
 **/
function toolkit_richlistitem_dblclick(who) {
	var wm = Components.classes['@mozilla.org/appshell/window-mediator;1']
	                   .getService(Components.interfaces.nsIWindowMediator);

	var main_window = wm.getMostRecentWindow('weaponry:main');

	main_window.open_content(who.getAttribute('moduleuri'));
}
