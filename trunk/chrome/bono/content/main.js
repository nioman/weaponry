/**
 * GET PREF
 **/
function get_pref(pref, type) {
	// get reference to the preferences service
	var preferences_service = Components.classes['@mozilla.org/preferences-service;1']
	                                    .getService(Components.interfaces.nsIPrefBranch);

	// the default type is char
	if (typeof(type) == 'undefined') {
		type = 'char';
	}

	// based on the type we read int, bool or char
	switch(type) {
		case 'int': return preferences_service.getIntPref(pref); 
		case 'bool': return preferences_service.getBoolPref(pref);
		case 'char': return preferences_service.getCharPref(pref);
		default: throw 'unrecognized type ' + type;
	}
}

/**
 * SET PREF
 **/
function set_pref(pref, value, type) {
	// get reference to the preferences service
	var preferences_service = Components.classes['@mozilla.org/preferences-service;1']
	                                    .getService(Components.interfaces.nsIPrefBranch);

	// the default type is char
	if (typeof(type) == 'undefined') {
		type = 'char';
	}

	// based on the type we write int, bool or char
	switch(type) {
		case 'int': return preferences_service.setIntPref(pref, value); 
		case 'bool': return preferences_service.setBoolPref(pref, value);
		case 'char': return preferences_service.setCharPref(pref, value);
		default: throw 'unrecognized type ' + type;
	}
}

/**
 * Open window
 **/
function open_window(src){
	return window.open(src, '', 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,chrome');
}

/**
 * TOGGLE SIDEBAR
 **/
function toggle_sidebar(e) {
	try {
		// treat e as an element
		var contenturi = e.getAttribute('contenturi');
		var contenttitle = e.getAttribute('contenttitle');
	} catch (e) {
		// treat e as an object
		var contenturi = e.contenturi;
		var contenttitle = e.contenttitle;
	}
alert('test');
	// do the toggling
	document.getElementById('main-sidebar-iframe').setAttribute('src', contenturi);
	document.getElementById('main-sidebar-toolbar-select-button').setAttribute('label', contenttitle);

	// always open
	document.getElementById('main-sidebar-splitter').setAttribute('state', 'open');
}

/**
 * TOGGLE BOTTOMBAR
 **/
function toggle_bottombar(e) {
	try {
		// treat e as an element
		var contenturi = e.getAttribute('contenturi');
		var contenttitle = e.getAttribute('contenttitle');
	} catch (e) {
		// treat e as an object
		var contenturi = e.contenturi;
		var contenttitle = e.contenttitle;
	}

	// do the toggling
	document.getElementById('main-bottombar-iframe').setAttribute('src', contenturi);
	document.getElementById('main-bottombar-toolbar-select-button').setAttribute('label', contenttitle);

	// always open
	document.getElementById('main-bottombar-splitter').setAttribute('state', 'open');
}

/**
 * MAIN QUIT COMMAND
 **/
function main_quit_command() {
	// get reference to the app-startip service
	var app_startup = Components.classes['@mozilla.org/toolkit/app-startup;1']
	                            .getService(Components.interfaces.nsIAppStartup);

	// force quit
	app_startup.quit(Components.interfaces.nsIAppStartup.eForceQuit); 
}

/**
 * SHOW NAVIGATION BAR
 **/
function main_show_navigation_bar() {
	// if main-view-show-navigation-bar is checked, show location bars, else hide them
	// get reference to the things we are going to work with
	var e = document.getElementById('main-view-show-navigation-bar');
	var c = e.getAttribute('checked') == 'true' ? 'true' : 'false';
	var n = document.getElementById('main-browser').tabManager.tabs.childNodes;
	
	for (var i = 0; i < n.length; i++) {
		n[i].tabContent.browserNavigationBox.setAttribute('collapsed', c);
	}
}

/**
 * MAIN OPEN ERROR CONSOLE COMMAND
 **/
function main_open_error_console_command() {
	open_window('chrome://global/content/console.xul');
}

/**
 * MAIN OPEN EXTENSION MANAGER COMMAND
 **/
function main_open_extension_manager_command() {
	open_window('chrome://mozapps/content/extensions/extensions.xul?type=extensions');
}

/**
 * MAIN OPEN CONFIGURATION MANAGER COMMAND
 **/
function main_open_configuration_manager_command() {
	open_window('about:config');
}

/**
 * MAIN ABOUT APP COMMAND
 **/
function main_about_app_command() {
	// show the about page for the current application
	document.getElementById('main-browser').openTab(get_pref('bono.about.homepage'), 'about:homepage', true);
}

/**
 * MAIN SIDEBAR TOOLBAR BUTTONS DETACH
 **/
function main_sidebar_toolbar_buttons_detach() {
	// locate the sidebar iframe and its source attribute
	var ifr = document.getElementById('main-sidebar-iframe');
	var src = ifr.getAttribute('src');

	// if the sidebar contains anything different from chrome://bono/content/sidebar.xul
	if (src != 'chrome://bono/content/sidebar.xul') {
		// restore the original sidebar
		ifr.setAttribute('src', 'chrome://bono/content/sidebar.xul');

		// restore the original label
		var btn = document.getElementById('main-sidebar-toolbar-select-button');
		btn.setAttribute('label', btn.getAttribute('originalLabel'));

		// open the content of the sidebar into a new window
		open_window(src);
	}
}

/**
 * MAIN SIDEBAR TOOLBAR BUTTONS CLOSE
 **/
function main_sidebar_toolbar_buttons_close() {
	// get a reference to the sidebar and collapse its state
	document.getElementById('main-sidebar-splitter').setAttribute('state', 'collapsed');
}

/**
 * MAIN SIDEBAR SPLITTER DOUBLE CLICK
 **/
function main_sidebar_splitter_double_click() {
	// get a reference to the sidebar splitter
	var e = document.getElementById('main-sidebar-splitter');
	
	// if state is collapsed make it open, else make it collapsed
	e.setAttribute('state', e.getAttribute('state') == 'collapsed' ? 'open' : 'collapsed');
}

/**
 * MAIN BOTTOMBAR TOOLBAR BUTTONS DETACH
 **/
function main_bottombar_toolbar_buttons_detach() {
	// locate the bottombar iframe and its source attribute
	var ifr = document.getElementById('main-bottombar-iframe');
	var src = ifr.getAttribute('src');

	// if the bottombar contains anything different from chrome://bono/content/bottombar.xul
	if (src != 'chrome://bono/content/bottombar.xul') {
		// restore the original bottombar
		ifr.setAttribute('src', 'chrome://bono/content/bottombar.xul');

		// restore the original label
		var btn = document.getElementById('main-bottombar-toolbar-select-button');
		btn.setAttribute('label', btn.getAttribute('originalLabel'));

		// open the content of the bottombar into a new window
		open_window(src);
	}
}

/**
 * MAIN BOTTOMBAR TOOLBAR BUTTONS CLOSE
 **/
function main_bottombar_toolbar_buttons_close() {
	// get a reference to the bottombar and collapse its state
	document.getElementById('main-bottombar-splitter').setAttribute('state', 'collapsed');
}

/**
 * MAIN BOTTOMBAR SPLITTER DOUBLE CLICK
 **/
function main_bottombar_splitter_double_click() {
	// get a reference to the bottombar splitter
	var e = document.getElementById('main-bottombar-splitter');
	
	// if state is collapsed make it open, else make it collapsed
	e.setAttribute('state', e.getAttribute('state') == 'collapsed' ? 'open' : 'collapsed');
}

/**
 * ON LOAD
 **/
function onload() {
	// decide if navigation bar needs displaying
	main_show_navigation_bar()

	// listen when new tab is spawned
	// decide if navigation bar needs displaying
	document.getElementById('main-browser').addEventListener('TabOpen', main_show_navigation_bar, true);

	// load homepage
	document.getElementById('main-browser').openTab(get_pref('bono.starup.homepage'), 'startup:homepage', true);
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
