/**
 *  console.js
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

let stringBundle = weaponryCommon.getBundle('chrome://' + CHROMEBASE + '/locale/htm/console.properties');

/* ------------------------------------------------------------------------ */

let console = null;
let aliases = {};

/* ------------------------------------------------------------------------ */

function setType(type) {
	console = type;
}

/* ------------------------------------------------------------------------ */

function scrollToBottom() {
	$('html, body').animate({scrollTop:$('body').height()}, 'fast');
}

/* ------------------------------------------------------------------------ */

function recordCommand(command) {
	let $handle = $('<div class="command"><pre class="line"></pre><pre class="error"></pre><pre class="output"></pre></div>');
	
	$handle.children('.line').text(command);
	
	$('#screen').append($handle);
	
	scrollToBottom();
	
	return $handle;
}

function parseCommand(command) {
	let random01 = Math.random().toString().substring(2);
	let random02 = Math.random().toString().substring(2);
	
	command = command.replace(/\\"/g, random01).replace(/\\'/g, random02);
	
	let random01RegExp = new RegExp(random01, 'g');
	let random02RegExp = new RegExp(random02, 'g');
	let tokens = [];
	
	command.split(/(".*?"|'.*?')/g).map(function (token) {
		if ((token.indexOf('"') == 0 && token.lastIndexOf('"') == token.length - 1) || (token.indexOf("'") == 0 && token.lastIndexOf("'") == token.length - 1)) {
			return token.substring(1, token.length - 1).replace(random01RegExp, '"').replace(random02RegExp, "'");
		} else {
			token = token.trim();
		}
		
		if ((/"|'/).test(token)) {
			let error = new Error('cannot parse command line near ' + token);
			
			error.token = token;
			
			throw error;
		} else {
			return token.replace(random01RegExp, '"').replace(random02RegExp, "'").split(/\s+/g);
		}
	}).forEach(function (entry) {
		if (entry.forEach) {
			entry.forEach(function (subentry) {
				tokens.push(subentry);
			});
		} else {
			tokens.push(entry);
		}
	});
	
	return tokens;
}

function executeConsoleCommand(command) {
	let $entry = recordCommand(command);
	
	let tokens;
	
	try {
		tokens = parseCommand(command);
	} catch (e) {
		Components.utils.reportError(e);
		
		$entry.children('.error').append($('<div></div>').text(stringBundle.formatStringFromName('parse-command-failure-message', [e.token], 1)));
		
		return;
	}
	
	if (tokens.length == 0) {
		return;
	}
	
	let commandName = tokens[0];
	
	if (!commandName) {
		return;
	}
	
	let args = tokens.splice(1, tokens.length);
	
	if (commandName == 'alias') {
		if (args.length > 2) {
			$entry.children('.error').append($('<div></div>').text(stringBundle.GetStringFromName('alias-usage-message')));
			
			return;
		} else
		if (args.length == 2) {
			aliases[args[0]] = args[1];
		} else
		if (args.length == 1) {
			$entry.children('.output').append($('<div></div>').text(args[0] + ' ' + aliases[args[0]]));
		} else
		if (args.length == 0) {
			let entries = [];
			
			let alias;
			
			for (alias in aliases) {
				entries.push(alias + ' ' + aliases[alias]);
			}
			
			if (entries.length == 0) {
				$entry.children('.error').append($('<div></div>').text(stringBundle.GetStringFromName('alias-usage-message')));
			} else {
				$entry.children('.output').append($('<div></div>').text(entries.join('\n')));
			}
		}
		
		return;
	} else
	if (commandName == 'clear') {
			$('#screen').html('');
			
			return;
	} else
	if (commandName in aliases) {
		commandName = aliases[commandName];
	}
	
	let handler = {
		write: function (input) {
			$entry.children('.output').append($('<span></span>').text(input));
		},
		
		writeLine: function (input) {
			$entry.children('.output').append($('<div></div>').text(input));
		},
		
		writeError: function (input) {
			$entry.children('.error').append($('<div></div>').text(input));
		}
	};
	
	try {
		weaponryConsoles.executeConsoleCommand(console, commandName, args, handler, window);
	} catch (e) {
		Components.utils.reportError(e);
		
		$entry.children('.error').append($('<div></div>').text(stringBundle.GetStringFromName('execute-command-failure-message')));
	}
}

/* ------------------------------------------------------------------------ */

function focusPrompt() {
	$('#prompt').focus();
}

/* ------------------------------------------------------------------------ */

$(document).ready(function () {
	$('#prompt').keypress(function (event) {
		if (event.keyCode == KeyEvent.DOM_VK_RETURN) {
			executeConsoleCommand(this.value);
			
			this.value = '';
			
			return true;
		} else
		if (event.keyCode == KeyEvent.DOM_VK_TAB) {
			// TODO: handle tab completition
			
			event.preventDefault();
			
			return false;
		} else {
			return true;
		}
	});
});

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/