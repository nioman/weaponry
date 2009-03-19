/**
 * XUL ABSTRACTION LIBRARY
 **/
var Xal = {
	cc: Components.classes,
	ci: Components.interfaces,
}

/**
 * XAL QUIT
 **/
Xal.quit = function (force_quit) {
	var app_startup = this.cc['@mozilla.org/toolkit/app-startup;1']
	                      .getService(this.ci.nsIAppStartup);

	app_startup.quit(force_quit ? this.ci.nsIAppStartup.eForceQuit : this.ci.nsIAppStartup.eAttemptQuit); 
}

/**
 * XAL INSPECT DOCUMENT DOM
 **/
Xal.inspect_document_dom = function (doc) {
	var window_mediator = this.cc['@mozilla.org/rdf/datasource;1?name=window-mediator']
	                          .getService(this.ci.nsIWindowDataSource);

	var js_subscript_loader = this.cc['@mozilla.org/moz/jssubscript-loader;1']
	                              .createInstance(this.ci.mozIJSSubScriptLoader);

	var name_space = {};                         

	js_subscript_loader.loadSubScript('chrome://inspector/content/hooks.js', name_space);

	name_space.inspectDOMDocument(doc ? doc : document);
}

/**
 * XAL GET PREF
 **/
Xal.get_pref = function (pref, type) {
	var preferences_service = this.cc['@mozilla.org/preferences-service;1']
	                              .getService(this.ci.nsIPrefBranch);

	if (typeof(type) == 'undefined') {
		type = 'char';
	}

	switch(type) {
		case 'int': return preferences_service.getIntPref(pref); 
		case 'bool': return preferences_service.getBoolPref(pref);
		case 'char': return preferences_service.getCharPref(pref);
		default: throw 'unrecognized type ' + type;
	}
}

/**
 * XAL SET PREF
 **/
Xal.set_pref = function (pref, value, type) {
	var preferences_service = this.cc['@mozilla.org/preferences-service;1']
	                              .getService(this.ci.nsIPrefBranch);

	if (typeof(type) == 'undefined') {
		type = 'char';
	}

	switch(type) {
		case 'int': return preferences_service.setIntPref(pref, value); 
		case 'bool': return preferences_service.setBoolPref(pref, value);
		case 'char': return preferences_service.setCharPref(pref, value);
		default: throw 'unrecognized type ' + type;
	}
}
