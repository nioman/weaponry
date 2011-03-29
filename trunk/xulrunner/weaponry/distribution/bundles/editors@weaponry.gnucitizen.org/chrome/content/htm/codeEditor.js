/**
 *  codeEditor.js
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

Components.utils.import('resource://common.weaponry.gnucitizen.org/content/mod/weaponryCommon.jsm');

/* ------------------------------------------------------------------------ */

// TODO: add options to surpress errors, warnings and logging

var console = {
	log: function () {
		weaponryCommon.logMessage.apply(weaponryCommon, arguments);
	}
};

/* ------------------------------------------------------------------------ */

var editor = null;

/* ------------------------------------------------------------------------ */

function getTheme() {
	new Error('getTheme not implemented'); // TODO: add code here
}

function setTheme(theme) {
	editor.setTheme('ace/theme/' + theme);
}

/* ------------------------------------------------------------------------ */

function getMode() {
	new Error('getMode not implemented'); // TODO: add code here
}

function setMode(mode) {
	var Mode = require('ace/mode/' + mode).Mode;
	
	editor.getSession().setMode(new Mode());
}

/* ------------------------------------------------------------------------ */

function setSource(source) {
	editor.getSession().setValue(source);
}

function getSource() {
	return editor.getSession().getValue();
}

/* ------------------------------------------------------------------------ */

$(document).ready(function () {
	editor = ace.edit('editor');
});

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/