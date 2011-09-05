/**
 *  colors.js
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

Components.utils.import('resource://org.gnucitizen.weaponry.common/content/mod/weaponryCommon.jsm');
Components.utils.import('resource://org.gnucitizen.weaponry.development/content/mod/weaponryDevelopment.jsm');

/* ------------------------------------------------------------------------ */

$(document).ready(function () {
	let bundle = weaponryCommon.getBundle('chrome://org.gnucitizen.weaponry.development/locale/htm/colors.properties');
	
	document.title = bundle.formatStringFromName('page-title', [weaponryCommon.xulAppInfo.name], 1);
	
	$.each([
		'ActiveBorder',
		'ActiveCaption',
		'AppWorkspace',
		'Background',
		'ButtonFace',
		'ButtonHighlight',
		'ButtonShadow',
		'ButtonText',
		'CaptionText',
		'GrayText',
		'Highlight',
		'HighlightText',
		'InactiveBorder',
		'InactiveCaption',
		'InactiveCaptionText',
		'InfoBackground',
		'InfoText',
		'Menu', 'MenuText',
		'Scrollbar',
		'ThreeDDarkShadow',
		'ThreeDFace',
		'ThreeDHighlight',
		'ThreeDLightShadow',
		'ThreeDShadow',
		'Window',
		'WindowFrame',
		'WindowText',
		'-moz-ButtonDefault',
		'-moz-ButtonHoverFace',
		'-moz-ButtonHoverText',
		'-moz-CellHighlight',
		'-moz-CellHighlightText',
		'-moz-Combobox',
		'-moz-ComboboxText',
		'-moz-Dialog',
		'-moz-DialogText',
		'-moz-dragtargetzone',
		'-moz-EvenTreeRow',
		'-moz-Field',
		'-moz-FieldText',
		'-moz-html-CellHighlight',
		'-moz-html-CellHighlightText',
		'-moz-mac-accentdarkestshadow',
		'-moz-mac-accentdarkshadow',
		'-moz-mac-accentface',
		'-moz-mac-accentlightesthighlight',
		'-moz-mac-accentlightshadow',
		'-moz-mac-accentregularhighlight',
		'-moz-mac-accentregularshadow',
		'-moz-mac-chrome-active',
		'-moz-mac-chrome-inactive',
		'-moz-mac-focusring',
		'-moz-mac-menuselect',
		'-moz-mac-menushadow',
		'-moz-mac-menutextselect',
		'-moz-MenuHover',
		'-moz-MenuHoverText',
		'-moz-MenuBarText',
		'-moz-MenuBarHoverText',
		'-moz-nativehyperlinktext',
		'-moz-OddTreeRow',
		'-moz-win-communicationstext',
		'-moz-win-mediatext',
		'-moz-activehyperlinktext',
		'-moz-hyperlinktext',
		'-moz-visitedhyperlinktext',
	], function (index, color) {
		$(document.body).append('<div style="float:left;margin-right:5px;margin-bottom:5px;font-size:70%;text-align:center;"><div style="width:15em;height:15em;background:' + color + '">&nbsp;</div>' + color + '</div>');
	});
});

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/