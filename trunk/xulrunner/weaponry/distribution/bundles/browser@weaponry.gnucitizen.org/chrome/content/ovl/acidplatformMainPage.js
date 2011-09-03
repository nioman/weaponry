/**
 *  acidplatformMainPage.js
 *  Copyright (C) 2007-2011  GNUCITIZEN
 */

function handleWeaponryBrowserDOMContentLoadedEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $stringbundle = document.getElementById('weaponry-browser-main-page-stringbundle');
	let $applicationsDataroll = document.getElementById('main-page-applications-dataroll');
	
	$applicationsDataroll.appendDataRow({label: $stringbundle.getString('browser-label'), uri: 'chrome://browser.weaponry.gnucitizen.org/content/xul/browserWindow.xul'});
}

window.addEventListener('DOMContentLoaded', handleWeaponryBrowserDOMContentLoadedEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/