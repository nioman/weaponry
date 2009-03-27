/**
 * WORKSPACE WIZARD GET WORKSPACE RAW NAME
 **/
function workspace_wizard_get_workspace_raw_name() {
	return document.getElementById('workspace-wizard-workspace-name').value.replace(/^\s*|\s*$/g, '');
}

/**
 * WORKSPACE WIZARD GET WORKSPACE RAW TYPE
 **/
function workspace_wizard_get_workspace_raw_type() {
	return document.getElementById('workspace-wizard-workspace-type').value.replace(/^\s*|\s*$/g, '');
}

/**
 * WORKSPACE WIZARD GET WORKSPACE NICE NAME
 **/
function workspace_wizard_get_workspace_nice_name() {
	return workspace_wizard_get_workspace_raw_name();
}

/**
 * WORKSPACE WIZARD GET WORKSPACE PATH NAME
 **/
function workspace_wizard_get_workspace_path_name() {
	return workspace_wizard_get_workspace_nice_name() + '.workspace.sqlite';
}

/**
 * WORKSPACE WIZARD WORKSPACE EXISTS
 **/
function workspace_wizard_workspace_exists() {
	var file = Components.classes['@mozilla.org/file/directory_service;1']
			     .getService(Components.interfaces.nsIProperties)
			     .get('ProfD', Components.interfaces.nsIFile);

	file.append(workspace_wizard_get_workspace_path_name());

	return file.exists();
}

/**
 * WORKSPACE WIZARD FINISH
 **/
function workspace_wizard_finish() {
	var wm = Components.classes['@mozilla.org/appshell/window-mediator;1']
	                   .getService(Components.interfaces.nsIWindowMediator);

	var main_window = wm.getMostRecentWindow('bono:main');

	main_window.document.getElementById('main-browser').openTab('chrome://weaponry/content/workspace.xul?workspacedb=' + escape(workspace_wizard_get_workspace_path_name()), '', true);
}

/**
 * WORKSPACE WIZARD WORKSPACE SETUP ADVANCED
 **/
function workspace_wizard_workspace_setup_advanced() {
	var notificationbox = document.getElementById('workspace-wizard-workspace-setup-notificationbox');

	if (!workspace_wizard_get_workspace_nice_name()) {
		var message = document.getElementById('workspace-wizard-properties').getString('workspace-wizard-workspace-name-not-specified');
		notificationbox.appendNotification(message, 'workspace-name-not-specified');

		return false;
	} else if (workspace_wizard_workspace_exists()) {
		var message = document.getElementById('workspace-wizard-properties').getString('workspace-wizard-workspace-already-exists');
		notificationbox.appendNotification(message, 'workspace-already-exists');

		return false;
	} else {
		var notification_to_remove01 = notificationbox.getNotificationWithValue('workspace-already-exists');
		var notification_to_remove02 = notificationbox.getNotificationWithValue('workspace-name-not-specified');

		if (notification_to_remove01) {
			notificationbox.removeNotification(notification_to_remove01);
		}
		if (notification_to_remove02) {
			notificationbox.removeNotification(notification_to_remove02);
		}

		return true;
	}
}

/**
 * WORKSPACE WIZARD WORKSPACE NAME CHANGE
 **/
function workspace_wizard_workspace_name_change() {
	var notificationbox = document.getElementById('workspace-wizard-workspace-setup-notificationbox');

	if (workspace_wizard_workspace_exists()) {
		var message = document.getElementById('workspace-wizard-properties').getString('workspace-wizard-workspace-already-exists');
		notificationbox.appendNotification(message, 'workspace-already-exists');
	} else {
		var notification_to_remove01 = notificationbox.getNotificationWithValue('workspace-already-exists');
		var notification_to_remove02 = notificationbox.getNotificationWithValue('workspace-name-not-specified');

		if (notification_to_remove01) {
			notificationbox.removeNotification(notification_to_remove01);
		}
		if (notification_to_remove02) {
			notificationbox.removeNotification(notification_to_remove02);
		}
	}
}

/**
 * WORKSPACE WIZARD WORKSPACE FINISH ADVANCED
 **/
function workspace_wizard_workspace_finish_advanced() {
	var file = Components.classes['@mozilla.org/file/directory_service;1']
			     .getService(Components.interfaces.nsIProperties)
			     .get('ProfD', Components.interfaces.nsIFile);

	file.append(workspace_wizard_get_workspace_path_name());

	var storageService = Components.classes['@mozilla.org/storage/service;1']
				       .getService(Components.interfaces.mozIStorageService);

	window.workspacedb = storageService.openDatabase(file);
	window.workspacedb.executeSimpleSQL("CREATE TABLE workspace_options (id INTEGER PRIMARY KEY, key TEXT, value TEXT)");

	var statement = window.workspacedb.createStatement("INSERT INTO workspace_options (key, value) VALUES ('workspace.name', ?1)");
	statement.bindStringParameter(0, workspace_wizard_get_workspace_raw_name());
	statement.execute();

	var statement = window.workspacedb.createStatement("INSERT INTO workspace_options (key, value) VALUES ('workspace.type', ?1)");
	statement.bindStringParameter(0, workspace_wizard_get_workspace_raw_type());
	statement.execute();
}
