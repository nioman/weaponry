/**
 * WORKSPACES CREATE WORKSPACE
 **/
function workspaces_create_workspace() {
	window.openDialog('chrome://workspaces/content/wizard.xul', '', 'chrome,center,modal');
}

/**
 * WORKSPACES OPEN WORKSPACE
 **/
function workspaces_open_workspace() {
	var dir = Components.classes['@mozilla.org/file/directory_service;1']
	                    .getService(Components.interfaces.nsIProperties)
                            .get('ProfD', Components.interfaces.nsIFile);

	var fp = Components.classes['@mozilla.org/filepicker;1']
	                   .createInstance(Components.interfaces.nsIFilePicker);

	var sb = document.getElementById('workspaces-main-overlay-properties');

	fp.init(window, sb.getString('workspaces-open-workspace-dialog-title'), Components.interfaces.nsIFilePicker.modeOpen);

	fp.displayDirectory = dir; 

	fp.appendFilter(sb.getString('workspaces-open-workspace-dialog-workspace-files'), '*.workspace.sqlite');
	fp.appendFilter(sb.getString('workspaces-open-workspace-dialog-sqlite-files'), '*.sqlite;*.db;*.sdb');
	fp.appendFilter(sb.getString('workspaces-open-workspace-dialog-all-files'), '*');

	var ret = fp.show();

	if (ret == Components.interfaces.nsIFilePicker.returnOK || ret == Components.interfaces.nsIFilePicker.returnReplace) {
		var path = fp.file.path;

		var wm = Components.classes['@mozilla.org/appshell/window-mediator;1']
	                   .getService(Components.interfaces.nsIWindowMediator);

		var main_window = wm.getMostRecentWindow('weaponry:main');

		//main_window.open_content('chrome://workspaces/content/workspace.xul', null, {workspacedb:path});
		main_window.open_content('chrome://workspaces/content/workspace.xul?workspacedb=' + escape(path));
	}
}
