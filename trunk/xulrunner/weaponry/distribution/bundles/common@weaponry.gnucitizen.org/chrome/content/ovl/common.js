/**
 *  common.js
 *  Copyright (C) 2007-2011  GNUCITIZEN
 *  
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

const CR = Components.results;
const CC = Components.classes;
const CI = Components.interfaces;

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://common.weaponry.gnucitizen.org/content/mod/weaponryCommon.jsm');

/* ------------------------------------------------------------------------ */

function alert(message) {
	return weaponryCommon.alert(window, message);
}

function alertCheck(message, checkMessage) {
	return weaponryCommon.alertCheck(window, message, checkMessage);
}

/* ------------------------------------------------------------------------ */

function confirm(message) {
	return weaponryCommon.confirm(window, message);
}

function confirmCheck(message, checkMessage) {
	return weaponryCommon.confirmCheck(window, message, checkMessage);
}

/* ------------------------------------------------------------------------ */

function prompt(message, value) {
	return weaponryCommon.prompt(window, message, value);
}

/* ------------------------------------------------------------------------ */

function inheritCommonArguments() {
	if ('arguments' in window) {
		return;
	}
	
	if (window.parent == window) {
		return;
	}
	
	window.arguments = window.parent.arguments;
}

/* ------------------------------------------------------------------------ */

function cleanupCommonUi() {
	let $nodes = document.querySelectorAll('menu > menupopup:empty');
	let nodesLength = $nodes.length;
	
	let i, $node;
	
	for (i = 0; i < nodesLength; i += 1) {
		$node = $nodes[i];
		
		$node.parentNode.hidden = true;
	}
	
	$nodes = document.querySelectorAll('menu > menupopup:not(:empty)');
	nodesLength = $nodes.length;
	
	for (i = 0; i < nodesLength; i += 1) {
		$node = $nodes[i];
		
		if ((/^(\w+:)?menuseparator$/).test($node.firstChild.tagName)) {
			$node.firstChild.hidden = true;
		}
	}
}

/* ------------------------------------------------------------------------ */

function handleCommonDOMContentLoadedEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let documentElement = document.documentElement;
	let osType = weaponryCommon.xulRuntime.OS;
	let defaultLookAndFeel = weaponryCommon.getPref('org.gnucitizen.weaponry.common.defaultLookandfeel');
	
	if (defaultLookAndFeel) {
		documentElement.setAttribute('lookandfeel', defaultLookAndFeel);
	} else {
		switch (osType) {
			case 'Darwin':
			case 'Linux':
			case 'WINNT':
				documentElement.setAttribute('lookandfeel', osType);
				
				break;
			default:
				documentElement.setAttribute('lookandfeel', 'other');
		}
	}
	
	switch (osType) {
		case 'Darwin':
		case 'Linux':
		case 'WINNT':
			documentElement.setAttribute('uiflavour', osType);
			
			break;
		default:
			documentElement.setAttribute('uiflavour', 'other');
	}
	
	if (window.parent != window) {
		let parentDocumentElement = window.parent.document.documentElement;
		
		if (parentDocumentElement.hasAttribute('windowtype')) {
			documentElement.setAttribute('parentwindowtype', parentDocumentElement.getAttribute('windowtype'));
		}
	}
	
	cleanupCommonUi();
}

window.addEventListener('DOMContentLoaded', handleCommonDOMContentLoadedEvent, false);

function handleCommonLoadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	cleanupCommonUi();
}

window.addEventListener('load', handleCommonLoadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/