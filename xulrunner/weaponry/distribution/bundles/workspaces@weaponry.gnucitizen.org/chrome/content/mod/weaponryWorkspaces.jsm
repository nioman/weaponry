/**
 *  weaponryWorkspaces.jsm
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

let EXPORTED_SYMBOLS = ['weaponryWorkspaces'];

/* ------------------------------------------------------------------------ */

const CR = Components.results;
const CC = Components.classes;
const CI = Components.interfaces;

/* ------------------------------------------------------------------------ */

const CHROMEBASE = 'workspaces.weaponry.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://common.weaponry.gnucitizen.org/content/mod/weaponryCommon.jsm');

/* ------------------------------------------------------------------------ */

let weaponryWorkspaces = new function () {
	let weaponryWorkspaces = this;
	
	/* -------------------------------------------------------------------- */
	
	this.workspacesManager = weaponryCommon.getService('@workspaces.weaponry.gnucitizen.org/manager;1', 'IWeaponryWorkspacesManager');
	this.workspacesService = weaponryCommon.getService('@workspaces.weaponry.gnucitizen.org/service;1', 'IWeaponryWorkspacesService');
	
	/* -------------------------------------------------------------------- */
	
	this.lookupWindowWorkspace = function (window) {
		if (window.workspace && window.workspace instanceof CI.IWeaponryWorkspace) {
			return window.workspace;
		}
		
		let workspaceNameMatch = window.document.location.search.match(/workspaceName=([^&]+)/);
		let workspaceName = undefined;
		
		if (workspaceNameMatch) {
			workspaceName = decodeURIComponent(workspaceNameMatch[1]);
		} else {
			if (window.arguments && window.arguments[0] && window.arguments[0].workspaceName) {
				workspaceName = window.arguments[0].workspaceName;
			}
		}
		
		if (workspaceName) {
			try {
				return this.workspacesService.getWorkspace(workspaceName);
			} catch (e) {
				// pass
			}
		}
		
		let parentChromeWindow = weaponryCommon.getParentChromeWindow(window);
		
		if (parentChromeWindow && parentChromeWindow.workspace) {
			return parentChromeWindow.workspace;
		}
		
		let rootChromeWindow = weaponryCommon.getRootChromeWindow(window);
		
		if (rootChromeWindow && rootChromeWindow.workspace) {
			return rootChromeWindow.workspace;
		}
		
		let openerWindow = window.opener;
		
		if (openerWindow && openerWindow.workspace) {
			return openerWindow.workspace;
		}
	};
	
	this.lookupHttpChannelWorkspace = function (httpChannel) {
		let window = weaponryCommon.getChannelWindow(httpChannel);
		
		if (!window) {
			return null;
		}
		
		let parentWindow = weaponryCommon.getParentChromeWindow(window.top);
			
		if (!parentWindow) {
			return null;
		}
		
		let workspace = parentWindow.workspace;
		
		if (!workspace) {
			return null;
		}
		
		return workspace;
	};
	
	this.lookupHttpChannelWorkspaceWindow = function (httpChannel) {
		let window = weaponryCommon.getChannelWindow(httpChannel);
		
		if (!window) {
			return null;
		}
		
		let parentWindow = weaponryCommon.getParentChromeWindow(window.top);
		
		if (!parentWindow) {
			return null;
		}	
		
		let topWindow = parentWindow.top;
		
		if (!topWindow) {
			return null;
		}
		
		let workspace = topWindow.workspace;
		
		if (!workspace) {
			return null;
		}
		
		if (topWindow != workspace.getWindow()) {
			return null;
		}
		
		return topWindow;
	};
	
	/* -------------------------------------------------------------------- */
	
	this.lookupWorkspaceWindowPerspective = function (window) {
		let perspectiveMatch = window.document.location.search.match(/perspective=([^&]+)/);
		
		if (perspectiveMatch) {
			return decodeURIComponent(perspectiveMatch[1]);
		} else {
			if (window.document.location.toString().indexOf('chrome://' + CHROMEBASE + '/content/xul/workspacePerspective.xul') >= 0) {
				return '_default';
			} else {
				return '';
			}
		}
	};
	
	this.lookupWorkspaceWindowView = function (window) {
		let viewMatch = window.document.location.search.match(/view=([^&]+)/);
		
		if (viewMatch) {
			return decodeURIComponent(viewMatch[1]);
		} else {
			if (window.document.location.toString().indexOf('chrome://' + CHROMEBASE + '/content/xul/workspaceView.xul') >= 0) {
				return '_default';
			} else {
				return '';
			}
		}
	};
	
	/* -------------------------------------------------------------------- */
	
	this.createRandomWorkspaceName = function () {
		return 'workspace-' + (new Date()).getTime();
	};
	
	this.createRandomWorkspace = function () {
		return this.createWorkspace(this.createRandomWorkspaceName());
	};
	
	/* -------------------------------------------------------------------- */
	
	this.startCreateWorkspaceUI = function (window) {
		let bundle = weaponryCommon.getBundle('chrome://' + CHROMEBASE + '/locale/mod/weaponryWorkspaces.properties');
		let result = weaponryCommon.prompt(window, bundle.GetStringFromName('create-workspace-prompt-message'), this.createRandomWorkspaceName());
		
		if (result.wasSuccessful) {
			let workspaceName = result.value.trim();
			
			if (!workspaceName) {
				window.alert(bundle.GetStringFromName('no-workspace-name-failure-message'));
			} else
			if (!this.checkWorkspaceExists(workspaceName)) {
				try {
					let workspace = this.createWorkspace(workspaceName);
					
					return workspace;
				} catch (e) {
					Components.utils.reportError(e);
					
					window.alert(bundle.GetStringFromName('create-workspace-failure-message'));
				}
			} else {
				weaponryCommon.alert(window, bundle.GetStringFromName('workspace-exists-prompt-message'));
			}
		}
	};
	
	this.startImportWorkspaceUI = function (window) {
		let bundle = weaponryCommon.getBundle('chrome://' + CHROMEBASE + '/locale/mod/weaponryWorkspaces.properties');
		let filePicker = weaponryCommon.createInstance('@mozilla.org/filepicker;1', 'nsIFilePicker');
		
		filePicker.init(window, bundle.GetStringFromName('import-workspace-filepicker-title'), CI.nsIFilePicker.modeOpen);
		filePicker.appendFilter(bundle.GetStringFromName('import-workspace-filepicker-workspace-files-filter-title'), '*.workspace');
		filePicker.appendFilter(bundle.GetStringFromName('import-workspace-filepicker-all-files-filter-title'), '*');
		
		let result = filePicker.show();
		
		if (result == CI.nsIFilePicker.returnOK) {
			let workspaceName = filePicker.file.leafName.replace(/\.workspace$/, '').trim();
			
			if (!this.checkWorkspaceExists(workspaceName)) {
				try {
					return this.importWorkspace(filePicker.file, workspaceName);
				} catch (e) {
					Components.utils.reportError(e);
					
					window.alert(bundle.GetStringFromName('import-workspace-failure-message'));
				}
			} else {
				let result = window.prompt(bundle.GetStringFromName('workspace-exists-prompt-message'), workspaceName);
				
				if (result.wasSuccessful) {
					let workspaceName = result.value.trim();
					
					if (!workspaceName) {
						window.alert(bundle.GetStringFromName('no-workspace-name-failure-message'));
					} else
					if (!this.checkWorkspaceExists(workspaceName)) {
						try {
							return this.importWorkspace(filePicker.file, workspaceName);
						} catch (e) {
							Components.utils.reportError(e);
							
							window.alert(bundle.GetStringFromName('import-workspace-failure-message'));
						}
					} else {
						window.alert(bundle.GetStringFromName('workspace-exists-failure-message'));
					}
				}
			}
		}
	},
	
	this.startExportWorkspaceUI = function (window, workspace) {
		if (!workspace) {
			workspace = this.lookupWindowWorkspace(window);
		}
		
		if (!workspace) {
			throw new Error('no workspace specified');
		}
		
		if (!(workspace instanceof CI.IWeaponryWorkspace)) {
			workspace = this.getWorkspace(workspace);
		}
		
		if (!workspace) {
			throw new Error('no workspace specified');
		}
		
		let bundle = weaponryCommon.getBundle('chrome://' + CHROMEBASE + '/locale/mod/weaponryWorkspaces.properties');
		let filePicker = weaponryCommon.createInstance('@mozilla.org/filepicker;1', 'nsIFilePicker');
		
		filePicker.init(window, bundle.GetStringFromName('export-workspace-filepicker-title'), CI.nsIFilePicker.modeSave);
		filePicker.appendFilter(bundle.GetStringFromName('export-workspace-filepicker-workspace-files-filter-title'), '*.workspace');
		filePicker.appendFilter(bundle.GetStringFromName('export-workspace-filepicker-all-files-filter-title'), '*');
		
		let result = filePicker.show();
		
		if (result == CI.nsIFilePicker.returnOK) {
			let workspaceName = workspace.name;
			
			try {
				this.exportWorkspace(workspaceName, filePicker.file);
			} catch (e) {
				Components.utils.reportError(e);
				
				window.alert(bundle.GetStringFromName('export-workspace-failure-message'));
			}
		}
	},
	
	this.startOpenWorkspaceUI = function (window, workspace) {
		if (!workspace) {
			workspace = this.lookupWindowWorkspace(window);
		}
		
		if (!workspace) {
			throw new Error('no workspace specified');
		}
		
		if (!(workspace instanceof CI.IWeaponryWorkspace)) {
			workspace = this.getWorkspace(workspace);
		}
		
		if (!workspace) {
			throw new Error('no workspace specified');
		}
		
		try {
			workspace.openWindow();
		} catch (e) {
			Components.utils.reportError(e);
			
			let bundle = weaponryCommon.getBundle('chrome://' + CHROMEBASE + '/locale/mod/weaponryWorkspaces.properties');
			
			window.alert(bundle.GetStringFromName('open-workspace-failure-message'));
		}
	}
	
	this.startRenameWorkspaceUI = function (window, workspace) {
		if (!workspace) {
			workspace = this.lookupWindowWorkspace(window);
		}
		
		if (!workspace) {
			throw new Error('no workspace specified');
		}
		
		if (!(workspace instanceof CI.IWeaponryWorkspace)) {
			workspace = this.getWorkspace(workspace);
		}
		
		if (!workspace) {
			throw new Error('no workspace specified');
		}
		
		let bundle = weaponryCommon.getBundle('chrome://' + CHROMEBASE + '/locale/mod/weaponryWorkspaces.properties');
		let result = window.prompt(bundle.GetStringFromName('rename-workspace-prompt-message'), workspace.name);
		let newName = '';
		
		if (!result.wasSuccessful) {
			return;
		} else {
			newName = result.value.trim();
			
			if (newName == workspace.name) {
				return;
			} else
			if (!newName) {
				window.alert(bundle.GetStringFromName('no-workspace-name-failure-message'));
				
				return;
			}
		}
		
		if (this.checkWorkspaceExists(newName)) {
			window.alert(bundle.GetStringFromName('workspace-exists-failure-message'));
			
			return;
		}
		
		try {
			workspace.rename(newName);
		} catch (e) {
			Components.utils.reportError(e);
			
			window.alert(bundle.GetStringFromName('rename-workspace-failure-message'));
		}
	};
	
	this.startDeleteWorkspaceUI = function (window, workspace) {
		if (!workspace) {
			workspace = this.lookupWindowWorkspace(window);
		}
		
		if (!workspace) {
			throw new Error('no workspace specified');
		}
		
		if (!(workspace instanceof CI.IWeaponryWorkspace)) {
			workspace = this.getWorkspace(workspace);
		}
		
		if (!workspace) {
			throw new Error('no workspace specified');
		}
		
		let bundle = weaponryCommon.getBundle('chrome://' + CHROMEBASE + '/locale/mod/weaponryWorkspaces.properties');
		
		if (!window.confirm(bundle.GetStringFromName('delete-workspace-confirmation-message'))) {
			return;
		}
		
		try {
			workspace.delete();
		} catch (e) {
			Components.utils.reportError(e);
			
			window.alert(bundle.GetStringFromName('delete-workspace-failure-message'));
		}
	};
	
	/* -------------------------------------------------------------------- */
	
	this.encodeParameters = function (parameters) {
		return JSON.stringify(parameters);
	};
	
	this.decodeParameters = function (parameters) {
		return JSON.parse(parameters);
	};
	
	/* -------------------------------------------------------------------- */
	
	this.ensureWorkspace = function (name) {
		if (this.checkWorkspaceExists(name)) {
			return this.getWorkspace(name);
		} else{
			return this.createWorkspace(name);
		}
	};
	
	/* -------------------------------------------------------------------- */
	
	this.checkWorkspaceExists = function (name) {
		return this.workspacesService.getWorkspaceFile(name).exists();
	};
	
	/* -------------------------------------------------------------------- */
	
	this.getWorkspacesDirectory = function () {
		try {
			return this.workspacesService.getWorkspacesDirectory().path;
		} catch (e) {
			Components.utils.reportError(e);
			
			return null;
		}
	};
	
	/* -------------------------------------------------------------------- */
	
	this.getWorkspaceFilename = function (name) {
		try {
			return this.workspacesService.getWorkspaceFilename(name).path;
		} catch (e) {
			Components.utils.reportError(e);
			
			return null;
		}
	};
	
	/* -------------------------------------------------------------------- */
	
	this.getWorkspaceFile = function (name) {
		try {
			return this.workspacesService.getWorkspaceFile(name).path;
		} catch (e) {
			Components.utils.reportError(e);
			
			return null;
		}
	};
	
	/* -------------------------------------------------------------------- */
	
	this.getWorkspace = function (name) {
		try {
			return this.workspacesService.getWorkspace(name);
		} catch (e) {
			return null;
		}
	};
	
	/* -------------------------------------------------------------------- */
	
	this.createWorkspace = function (name) {
		return this.workspacesService.createWorkspace(name);
	};
	
	/* -------------------------------------------------------------------- */
	
	this.destroyWorkspace = function (name) {
		return this.workspacesService.destroyWorkspace(name);
	};
	
	/* -------------------------------------------------------------------- */
	
	this.renameWorkspace = function (name, newName) {
		return this.workspacesService.renameWorkspace(name, newName);
	};
	
	this.deleteWorkspace = function (name) {
		return this.workspacesService.deleteWorkspace(name);
	};
	
	/* -------------------------------------------------------------------- */
	
	this.getWorkspaceWindow = function (name) {
		return this.workspacesService.getWorkspaceWindow(name);
	};
	
	this.openWorkspaceWindow = function (name) {
		return this.workspacesService.openWorkspaceWindow(name);
	};
	
	/* -------------------------------------------------------------------- */
	
	this.importWorkspace = function (file, name) {
		return this.workspacesService.importWorkspace(file, name);
	};
	
	this.exportWorkspace = function (name, file) {
		return this.workspacesService.exportWorkspace(name, file);
	};
	
	/* -------------------------------------------------------------------- */
	
	this.enumerateWorkspaces = function (handler, completionHandler) {
		let workspaces = [];
		let enumerator = this.workspacesService.enumerateWorkspaces();
		
		while (enumerator.hasMoreElements()) {
			let workspace = enumerator.getNext().QueryInterface(CI.IWeaponryWorkspace);
			
			if (handler) {
				handler(workspace);
			}
			
			workspaces.push(workspace);
		}
		
		if (completionHandler) {
			completionHandler(workspaces);
		}
		
		return workspaces;
	};
	
	this.enumerateWorkspacesAsynchronously = function (handler, completionHandler) {
		return this.workspacesService.enumerateWorkspacesAsynchronously(handler, completionHandler);
	};
	
	/* -------------------------------------------------------------------- */
	
	this.openWorkspacesWindow = function () {
		return this.workspacesService.openWorkspacesWindow();
	};
	
	/* -------------------------------------------------------------------- */
	
	this.getTableAPI = function (table, notificationPrefix) {
		return this.workspacesService.getTableAPI(table, notificationPrefix);
	};
	
	/* -------------------------------------------------------------------- */
	
	this.mapFastTableAPI = function (tableAPI, scope) {
		if (scope == undefined) {
			scope = {};
		}
		
		let fastTableAPI = tableAPI.wrappedJSObject;
		
		for (let propertyName in fastTableAPI) {
			if ((/TableItem(Asynchronously)?Fast$/).test(propertyName)) {
				scope[propertyName.replace(/Fast$/, '')] = (function (fastTableAPI, propertyName) {
					return function () {
						return fastTableAPI[propertyName].apply(fastTableAPI, arguments);
					};
				})(fastTableAPI, propertyName);
			}
		}
		
		return scope;
	};
};

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/