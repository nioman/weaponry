/**
 * PYTHON ESSENTIALS OPEN PYTHON SHELL
 **/
function pythonessentials_open_python_shell() {
	// get reference to the pyShell service
	pyShellService = Components.classes['@twhiteman.netfirms.com/pyShell;1']
	                           .getService(Components.interfaces.pyIShell);

	// open a new terminal with a handle
	var w = Termlib.openTerminal({title:'Python Shell', handler:function () {
		var term = this;
		var line = term.lineBuffer;
		term.newLine();

		// TODO: make sure that long running tasks such as time.sleep(360) do not block the main process
		// we can make use of Workers here but that is not supported in xulrunner 1.9 for now...
		var result = window.pyShellService.evalPythonString(line);

		term.write(result);
		term.prompt();
	}});
}
