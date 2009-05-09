function explorer_filter_textbox_change() {
	var filter = document.getElementById('explorer-filter-textbox').value.replace('\\', '\\\\').replace("'", "\\'");
	document.getElementById('explorer-query').setAttribute('expr', "entry[contains(@vendor, '" + filter + "')]");
	document.getElementById('explorer-tree').builder.rebuild();
}
