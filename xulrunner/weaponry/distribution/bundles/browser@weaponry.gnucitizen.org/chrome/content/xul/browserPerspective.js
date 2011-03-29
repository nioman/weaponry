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

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function switchBrowserPerspective(perspective) {
	let browserPerspectiveUri = '';
	
	if (perspective == '_default') {
		browserPerspectiveUri = 'chrome://' + CHROMEBASE + '/content/xul/browserPerspective.xul';
	} else {
		browserPerspectiveUri = 'chrome://' + CHROMEBASE + '/content/xul/browserPerspective.xul?perspective=' + perspective;
	}
	
	document.location = browserPerspectiveUri;
}

/* ------------------------------------------------------------------------ */

function BrowserDOMWindow() {
	this.handlers = [];
}

BrowserDOMWindow.prototype = {
	QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsIBrowserDOMWindow]),
	
	get wrappedJSObject () {
		return this;
	},
	
	openURI: function(uri, opener, where, context) {
		let handlers = this.handlers;
		let handlersLength = handlers.length;
		
		let i, windowOpener;
		
		for (i = 0; i < handlersLength; i += 1) {
			try {
				windowOpener = handlers[i](uri, opener, where, context);
				
				if (windowOpener) {
					return windowOpener;
				}
			} catch (e) {
				weaponryCommon.reportError(e);
			}
		}
		
		return null;
	},
	
	isTabContentWindow: function (window) {
		return false;
	},
	
	registerOpenURIHandler: function (handler) {
		this.handlers.push(handler);
	},
	
	unregisterOpenURIHandler: function (handler) {
		let handlers = this.handlers;
		let index = handlers.indexOf(handler);
		
		if (index >= 0) {
			handlers.splice(index, 1);
		}
	}
};

/* ------------------------------------------------------------------------ */

function loadBrowserUrl(url) {
	let $tab = getTab();
	let $browser = $tab.$iframe.contentDocument.getElementById('browser-view-content-browser');
	
	$browser.loadURI(url, null, null);
}

/* ------------------------------------------------------------------------ */

function getBrowserViewUrl() {
	return 'chrome://' + CHROMEBASE + '/content/xul/browserView.xul' + (window.location.search ? window.location.search.replace('perspective=', 'view=') : '');
}

/* ------------------------------------------------------------------------ */

function getTab() {
	let $richtabpanels = document.getElementById('browser-perspective-tabs-richtabpanels');
	
	if ($richtabpanels.selectedPanel) {
		return $richtabpanels.selectedPanel;
	}
	
	return null;
}

function makeTab() {
	let $properties = document.getElementById('browser-perspective-properties-stringbundle');
	let $richtabpanel = document.createElement('richtabpanel');
	
	$richtabpanel.setAttribute('src', getBrowserViewUrl());
	$richtabpanel.setAttribute('class', 'browser-perspective-tabs-richtabpanels-richtabpanel');
	$richtabpanel.setAttribute('label', $properties.getString('browser-tab-label'));
	$richtabpanel.setAttribute('closable', 'true');
	
	let $richtabpanels = document.getElementById('browser-perspective-tabs-richtabpanels');
	
	$richtabpanels.appendChild($richtabpanel);
	
	$richtabpanel.$toolbarbutton.hidden = true;
	$richtabpanel.$menuitem.hidden = true;
	
	$richtabpanel.$iframe.addEventListener('DOMTitleChanged', function (event) {
		if (event.target != $richtabpanel.$iframe.contentDocument) {
			return;
		}
		
		if (event.target.title) {
			$richtabpanel.setAttribute('label', event.target.title);
		} else {
			$richtabpanel.setAttribute('label', $properties.getString('browser-tab-label'));
		}
	}, false);
	
	$richtabpanel.$toolbarbutton.addEventListener('DOMAttrModified', function (event) {
		if (event.attrName == 'checked') {
			if (event.newValue == 'true') {
				$richtabpanel.$iframe.contentDocument.getElementById('browser-view-content-browser').setAttribute('type', 'content-primary');
			} else {
				$richtabpanel.$iframe.contentDocument.getElementById('browser-view-content-browser').setAttribute('type', 'content-targetable');
			}
		}
	}, false);
	
	return $richtabpanel;
}

function openTab() {
	if (!('$lastTab' in window) || !window.$lastTab) {
		window.$lastTab = makeTab();
	}
	
	let $richtabpanel = window.$lastTab;
	
	$richtabpanel.$toolbarbutton.hidden = false;
	$richtabpanel.$menuitem.hidden = false;
	
	let $richtabpanels = document.getElementById('browser-perspective-tabs-richtabpanels');
	
	$richtabpanels.selectedPanel = $richtabpanel;
	
	let $contentLocationbox = $richtabpanel.$iframe.contentDocument.getElementById('browser-view-content-locationbox');
	
	if ($contentLocationbox) {
		$contentLocationbox.focus();
	}
	
	window.$lastTab = makeTab();
	
	return $richtabpanel;
}

function closeTab() {
	let $richtabpanel = getTab();
	
	if (!$richtabpanel) {
		return null;
	}
	
	$richtabpanel.close();
	
	return $richtabpanel;
}

/* ------------------------------------------------------------------------ */

function handleOpenTabCommandEvent(event) {
	openTab();
}

function handleCloseTabCommandEvent(event) {
	closeTab();
}

/* ------------------------------------------------------------------------ */

function handleOpenURI(uri, opener, where, context) {
	if (!opener) {
		return null;
	}
	
	if (weaponryCommon.getParentChromeWindow(weaponryCommon.getParentChromeWindow(opener.top)) != window) {
		return null;
	}
	
	let uri = uri ? uri.spec : 'about:blank';
	let referrer = opener ? opener.QueryInterface(CI.nsIInterfaceRequestor).getInterface(CI.nsIWebNavigation).currentURI : null;
	let $richtabpanel = openTab();
	let $browser = $richtabpanel.$iframe.contentDocument.getElementById('browser-view-content-browser');
	
	$browser.loadURI(uri, referrer, null);
	
	return $browser.contentWindow;
}

/* ------------------------------------------------------------------------ */

function handleTabsRichtabboxRichtabpanelCloseEvent(event) {
	let $richtabpanels = document.getElementById('browser-perspective-tabs-richtabpanels');
	
	if ($richtabpanels.childNodes.length == 2) {
		if (window.parent == window.top) {
			setTimeout(function () {
				window.parent.window.close();
			}, 100);
		} else {
			let closeEvent = document.createEvent('Event');
			
			closeEvent.initEvent('close', true, true);
			
			if (window.parent.window.dispatchEvent(closeEvent) == false) {
				event.preventDefault();
			}
		}
	}
}

/* ------------------------------------------------------------------------ */

function handleDOMContentLoadedEvent(event) {
	if (event.target != document) {
		return;
	}
	
	openTab();
	
	let rootWindow = weaponryCommon.getRootChromeWindow(window);
	
	if (!rootWindow.browserDOMWindow) {
		rootWindow.browserDOMWindow = new BrowserDOMWindow();
	}
	
	if (rootWindow.browserDOMWindow && rootWindow.browserDOMWindow.wrappedJSObject.registerOpenURIHandler) {
		rootWindow.browserDOMWindow.wrappedJSObject.registerOpenURIHandler(handleOpenURI);
	}
	
	let $tabsRichtabbox = document.getElementById('browser-perspective-tabs-richtabbox');
	
	$tabsRichtabbox.addEventListener('richtabpanelClose', handleTabsRichtabboxRichtabpanelCloseEvent, false);
}

window.addEventListener('DOMContentLoaded', handleDOMContentLoadedEvent, false);

function handleLoadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let defaultBrowserURI = weaponryCommon.getPref('org.gnucitizen.weaponry.browser.defaultBrowserURI');
	
	if (defaultBrowserURI) {
		loadBrowserUrl(defaultBrowserURI);
	}
}

window.addEventListener('load', handleLoadEvent, false);

function handleUnloadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let rootWindow = weaponryCommon.getRootChromeWindow(window);
	
	if (rootWindow.browserDOMWindow && rootWindow.browserDOMWindow.wrappedJSObject.unregisterOpenURIHandler) {
		rootWindow.browserDOMWindow.wrappedJSObject.unregisterOpenURIHandler(handleOpenURI);
	}
}

window.addEventListener('unload', handleUnloadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/