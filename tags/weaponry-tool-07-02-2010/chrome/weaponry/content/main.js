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
 * OPEN CONTENT
 **/
function open_content(uri, name, args) {
	// get a reference to main-browser and open a focused tab with uri, name and args
	document.getElementById('main-browser').openTab(uri, true, args);
}

/**
 * OPEN WINDOW
 **/
function open_window(uri){
	// open a window with all basic properties
	return window.open(uri, '', 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,chrome');
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
 * MAIN QUIT
 **/
function main_quit() {
	// just close the window but do not close other open windows
	window.close();
}

/**
 * SHOW NAVIGATION BAR
 **/
function main_show_navigation_bar() {
	// get a reference to the things we are going to work with
	var e = document.getElementById('main-view-show-navigation-bar');
	var c = (e.hasAttribute('checked') && e.getAttribute('checked') == 'true') ? 'false' : 'true';
	var n = document.getElementById('main-browser').tabManager.tabs.childNodes;

	// for each tab navigation bar set the collapsed state to the state of c
	for (var i = 0; i < n.length; i++) {
		n[i].tabContent.browserNavigationBox.setAttribute('collapsed', c);
	}
}

/**
 * MAIN OPEN ERROR CONSOLE
 **/
function main_open_error_console() {
	open_window('chrome://global/content/console.xul');
}

/**
 * MAIN OPEN EXTENSION MANAGER
 **/
function main_open_extension_manager() {
	open_window('chrome://mozapps/content/extensions/extensions.xul?type=extensions');
}

/**
 * MAIN OPEN CONFIGURATION MANAGER
 **/
function main_open_configuration_manager() {
	open_window('about:config');
}

/**
 * MAIN ABOUT APP
 **/
function main_about_app() {
	// show the about page for the current application
	document.getElementById('main-browser').openTab(get_pref('weaponry.about.page'), true);
}

/**
 * MAIN SIDEBAR DETACH
 **/
function main_sidebar_detach() {
	// locate the sidebar iframe and its source attribute
	var ifr = document.getElementById('main-sidebar-iframe');
	var src = ifr.getAttribute('src');

	// if the sidebar contains anything different from chrome://weaponry/content/sidebar.xul
	if (src != 'chrome://weaponry/content/sidebar.xul') {
		// restore the original sidebar
		ifr.setAttribute('src', 'chrome://weaponry/content/sidebar.xul');

		// restore the original label
		var btn = document.getElementById('main-sidebar-toolbar-select-button');
		btn.setAttribute('label', btn.getAttribute('originalLabel'));

		// open the content of the sidebar into a new window
		open_window(src);

		// close sidebar
		main_sidebar_close();
	}
}

/**
 * MAIN SIDEBAR CLOSE
 **/
function main_sidebar_close() {
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
 * MAIN BOTTOMBAR DETACH
 **/
function main_bottombar_detach() {
	// locate the bottombar iframe and its source attribute
	var ifr = document.getElementById('main-bottombar-iframe');
	var src = ifr.getAttribute('src');

	// if the bottombar contains anything different from chrome://weaponry/content/bottombar.xul
	if (src != 'chrome://weaponry/content/bottombar.xul') {
		// restore the original bottombar
		ifr.setAttribute('src', 'chrome://weaponry/content/bottombar.xul');

		// restore the original label
		var btn = document.getElementById('main-bottombar-toolbar-select-button');
		btn.setAttribute('label', btn.getAttribute('originalLabel'));

		// open the content of the bottombar into a new window
		open_window(src);

		// close bottombar
		main_bottombar_close();
	}
}

/**
 * MAIN BOTTOMBAR CLOSE
 **/
function main_bottombar_close() {
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

	// load startup page
	document.getElementById('main-browser').openTab(get_pref('weaponry.starup.page'), true);
}

/**
 * ON UNLOAD
 **/
function onunload() {
	// persist main-view-show-navigation-bar checked property due to bug 15232
	var e = document.getElementById('main-view-show-navigation-bar');

	if (!e.hasAttribute('checked')) {
		e.setAttribute('checked', 'false');
	}
}
