/**  
 *  AcidbrowserBasicCommandLauncher.js
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
 **/

const CR = Components.results;
const CC = Components.classes;
const CI = Components.interfaces;

/* ------------------------------------------------------------------------ */

const CHROMEBASE = 'basic.acidbrowser.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function AcidbrowserBasicCommandLauncher() {
	Components.utils.import('resource://common.weaponry.gnucitizen.org/content/mod/weaponryCommon.jsm');
	Components.utils.import('resource://preferences.weaponry.gnucitizen.org/content/mod/weaponryPreferences.jsm');
	
	this.outputFolder = null;
}

AcidbrowserBasicCommandLauncher.prototype = {
	classDescription: 'Acidbrowser Basic Command Launcher',
	classID: Components.ID('{7fe854b0-5597-11e0-b8af-0800200c9a66}'),
	contractID: '@basic.acidbrowser.gnucitizen.org/command-launcher;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IAcidbrowserBasicCommandLauncher, CI.IWeaponryConsolesCommandLauncher]),
	
	/* -------------------------------------------------------------------- */
	
	_xpcom_categories: [
		{service:true, entry:'AcidbrowserBasicCommandLauncher', category:'weaponry-consoles-command-launchers'}
	],
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	supportsConsole: function (console) {
		return console == 'acidbrowser';
	},
	
	supportsCommand: function (command) {
		return command in {'set_proxy':1, 'unset_proxy':1, 'set_output_folder':1, 'save_screenshot':1, 'save_last_transaction':1, 'start_transactions_log':1, 'stop_transactions_log':1};
	},
	
	/* -------------------------------------------------------------------- */
	
	doSetProxy: function (args, handler, context) {
		if (args.length != 2) {
			handler.writeError('usage: set_proxy <host> <port>');
			
			return;
		}
		
		weaponryPreferences.updateProxySettings(true, args[0], args[1], 'all');
		
		handler.writeLine('proxy set to ' + args[0] + ':' + args[1] + '...');
	},
	
	doUnsetProxy: function (args, handler, context) {
		dump(context);
		weaponryPreferences.updateProxySettings(false, null, null, null);
		
		handler.writeLine('proxy unset...');
	},
	
	doSetOutputFolder: function (args, handler, context) {
		if (args.length != 1) {
			handler.writeError('usage: set_output_folder <folder>');
			
			return;
		}
		
		let outputFolder;
		
		try {
			outputFolder = weaponryCommon.createFile(args[0]);
		} catch (e) {
			Components.utils.reportError(e);
			
			handler.writeError('path ' + args[0] + ' does not exist');
			
			return;
		}
		
		if (!outputFolder.exists()) {
			handler.writeError('path ' + args[0] + ' does not exist');
			
			return;
		}
		
		if (!outputFolder.isDirectory()) {
			handler.writeError('path ' + args[0] + ' is not a folder');
			
			return;
		}
		
		this.outputFolder = outputFolder;
	},
	
	doSaveScreenshot: function (args, handler, context) {
		if (!this.outputFolder) {
			handler.writeError('output folder is not set');
			
			return;
		}
		
		if (!(context instanceof CI.nsIDOMWindow)) {
			handler.writeError('command cannot be executed in this context');
		}
		
		let window = weaponryCommon.lookupParentWindowByType(context, 'browser.weaponry.gnucitizen.org:browser-perspective');
		let acidbrowserTakeScreenshot = window.acidbrowserTakeScreenshot;
		let file = this.outputFolder.clone();
		
		file.append('screenshot-' + (new Date()).getTime() + '.png');
		
		let screenshotUri = acidbrowserTakeScreenshot();
		
		screenshotUri = screenshotUri.substring(screenshotUri.indexOf(',') + 1, screenshotUri.length);
		screenshotUri = atob(screenshotUri);
		
		weaponryCommon.saveDataToFile(file, screenshotUri);
	},
	
	doSaveLastTransaction: function (args, handler, context) {
		if (!this.outputFolder) {
			handler.writeError('output folder is not set');
			
			return;
		}
	},
	
	doStartTransactionsLog: function (args, handler, context) {
		if (!this.outputFolder) {
			handler.writeError('output folder is not set');
			
			return;
		}
	},
	
	doStopTransactionsLog: function (args, handler, context) {
		if (!this.outputFolder) {
			handler.writeError('output folder is not set');
			
			return;
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	executeCommand: function (console, command, args, handler, context) {
		switch (command) {
			case 'set_proxy':
				this.doSetProxy(JSON.parse(args), handler, context);
				
				break;
			case 'unset_proxy':
				this.doUnsetProxy(JSON.parse(args), handler, context);
				
				break;
			case 'set_output_folder':
				this.doSetOutputFolder(JSON.parse(args), handler, context);
				
				break;
			case 'save_screenshot':
				this.doSaveScreenshot(JSON.parse(args), handler, context);
				
				break;
			case 'save_last_transaction':
				this.doSaveLastTransaction(JSON.parse(args), handler, context);
				
				break;
			case 'start_transactions_log':
				this.doStartTransactionsLog(JSON.parse(args), handler, context);
				
				break;
			case 'stop_transactions_log':
				this.doStopTransactionsLog(JSON.parse(args), handler, context);
				
				break;
			default:
				throw new Error('unsupported command ' + command);
		}
	}
}

/* ------------------------------------------------------------------------ */

if (XPCOMUtils.generateNSGetFactory) {
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([AcidbrowserBasicCommandLauncher]);
} else {
	var NSGetModule = XPCOMUtils.generateNSGetModule([AcidbrowserBasicCommandLauncher]);
}

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/