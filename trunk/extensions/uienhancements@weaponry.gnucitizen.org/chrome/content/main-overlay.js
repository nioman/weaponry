/**
 * UI ENHANCEMENTS SIDEBAR DETACH
 **/
function uienhancements_sidebar_detach() {
	var ifr = document.getElementById('main-sidebar-iframe');
	var src = ifr.getAttribute('src');

	if (src != 'chrome://app/content/sidebar.xul' && src != 'sidebar.xul') {
		ifr.setAttribute('src', 'chrome://app/content/sidebar.xul');
		document.getElementById('main-sidebar-toolbar-select-button').setAttribute('label', 'Sidebar');

		var w = window.open(
			src,
			'',
			'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,chrome');
	}
}

/**
 * UI ENHANCEMENTS BOTTOMBAR DETACH
 **/
function uienhancements_bottombar_detach() {
	var ifr = document.getElementById('main-bottombar-iframe');
	var src = ifr.getAttribute('src');

	if (src != 'chrome://app/content/sidebar.xul' && src != 'bottombar.xul') {
		ifr.setAttribute('src', 'chrome://app/content/bottombar.xul');
		document.getElementById('main-bottombar-toolbar-select-button').setAttribute('label', 'Bottombar');

		var w = window.open(
			src,
			'',
			'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,chrome');
	}
}
