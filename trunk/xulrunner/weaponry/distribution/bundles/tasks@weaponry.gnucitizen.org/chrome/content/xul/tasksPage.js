/**
 *  tasksPage.js
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

function handleStartTaskCommandEvent(event) {
	let name = document.getElementById('tasks-page-tasks-datalist').selectedDataRow.name;
	let task = weaponryTasks.getTask(name);
	
	try {
		task.start();
	} catch (e) {
		Components.utils.reportError(e);
		
		window.alert(document.getElementById('tasks-page-properties-stringbundle').getString('start-task-failure-message'));
	}
}

function handlePauseTaskCommandEvent(event) {
	let name = document.getElementById('tasks-page-tasks-datalist').selectedDataRow.name;
	let task = weaponryTasks.getTask(name);
	
	if (!task.isPausable) {
		return;
	}
	
	try {
		task.pause();
	} catch (e) {
		Components.utils.reportError(e);
		
		window.alert(document.getElementById('tasks-page-properties-stringbundle').getString('pause-task-failure-message'));
	}
}

function handleResumeTaskCommandEvent(event) {
	let name = document.getElementById('tasks-page-tasks-datalist').selectedDataRow.name;
	let task = weaponryTasks.getTask(name);
	
	if (!task.isPausable) {
		return;
	}
	
	try {
		task.resume();
	} catch (e) {
		Components.utils.reportError(e);
		
		window.alert(document.getElementById('tasks-page-properties-stringbundle').getString('resume-task-failure-message'));
	}
}

function handleStopTaskCommandEvent(event) {
	let name = document.getElementById('tasks-page-tasks-datalist').selectedDataRow.name;
	let task = weaponryTasks.getTask(name);
	
	if (!task.isStoppable) {
		return;
	}
	
	if (!window.confirm(document.getElementById('tasks-page-properties-stringbundle').getString('stop-task-confirmation-message'))) {
		return;
	}
	
	try {
		task.stop();
	} catch (e) {
		Components.utils.reportError(e);
		
		window.alert(document.getElementById('tasks-page-properties-stringbundle').getString('stop-task-failure-message'));
	}
}

function handleActTaskCommandEvent(event) {
	let name = document.getElementById('tasks-page-tasks-datalist').selectedDataRow.name;
	let task = weaponryTasks.getTask(name);
	
	if (!task.isActable) {
		return;
	}
	
	try {
		task.act();
	} catch (e) {
		Components.utils.reportError(e);
		
		window.alert(document.getElementById('tasks-page-properties-stringbundle').getString('act-task-failure-message'));
	}
}

function handleClearTasksCommandEvent(event) {
	weaponryTasks.enumerateTasks(function (task) {
		if (task.isStopped || task.isFinished) {
			task.destroy();
		}
	});
}

/* ------------------------------------------------------------------------ */

function selectContentDeckPane() {
	if (document.getElementById('tasks-page-tasks-datalist').obtainDataLen() == 0) {
		document.getElementById('tasks-page-content-deck').selectedPanel = document.getElementById('tasks-page-splash-vbox');
	} else {
		document.getElementById('tasks-page-content-deck').selectedPanel = document.getElementById('tasks-page-tasks-vbox');
	}
}

/* ------------------------------------------------------------------------ */

function selectTasksDatalistItem() {
	let $tasksDatalist = document.getElementById('tasks-page-tasks-datalist');
	
	if ($tasksDatalist.selectedIndex < 0) {
		$tasksDatalist.selectedIndex = 0;
	}
}

/* ------------------------------------------------------------------------ */

function dispatchUiEvent(eventName, task) {
	let event = document.createEvent('Event');
	
	event.initEvent(eventName, true, true);
	
	event.data = {task:task};
	
	return window.dispatchEvent(event);
}

/* ------------------------------------------------------------------------ */

function computateTasksFields(fields) {
	fields.thumbnailUri = fields.thumbnailUri ? fields.thumbnailUri : 'chrome://' + CHROMEBASE + '/skin/xul/images/task.png';
	
	if (fields.isStopped) {
		fields.progressmeterMode = 'determined';
	} else
	if (fields.progress < 0) {
		fields.progressmeterMode = 'undetermined';
	} else {
		fields.progressmeterMode = 'determined';
	}
}

/* ------------------------------------------------------------------------ */

function doInsertTask(task, data) {
	let $tasksDatalist = document.getElementById('tasks-page-tasks-datalist');
	
	$tasksDatalist.appendDataRow({id:task.id, state:task.state, name:task.name, type:task.type, title:task.title, status:task.status, thumbnailUri:task.thumbnailUri, progress:task.progress, isActable:task.isActable, isStoppable:task.isStoppable, isPausable:task.isPausable, isAutodestroyable:task.isAutodestroyable, isCreated:task.isCreated, isRunning:task.isRunning, isStopped:task.isStopped, isPaused:task.isPaused, isFinished:task.isFinished});
}

function doCreateTask(task, data) {
	// pass
}

function doInitializeTask(task, data) {
	let $tasksDatalist = document.getElementById('tasks-page-tasks-datalist');
	
	$tasksDatalist.appendDataRow({id:task.id, state:task.state, name:task.name, type:task.type, title:task.title, status:task.status, progress:task.progress, thumbnailUri:task.thumbnailUri, isActable:task.isActable, isStoppable:task.isStoppable, isPausable:task.isPausable, isAutodestroyable:task.isAutodestroyable, isCreated:task.isCreated, isRunning:task.isRunning, isStopped:task.isStopped, isPaused:task.isPaused, isFinished:task.isFinished});
}

function doUpdateTask(task, data) {
	let $tasksDatalist = document.getElementById('tasks-page-tasks-datalist');
	
	$tasksDatalist.updateDataRow({id:task.id, state:task.state, name:task.name, type:task.type, title:task.title, status:task.status, progress:task.progress, thumbnailUri:task.thumbnailUri, isActable:task.isActable, isStoppable:task.isStoppable, isPausable:task.isPausable, isAutodestroyable:task.isAutodestroyable, isCreated:task.isCreated, isRunning:task.isRunning, isStopped:task.isStopped, isPaused:task.isPaused, isFinished:task.isFinished}, $tasksDatalist.obtainDataPos({id:task.id}));
}

function doDestroyTask(task, data) {
	let $tasksDatalist = document.getElementById('tasks-page-tasks-datalist');
	
	$tasksDatalist.removeDataRow($tasksDatalist.obtainDataPos({id:task.id}));
}

/* ------------------------------------------------------------------------ */

function handleDOMContentLoadedEvent(event) {
	if (event.target != document) {
		return;
	}
	
	let $tasksDatalist = document.getElementById('tasks-page-tasks-datalist');
	
	$tasksDatalist.registerFieldsComputer(computateTasksFields);
	
	weaponryTasks.enumerateTasks(
		function (task) {
			if (dispatchUiEvent('taskToBeInserted', task)) {
				doInsertTask(task, null);
			}
		},
		
		function (tasks) {
			selectTasksDatalistItem();
			selectContentDeckPane();
		}
	);
	
	window.tasksObserver = weaponryCommon.createObserver(['weaponry-task-created', 'weaponry-task-initialized', 'weaponry-task-updated', 'weaponry-task-destroyed'], function (subject, topic, data) {
		let task = subject.QueryInterface(CI.IWeaponryTask);
		
		if (topic == 'weaponry-task-created') {
			if (dispatchUiEvent('taskToBeCreated', task)) {
				doCreateTask(task, data);
			}
			
			selectTasksDatalistItem();
			selectContentDeckPane();
		} else
		if (topic == 'weaponry-task-initialized') {
			if (dispatchUiEvent('taskToBeInitialized', task)) {
				doInitializeTask(task, data);
			}
			
			selectTasksDatalistItem();
			selectContentDeckPane();
		} else
		if (topic == 'weaponry-task-updated') {
			if (dispatchUiEvent('taskToBeUpdated', task)) {
				doUpdateTask(task, data);
			}
			
			selectTasksDatalistItem();
			selectContentDeckPane();
		} else
		if (topic == 'weaponry-task-destroyed') {
			if (dispatchUiEvent('taskToBeDestroyed', task)) {
				doDestroyTask(task, data);
			}
			
			selectTasksDatalistItem();
			selectContentDeckPane();
		}
	});
	
	window.tasksObserver.register();
}

window.addEventListener('DOMContentLoaded', handleDOMContentLoadedEvent, false);

function handleUnloadEvent(event) {
	if (event.target != document) {
		return;
	}
	
	window.tasksObserver.unregister();
}

window.addEventListener('unload', handleUnloadEvent, false);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/