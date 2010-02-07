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
	if (who.hasAttribute('modulecommand')) {
		return eval(who.getAttribute('modulecommand').replace(/^\s*return\s*/, ''));
	} else if (who.hasAttribute('moduleuri')) {
		window.open(who.getAttribute('moduleuri'), '', 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,chrome');
	}
}
