/**
 *  WeaponryTasksService.js
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

const CHROMEBASE = 'tasks.weaponry.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function WeaponryTasksService() {
	// pass
}

WeaponryTasksService.prototype = {
	classDescription: 'Weaponry Tasks Service',
	classID: Components.ID('{7341e940-0531-11df-8a39-0800200c9a66}'),
	contractID: '@tasks.weaponry.gnucitizen.org/service;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryTasksService]),
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	getTask: function (name) {
		let tasksManager = CC['@tasks.weaponry.gnucitizen.org/manager;1'].getService(CI.IWeaponryTasksManager);
		let task = tasksManager.getRegisteredTaskByName(name);
		
		if (!task) {
			throw new Error('task not found: ' + name);
		}
		
		return task;
	},
	
	/* -------------------------------------------------------------------- */
	
	createTaskWithPrototype: function (prototype) {
		let task = CC['@tasks.weaponry.gnucitizen.org/task;1'].createInstance(CI.IWeaponryTask);
		
		task.initWithPrototype(prototype);
		
		return task;
	},
	
	/* -------------------------------------------------------------------- */
	
	destroyTask: function (name) {
		return this.getTask(name).destroy();
	},
	
	/* -------------------------------------------------------------------- */
	
	setupTask: function (name, options) {
		return this.getTask(name).setup(options);
	},
	
	actTask: function (name) {
		return this.getTask(name).act();
	},
	
	startTask: function (name) {
		return this.getTask(name).start();
	},
	
	stopTask: function (name) {
		return this.getTask(name).stop();
	},
	
	pauseTask: function (name) {
		return this.getTask(name).pause();
	},
	
	resumeTask: function (name) {
		return this.getTask(name).resume();
	},
	
	finishTask: function (name) {
		return this.getTask(name).finish();
	},
		
	/* -------------------------------------------------------------------- */
	
	enumerateTasks: function () {
		return CC['@tasks.weaponry.gnucitizen.org/manager;1'].getService(CI.IWeaponryTasksManager).enumerateRegisteredTasks();
	},
	
	enumerateTasksAsynchronously: function (handler, completionHandler) {
		return CC['@tasks.weaponry.gnucitizen.org/manager;1'].getService(CI.IWeaponryTasksManager).enumerateRegisteredTasksAsynchronously(handler, completionHandler);
	},
	
	/* -------------------------------------------------------------------- */
	
	openTasksWindow: function () {
		let windowMediator = CC['@mozilla.org/appshell/window-mediator;1'].getService(CI.nsIWindowMediator);
		let window = windowMediator.getMostRecentWindow(CHROMEBASE + ':tasks-window');
		
		if (window) {
			window.focus();
			
			return window;
		}
		
		let windowWatcher = CC['@mozilla.org/embedcomp/window-watcher;1'].getService(CI.nsIWindowWatcher);
		
		return windowWatcher.openWindow(null, 'chrome://' + CHROMEBASE + '/content/xul/tasksWindow.xul', null, 'all,chrome,resizable', null);
	}
};

/* ------------------------------------------------------------------------ */

var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryTasksService]);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/