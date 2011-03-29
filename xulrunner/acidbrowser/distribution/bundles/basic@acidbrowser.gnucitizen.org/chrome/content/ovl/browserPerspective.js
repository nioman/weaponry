/**
 *  browserPerspective.js
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

function acidbrowserTakeScreenshot() {
	let $richtabpanel = getTab();
	let $browser = $richtabpanel.$iframe.contentDocument.getElementById('browser-view-content-browser');
	let width = $browser.contentWindow.innerWidth - 25; // TODO: get scrollbar width dynamically
	let height = $browser.contentWindow.innerHeight;
	
	if (width < 1000) {
		$browser.contentDocument.body.style.minWidth = width = 1000;
		
		height = $browser.contentDocument.body.scrollHeight;
	}
	
	let canvasWidth = width;
	let canvasHeight = height;
	let $canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
	
	$canvas.width = canvasWidth;
	$canvas.height = canvasHeight;
	$canvas.style.width = canvasWidth + 'px';
	$canvas.style.height = canvasHeight + 'px';
	
	let ctx = $canvas.getContext('2d');
	
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	ctx.save();
	ctx.drawWindow($browser.contentWindow, 0, 0, canvasWidth, canvasHeight, 'rgb(255,255,255)');
	ctx.restore();
	
	return $canvas.toDataURL('image/png', '');
}

/* ------------------------------------------------------------------------ */

function handleAcidbrowserBasicOpenConsoleCommandEvent(event) {
	var $consolePanel = document.getElementById('acidbrowser-basic-browser-perspective-console-panel');
	
	$consolePanel.openPopup(null, '', 10, 90, false, false);
}

/* ------------------------------------------------------------------------ */

function handleAcidbrowserBasicConsolePanelPopupshowingEvent(event) {
	var $mainConsole = document.getElementById('acidbrowser-basic-browser-perspective-main-console');
	
	$mainConsole.focus();
}

/* ------------------------------------------------------------------------ */

function handleAcidbrowserBasicDOMContentLoadedEvent(event) {
	if (event.target != document) {
		return;
	}
	
	var $consolePanel = document.getElementById('acidbrowser-basic-browser-perspective-console-panel');
	
	$consolePanel.addEventListener('popupshown', handleAcidbrowserBasicConsolePanelPopupshowingEvent, false);
}

window.addEventListener('DOMContentLoaded', handleAcidbrowserBasicDOMContentLoadedEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/