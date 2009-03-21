/**
 * WEAPONRY TOOLKIT FILTER TEXTBOX CHANGE
 **/
function weaponry_toolkit_filter_textbox_change() {
	var filter = document.getElementById('weaponry-toolkit-filter-textbox').value.replace('\\', '\\\\').replace("'", "\\'");
	document.getElementById('weaponry-toolkit-richlistbox-query').setAttribute('expr', "module[contains(@description, '" + filter + "')]");
	document.getElementById('weaponry-toolkit-richlistbox').builder.rebuild();
}

/**
 * WEAPONRY TOOLKIT RICHLISTITEM DBLCLICK
 **/
function weaponry_toolkit_richlistitem_dblclick(who) {
	var wm = Components.classes['@mozilla.org/appshell/window-mediator;1']
	                   .getService(Components.interfaces.nsIWindowMediator);

	var main_window = wm.getMostRecentWindow('bono:main');

	main_window.document.getElementById('main-browser').openTab(who.getAttribute('moduleuri'), '', true);
}
