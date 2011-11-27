addEventListener('unload', function (event) {
	// pass
}, false);

setTimeout(function () {
	alert('Shutting down!');
	var as = Components.classes['@mozilla.org/toolkit/app-startup;1'].getService(Components.interfaces.nsIAppStartup);
	as.quit(Components.interfaces.nsIAppStartup.eForceQuit);
}, 5000);