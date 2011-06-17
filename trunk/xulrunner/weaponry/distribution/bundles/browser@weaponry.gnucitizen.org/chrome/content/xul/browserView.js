/**
 *  browserView.js
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

function switchBrowserView(view) {
	let browserViewUri = '';
	
	if (view == '_default') {
		browserViewUri = 'chrome://' + CHROMEBASE + '/content/xul/browserView.xul';
	} else {
		browserViewUri = 'chrome://' + CHROMEBASE + '/content/xul/browserView.xul?view=' + view;
	}
	
	document.location = browserViewUri;
}

/* ------------------------------------------------------------------------ */

function reloadBrowserUrl() {
	let $contentBrowser = document.getElementById('browser-view-content-browser');
	
	$contentBrowser.reload();
}

function loadBrowserUrl(url) {
	let $contentBrowser = document.getElementById('browser-view-content-browser');
	
	$contentBrowser.loadURI(url);
}

/* ------------------------------------------------------------------------ */

function handlePrintSetupCommandEvent(event) {
	PrintUtils.showPageSetup();
}

function handlePrintCommandEvent(event) {
	PrintUtils.print(document.getElementById('browser-view-content-browser').contentWindow);
}

function handleOpenFindbarCommandEvent(event) {
	let $contentFindbar = document.getElementById('browser-view-content-findbar');
	
	$contentFindbar.open();
	$contentFindbar.getElement('findbar-textbox').focus();
}

function handleViewSourceCommandEvent(event) {
	let $contentBrowser = document.getElementById('browser-view-content-browser');
	let selection = $contentBrowser.contentWindow.getSelection();
	
	let range, contents, source;
	
	try {
		range = selection.getRangeAt(0);
		contents = range.cloneContents();
		source = (new XMLSerializer()).serializeToString(contents);
	} catch (e) {
		// pass
	}
	
	let contentDocument = $contentBrowser.contentDocument;
	
	if (!source) {
		range = document.createRange();
		
		range.setStartBefore(contentDocument.documentElement);
		range.setEndAfter(contentDocument.documentElement);
		
		contents = range.cloneContents();
		source = (new XMLSerializer()).serializeToString(contents);
		
		range.detach();
	}
	
	let contentType = contentDocument.contentType;
	let characterSet = $contentBrowser.contentDocument.characterSet;
	
	// NOTE: by default we select UTF-8, this is not right but it works
	characterSet = 'UTF-8';
	//
	
	window.open('view-source:data:' + contentType + ';charset=' + characterSet + ',' + encodeURIComponent(source));
}

function handleBrowserBackCommandEvent(event) {
	let $contentBrowser = document.getElementById('browser-view-content-browser');
	
	$contentBrowser.stop();
	$contentBrowser.goBack();
}

function handleBrowserForwardCommandEvent(event) {
	let $contentBrowser = document.getElementById('browser-view-content-browser');
	
	$contentBrowser.stop();
	$contentBrowser.goForward();
}

function handleBrowserReloadCommandEvent(event) {
	let $contentBrowser = document.getElementById('browser-view-content-browser');
	
	$contentBrowser.stop();
	$contentBrowser.reload();
}

function handleBrowserStopCommandEvent(event) {
	let $contentBrowser = document.getElementById('browser-view-content-browser');
	
	$contentBrowser.stop();
}

function handleBrowserGoCommandEvent(event) {
	let $contentLocationbox = document.getElementById('browser-view-content-locationbox');
	
	loadBrowserUrl($contentLocationbox.value);
}

function handleLocationChangeEvent(event) {
	handleBrowserGoCommandEvent();
}

/* ------------------------------------------------------------------------ */

function buildNeterrorUri(type, target, url, description) {
	let $properties = document.getElementById('browser-view-properties-stringbundle');
	
	return 'about:neterror?e=' + encodeURIComponent(type) + '&u=' + encodeURIComponent(url) + '&d=' + encodeURIComponent($properties.getFormattedString(description, [target]));
}

/* ------------------------------------------------------------------------ */

function buildAbsoluteUrl(base, url) {
	var baseURI = weaponryCommon.ioService.newURI(base, null, null);
	
	return weaponryCommon.ioService.newURI(baseURI.resolve(url), null, null).spec;
}

/* ------------------------------------------------------------------------ */

function showContentMenupopupEditGroup() {
	let $undoMenuitem = document.getElementById('browser-view-content-undo-menuitem');
	let $redoMenuitem = document.getElementById('browser-view-content-redo-menuitem');
	let $editSectionMenuseparator = document.getElementById('browser-view-content-edit-section-menuseparator');
	let $cutMenuitem = document.getElementById('browser-view-content-cut-menuitem');
	let $pasteMenuitem = document.getElementById('browser-view-content-paste-menuitem');
	let $deleteMenuitem = document.getElementById('browser-view-content-delete-menuitem');
	
	$undoMenuitem.hidden = false;
	$redoMenuitem.hidden = false;
	$editSectionMenuseparator.hidden = false;
	$cutMenuitem.hidden = false;
	$pasteMenuitem.hidden = false;
	$deleteMenuitem.hidden = false;
}

function hideContentMenupopupEditGroup() {
	let $undoMenuitem = document.getElementById('browser-view-content-undo-menuitem');
	let $redoMenuitem = document.getElementById('browser-view-content-redo-menuitem');
	let $editSectionMenuseparator = document.getElementById('browser-view-content-edit-section-menuseparator');
	let $cutMenuitem = document.getElementById('browser-view-content-cut-menuitem');
	let $pasteMenuitem = document.getElementById('browser-view-content-paste-menuitem');
	let $deleteMenuitem = document.getElementById('browser-view-content-delete-menuitem');
	
	$undoMenuitem.hidden = true;
	$redoMenuitem.hidden = true;
	$editSectionMenuseparator.hidden = true;
	$cutMenuitem.hidden = true;
	$pasteMenuitem.hidden = true;
	$deleteMenuitem.hidden = true;
}

/* ------------------------------------------------------------------------ */

function handleContentMenupopupPopupshowingEvent(event) {
	if (document.popupNode.tagName in {'INPUT':1, 'TEXTAREA':1}) {
		showContentMenupopupEditGroup();
	} else {
		hideContentMenupopupEditGroup();
	}
}

/* ------------------------------------------------------------------------ */

function handleContentBrowserDOMTitleChangedEvent(event) {
	let $contentBrowser = document.getElementById('browser-view-content-browser');
	
	if (event.target != $contentBrowser.contentDocument) {
		return;
	}
	
	let newDocumentTitle = '';
	
	if (event.target.title) {
		newDocumentTitle = event.target.title;
	} else {
		newDocumentTitle = document.originalTitle;
	}
	
	if (document.title != newDocumentTitle) {
		document.title = newDocumentTitle;
	}
}

function handleContentBrowserMouseoverEvent(event) {
	if (event.target.tagName != 'A') {
		return;
	}
	
	let $statusbox = document.getElementById('browser-view-statusbox');
	let url = buildAbsoluteUrl(event.target.baseURI, event.target.href);
	
	$statusbox.value = url;
}

function handleContentBrowserCertProblemEvent(event) {
	setTimeout(function () {
		let params = {
			exceptionAdded: false,
			prefetchCert: true,
			location: event.data.location,
		};
		
		window.openDialog('chrome://pippki/content/exceptionDialog.xul', '', 'chrome,modal,centerscreen', params);
		
		let $contentBrowser = document.getElementById('browser-view-content-browser');
		
		if (params.exceptionAdded) {
			reloadBrowserUrl();
		} else {
			loadBrowserUrl(buildNeterrorUri('nssBadCert', event.data.target, event.data.location, 'cert-problem-message'));
		}
	}, 100);
}

function handleContentBrowserSslErrorEvent(event) {
	setTimeout(function () {
		loadBrowserUrl(buildNeterrorUri('nssBadCert', event.data.target, event.data.location, 'ssl-error-message'));
	}, 100);
}

/* ------------------------------------------------------------------------ */

function handleDOMContentLoadedEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $contentMenupopup = document.getElementById('browser-view-content-menupopup');
	let $backCommand = document.getElementById('browser-view-back-command');
	let $forwardCommand = document.getElementById('browser-view-forward-command');
	let $reloadCommand = document.getElementById('browser-view-reload-command');
	let $stopCommand = document.getElementById('browser-view-stop-command');
	let $reloadButton = document.getElementById('browser-view-reload-toolbarbutton');
	let $stopButton = document.getElementById('browser-view-stop-toolbarbutton');
	let $contentLocationbox = document.getElementById('browser-view-content-locationbox');
	let $contentMacthrob = document.getElementById('browser-view-content-macthrob');
	let $contentBrowser = document.getElementById('browser-view-content-browser');
	let $statusbox = document.getElementById('browser-view-statusbox');
	
	$contentLocationbox.focus();
	
	document.originalTitle = document.title;
	
	let defaultTabURI = weaponryCommon.getPref('org.gnucitizen.weaponry.browser.defaultTabURI');
	
	if (defaultTabURI) {
		$contentBrowser.setAttribute('src', defaultTabURI);
	}
	
	$contentMenupopup.addEventListener('popupshowing', handleContentMenupopupPopupshowingEvent, false);
	
	$contentBrowser.addEventListener('DOMTitleChanged', handleContentBrowserDOMTitleChangedEvent, false);
	$contentBrowser.addEventListener('mouseover', handleContentBrowserMouseoverEvent, false);
	$contentBrowser.addEventListener('certProblem', handleContentBrowserCertProblemEvent, false);
	$contentBrowser.addEventListener('sslError', handleContentBrowserSslErrorEvent, false);
	
	let faviconService = weaponryCommon.getService('@mozilla.org/browser/favicon-service;1', 'nsIFaviconService');
	
	window.webProgressListener = weaponryCommon.createProgressListener($contentBrowser, CI.nsIWebProgress.NOTIFY_ALL, {
		onStateChange: function (webProgress, request, stateFlags, status) {
			if (stateFlags & CI.nsIWebProgressListener.STATE_IS_NETWORK && stateFlags & CI.nsIWebProgressListener.STATE_START) {
				$reloadCommand.setAttribute('disabled', true);
				$stopCommand.setAttribute('disabled', false);
				$reloadButton.hidden = true;
				$stopButton.hidden = false;
			} else
			if (stateFlags & CI.nsIWebProgressListener.STATE_STOP) {
				$reloadCommand.setAttribute('disabled', false);
				$stopCommand.setAttribute('disabled', true);
				$reloadButton.hidden = false;
				$stopButton.hidden = true;
			}
			
			if (stateFlags & CI.nsIWebProgressListener.STATE_IS_WINDOW) {
				if (stateFlags & CI.nsIWebProgressListener.STATE_START) {
					$contentMacthrob.collapsed = false;
				} else
				if (stateFlags & CI.nsIWebProgressListener.STATE_STOP) {
					$contentMacthrob.collapsed = true;
				}
			}
		},
		
		onStatusChange: function (webProgress, request, status, message) {
			$statusbox.value = message;
		},
		
		onLocationChange: function (webProgress, request, location) {
			if (location.spec.toLowerCase().trim() == 'about:blank') {
				$contentLocationbox.value = '';
			} else
			if (!(/^about:neterror/i.test(location.spec))) {
				$contentLocationbox.value = location.spec;
			}
			
			$backCommand.setAttribute('disabled', !$contentBrowser.canGoBack);
			$forwardCommand.setAttribute('disabled', !$contentBrowser.canGoForward);
			
			if (location.schemeIs('http') || location.schemeIs('https')) {
				weaponryCommon.recordFaviconForUrl(location);
			}
		}
	});
	
	window.webProgressListener.install(window);
}

window.addEventListener('DOMContentLoaded', handleDOMContentLoadedEvent, false);

function handleLoadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	if ('arguments' in window && window.arguments.length > 0) {
		loadBrowserUrl(window.arguments[0]);
	}
}

window.addEventListener('load', handleLoadEvent, false);

function handleUnloadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $contentBrowser = document.getElementById('browser-view-content-browser');
	
	$contentBrowser.removeEventListener('DOMTitleChanged', handleContentBrowserDOMTitleChangedEvent, false);
	$contentBrowser.removeEventListener('certProblem', handleContentBrowserCertProblemEvent, false);
	$contentBrowser.removeEventListener('sslError', handleContentBrowserSslErrorEvent, false);
}

window.addEventListener('unload', handleUnloadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/