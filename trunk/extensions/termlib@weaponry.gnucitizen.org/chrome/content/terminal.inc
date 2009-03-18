/**
 * OPEN TERMINAL
 **/
function openTerminal(options) {
	if (!options) {
		options = {};
	}

	return window.openDialog('chrome://termlib/content/terminal.htm', '', 'resizable=no,chrome', options);
}
