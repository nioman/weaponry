/**
 * TOGGLE SIDEBAR
 **/
function toggle_sidebar(e) {
	try {
		var contenturi = e.getAttribute('contenturi');
		var contenttitle = e.getAttribute('contenttitle');
	} catch (e) {
		var contenturi = e.contenturi;
		var contenttitle = e.contenttitle;
	}

	document.getElementById('main-sidebar-iframe').setAttribute('src', contenturi);
	document.getElementById('main-sidebar-toolbar-select-button').setAttribute('label', contenttitle);

	document.getElementById('main-sidebar-splitter').setAttribute('state', 'open');
}

/**
 * TOGGLE BOTTOMBAR
 **/
function toggle_bottombar(e) {
	try {
		var contenturi = e.getAttribute('contenturi');
		var contenttitle = e.getAttribute('contenttitle');
	} catch (e) {
		var contenturi = e.contenturi;
		var contenttitle = e.contenttitle;
	}

	document.getElementById('main-bottombar-iframe').setAttribute('src', contenturi);
	document.getElementById('main-bottombar-toolbar-select-button').setAttribute('label', contenttitle);

	document.getElementById('main-bottombar-splitter').setAttribute('state', 'open');
}

/**
 * MAIN QUIT COMMAND
 **/
function main_quit_command() {
	// TODO: uncomment this before release
	//if (!confirm('Are you sure you want to quit?')) {
	//	return false;
	//}

	Xal.quit();
}

/**
 * SHOW NAVIGATION BAR
 **/
function main_show_navigation_bar() {
	var e = document.getElementById('main-view-show-navigation-bar');
	var c = e.getAttribute('checked') == 'true' ? true : false;
	var b = document.getElementById('main-browser');

	if (c == true) {
		// show location bars
		for (var i = 0; i < b.tabManager.tabs.childNodes.length; i++) {
			var tab = b.tabManager.tabs.childNodes[i];
			tab.tabContent.browserNavigationBox.setAttribute('collapsed', 'false');
		}
	} else {
		// hide location bars
		for (var i = 0; i < b.tabManager.tabs.childNodes.length; i++) {
			var tab = b.tabManager.tabs.childNodes[i];
			tab.tabContent.browserNavigationBox.setAttribute('collapsed', 'true');
		}
	}
}

/**
 * MAIN OPEN ERROR CONSOLE COMMAND
 **/
function main_open_error_console_command() {
	window.open(
		'chrome://global/content/console.xul',
		'',
		'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,chrome');
}

/**
 * MAIN OPEN DOM INSPECTOR COMMAND
 **/
function main_open_dom_inspector_command() {
	Xal.inspect_document_dom();
}

/**
 * MAIN OPEN EXTENSION MANAGER COMMAND
 **/
function main_open_extension_manager_command() {
	var w = window.open(
		'chrome://mozapps/content/extensions/extensions.xul?type=extensions',
		'',
		'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,chrome');
}

/**
 * MAIN OPEN CONFIGURATION MANAGER COMMAND
 **/
function main_open_configuration_manager_command() {
	window.open(
		'about:config',
		'',
		'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,chrome');
}

/**
 * MAIN ABOUT APP COMMAND
 **/
function main_about_app_command() {
	document.getElementById('main-browser').openTab(Xal.get_pref('app.about.homepage'), 'about:homepage', true);
}

/**
 * MAIN SIDEBAR TOOLBAR BUTTONS CLOSE
 **/
function main_sidebar_toolbar_buttons_close() {
	document.getElementById('main-sidebar-splitter').setAttribute('state', 'collapsed');
}

/**
 * MAIN SIDEBAR SPLITTER DOUBLE CLICK
 **/
function main_sidebar_splitter_double_click() {
	var s = document.getElementById('main-sidebar-splitter');

	if (s.getAttribute('state') == 'collapsed') {
		s.setAttribute('state', 'open');
	} else {
		s.setAttribute('state', 'collapsed');
	}
}

/**
 * MAIN BOTTOMBAR TOOLBAR BUTTONS CLOSE
 **/
function main_bottombar_toolbar_buttons_close() {
	document.getElementById('main-bottombar-splitter').setAttribute('state', 'collapsed');
}

/**
 * MAIN BOTTOMBAR SPLITTER DOUBLE CLICK
 **/
function main_bottombar_splitter_double_click() {
	var s = document.getElementById('main-bottombar-splitter');

	if (s.getAttribute('state') == 'collapsed') {
		s.setAttribute('state', 'open');
	} else {
		s.setAttribute('state', 'collapsed');
	}
}

/**
 * ON LOAD
 **/
function onload() {
	// decide if navigation bar needs displaying
	main_show_navigation_bar()

	// listen when new tab is spawned
	document.getElementById('main-browser').addEventListener('TabOpen', function () {
		// decide if navigation bar needs displaying
		main_show_navigation_bar()
	}, true);

	// load homepage
	document.getElementById('main-browser').openTab(Xal.get_pref('app.starup.homepage'), 'app:homepage', true);
}

/**
 * ON UNLOAD
 **/
function onunload() {
	// persist main-view-menu-popup-show-navigation-bar checked property due to bug 15232
	var e = document.getElementById('main-view-menu-popup-show-navigation-bar');

	if (!e.hasAttribute('checked')) {
		e.setAttribute('checked', 'false');
	}
}
