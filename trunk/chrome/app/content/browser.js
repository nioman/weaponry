/**
 * BROWSER CLOSE COMMAND
 **/
function browser_close_command() {
	window.close();
}

/**
 * BROWSER OPEN ERROR CONSOLE COMMAND
 **/
function browser_open_error_console_command() {
	window.open('chrome://global/content/console.xul', '', 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,chrome');
}

/**
 * BROWSER OPEN DOM INSPECTOR COMMAND
 **/
function browser_open_dom_inspector_command() {
	Xal.inspect_document_dom(document.getElementById('browser-browser').currentBrowser.contentDocument);
}
