/**
 * TOOLKIT FILTER TEXTBOX CHANGE
 **/
function toolkit_filter_textbox_change() {
	var filter = document.getElementById('toolkit-filter-textbox').value.replace('\\', '\\\\').replace("'", "\\'");
	document.getElementById('toolkit-toolkit-richlistbox-query').setAttribute('expr', "module[contains(@description, '" + filter + "')]");
	document.getElementById('toolkit-toolkit-richlistbox').builder.rebuild();
}

/**
 * TOOLKIT TOOLKIT RICHLISTITEM DBLCLICK
 **/
function toolkit_toolkit_richlistitem_dblclick(who) {
	var wm = Components.classes['@mozilla.org/appshell/window-mediator;1']
	                   .getService(Components.interfaces.nsIWindowMediator);

	var main_window = wm.getMostRecentWindow('app:main');

	main_window.document.getElementById('main-browser').openTab(who.getAttribute('moduleuri'), '', true);
}
