/**
 * OPEN TERMINAL
 **/
function openTerminal(options) {
	if (!options) {
		options = {};
	}

	return window.openDialog('chrome://VT100/content/terminal.htm', '', 'resizable=no,chrome', options);
}
