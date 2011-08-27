/**
 *  acidplatformMainPage.js
 *  Copyright (C) 2007-2011  GNUCITIZEN
 */

function handleWeaponryBrowserDOMContentLoadedEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $properties = document.getElementById('weaponry-browser-main-page-properties-stringbundle');
	let $applicationsDataroll = document.getElementById('main-page-applications-dataroll');
	
	$applicationsDataroll.appendDataRow({label: $properties.getString('browser-label'), uri: 'chrome://browser.weaponry.gnucitizen.org/content/xul/browserWindow.xul'});
}

window.addEventListener('DOMContentLoaded', handleWeaponryBrowserDOMContentLoadedEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/