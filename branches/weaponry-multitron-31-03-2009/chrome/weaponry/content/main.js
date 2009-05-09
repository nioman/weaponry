/**
 * MAIN QUIT
 * exit Weaponry
 **/
function main_quit() {
	var ass = Components.classes['@mozilla.org/toolkit/app-startup;1']
	                    .getService(Components.interfaces.nsIAppStartup);

	ass.quit(Components.interfaces.nsIAppStartup.eForceQuit);
}
