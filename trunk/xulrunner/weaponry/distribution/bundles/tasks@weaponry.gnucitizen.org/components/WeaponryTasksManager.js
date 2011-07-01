/**
 *  WeaponryTasksManager.js
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

function WeaponryTasksManager() {
	this.tasksById = {};
	this.tasksByName = {};
	this.observerService = CC['@mozilla.org/observer-service;1'].getService(CI.nsIObserverService);
}

WeaponryTasksManager.prototype = {
	classDescription: 'Weaponry Tasks Manager',
	classID: Components.ID('{6e2acf80-0531-11df-8a39-0800200c9a66}'),
	contractID: '@tasks.weaponry.gnucitizen.org/manager;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryTasksManager, CI.nsIObserver]),
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	observe: function (subject, topic, data) {
		if (topic == 'profile-after-change') {
			this.initializeComponent(subject, topic, data);
		} else
		if (topic == 'profile-before-change') {
			this.deinitializeComponent(subject, topic, data);
		} else
		
		if (topic == 'weaponry-task-created') {
			this.handleTaskCreateEvent(subject.QueryInterface(CI.IWeaponryTask));
		} else
		if (topic == 'weaponry-task-destroyed') {
			this.handleTaskDestroyEvent(subject.QueryInterface(CI.IWeaponryTask));
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	initializeComponent: function (subject, topic, data) {
		this.observerService.addObserver(this, 'weaponry-task-created', false);
		this.observerService.addObserver(this, 'weaponry-task-destroyed', false);
	},
	
	deinitializeComponent: function (subject, topic, data) {
		this.observerService.removeObserver(this, 'weaponry-task-created');
		this.observerService.removeObserver(this, 'weaponry-task-destroyed');
	},
	
	/* -------------------------------------------------------------------- */
	
	handleTaskCreateEvent: function (task) {
		this.registerTask(task);
	},
	
	handleTaskDestroyEvent: function (task) {
		this.unregisterTask(task);
	},
	
	/* -------------------------------------------------------------------- */
	
	registerTask: function (task) {
		this.unregisterTask(task);
		
		this.tasksById[task.id] = task;
		
		this.tasksByName[task.name] = task;
	},
	
	unregisterTask: function (task) {
		for (let name in this.tasksByName) {
			if (task.sameAs(this.tasksByName[name])) {
				delete this.tasksByName[name];
				delete this.tasksById[task.id];
				
				break;
			}
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	enumerateRegisteredTasks: function () {
		let tasks = CC['@mozilla.org/array;1'].createInstance(CI.nsIMutableArray);
		
		for (let name in this.tasksByName) {
			tasks.appendElement(this.tasksByName[name].QueryInterface(CI.nsISupports), false);
		}
		
		return tasks.enumerate();
	},
	
	enumerateRegisteredTasksAsynchronously: function (handler, completionHandler) {
		let enumerator = this.enumerateRegisteredTasks();
		
		while (enumerator.hasMoreElements()) {
			handler.handle(enumerator.getNext());
		}
		
		if (completionHandler) {
			completionHandler.handle();
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	getRegisteredTaskById: function (id) {
		return this.tasksById[id] ? this.tasksById[id] : null;
	},
	
	getRegisteredTaskByName: function (name) {
		return this.tasksByName[name] ? this.tasksByName[name] : null;
	}
};

/* ------------------------------------------------------------------------ */

var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryTasksManager]);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/