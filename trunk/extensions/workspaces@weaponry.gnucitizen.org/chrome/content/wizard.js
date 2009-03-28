/**
 * WIZARD GET WORKSPACE RAW NAME
 **/
function wizard_get_workspace_raw_name() {
	return document.getElementById('wizard-workspace-name').value.replace(/^\s*|\s*$/g, '');
}

/**
 * WIZARD GET WORKSPACE RAW TYPE
 **/
function wizard_get_workspace_raw_type() {
	return document.getElementById('wizard-workspace-type').value.replace(/^\s*|\s*$/g, '');
}

/**
 * WIZARD GET WORKSPACE NICE NAME
 **/
function wizard_get_workspace_nice_name() {
	return wizard_get_workspace_raw_name().replace(/\W/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/, '').toLowerCase();
}

/**
 * WIZARD GET WORKSPACE PATH NAME
 **/
function wizard_get_workspace_path_name() {
	return wizard_get_workspace_nice_name() + '.workspace.sqlite';
}

/**
 * WIZARD WORKSPACE EXISTS
 **/
function wizard_workspace_exists() {
	var file = Components.classes['@mozilla.org/file/directory_service;1']
	                     .getService(Components.interfaces.nsIProperties)
	                     .get('ProfD', Components.interfaces.nsIFile);

	file.append(wizard_get_workspace_path_name());

	return file.exists();
}

/**
 * WIZARD FINISH
 **/
function wizard_finish() {
	var wm = Components.classes['@mozilla.org/appshell/window-mediator;1']
	                   .getService(Components.interfaces.nsIWindowMediator);

	var main_window = wm.getMostRecentWindow('weaponry:main');

	main_window.open_content('chrome://workspaces/content/workspace.xul?workspacedb=' + escape(wizard_get_workspace_path_name()));
}

/**
 * WIZARD WORKSPACE SETUP ADVANCED
 **/
function wizard_workspace_setup_advanced() {
	var notificationbox = document.getElementById('wizard-workspace-setup-notificationbox');

	if (!wizard_get_workspace_nice_name()) {
		var message = document.getElementById('wizard-properties').getString('wizard-workspace-name-not-specified');
		notificationbox.appendNotification(message, 'name-not-specified');

		return false;
	} else if (wizard_workspace_exists()) {
		var message = document.getElementById('wizard-properties').getString('wizard-workspace-already-exists');
		notificationbox.appendNotification(message, 'already-exists');

		return false;
	} else {
		var notification_to_remove01 = notificationbox.getNotificationWithValue('already-exists');
		var notification_to_remove02 = notificationbox.getNotificationWithValue('name-not-specified');

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
 * WIZARD WORKSPACE NAME CHANGE
 **/
function wizard_workspace_name_change() {
	var notificationbox = document.getElementById('wizard-workspace-setup-notificationbox');

	if (wizard_workspace_exists()) {
		var message = document.getElementById('wizard-properties').getString('wizard-workspace-already-exists');
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
 * WIZARD WORKSPACE FINISH ADVANCED
 **/
function wizard_workspace_finish_advanced() {
	var file = Components.classes['@mozilla.org/file/directory_service;1']
	                     .getService(Components.interfaces.nsIProperties)
	                     .get('ProfD', Components.interfaces.nsIFile);

	file.append(wizard_get_workspace_path_name());

	var storageService = Components.classes['@mozilla.org/storage/service;1']
	                               .getService(Components.interfaces.mozIStorageService);

	window.workspacedb = storageService.openDatabase(file);
	window.workspacedb.executeSimpleSQL("CREATE TABLE workspace_options (id INTEGER PRIMARY KEY, key TEXT, value TEXT)");

	var statement = window.workspacedb.createStatement("INSERT INTO workspace_options (key, value) VALUES ('workspace.name', ?1)");
	statement.bindStringParameter(0, wizard_get_workspace_raw_name());
	statement.execute();

	var statement = window.workspacedb.createStatement("INSERT INTO workspace_options (key, value) VALUES ('workspace.type', ?1)");
	statement.bindStringParameter(0, wizard_get_workspace_raw_type());
	statement.execute();
}
