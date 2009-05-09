function command_import_file() {
	var fp = Components.classes['@mozilla.org/filepicker;1']
	                   .createInstance(Components.interfaces.nsIFilePicker);

	fp.init(window, 'Import File', Components.interfaces.nsIFilePicker.modeOpen);

	fp.appendFilter('Nmap Files', '*.xml;*.nmap;*.gnmap');
	fp.appendFilter('Nessus Files', '*.nbe');
	fp.appendFilter('All Files', '*');

	var ret = fp.show();

	if (ret == Components.interfaces.nsIFilePicker.returnOK || ret == Components.interfaces.nsIFilePicker.returnReplace) {
		var path = fp.file.path;

		alert(path);
	}
}

function command_import_directory() {
	var fp = Components.classes['@mozilla.org/filepicker;1']
	                   .createInstance(Components.interfaces.nsIFilePicker);

	fp.init(window, 'Import Directory', Components.interfaces.nsIFilePicker.modeGetFolder);

	var ret = fp.show();

	if (ret == Components.interfaces.nsIFilePicker.returnOK || ret == Components.interfaces.nsIFilePicker.returnReplace) {
		var path = fp.file.path;

		alert(path);
	}
}
