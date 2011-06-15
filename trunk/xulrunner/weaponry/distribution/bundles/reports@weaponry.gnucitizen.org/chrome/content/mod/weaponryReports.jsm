/**
 *  weaponryReports.jsm
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

let EXPORTED_SYMBOLS = ['weaponryReports'];

/* ------------------------------------------------------------------------ */

const CR = Components.results;
const CC = Components.classes;
const CI = Components.interfaces;

/* ------------------------------------------------------------------------ */

const CHROMEBASE = 'reports.weaponry.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');
Components.utils.import('resource://common.weaponry.gnucitizen.org/content/mod/weaponryCommon.jsm');
Components.utils.import('resource://workspaces.weaponry.gnucitizen.org/content/mod/weaponryWorkspaces.jsm');

/* ------------------------------------------------------------------------ */

let weaponryReports = new function () {
	let weaponryReports = this;
	
	/* -------------------------------------------------------------------- */
	
	this.reportsService = weaponryCommon.getService('@reports.weaponry.gnucitizen.org/service;1', 'IWeaponryReportsService');
	
	/* -------------------------------------------------------------------- */
	
	this.startExportReportUI = function (window, workspace) {
		let bundle = weaponryCommon.getBundle('chrome://' + CHROMEBASE + '/locale/mod/weaponryReports.properties');
		let filePicker = weaponryCommon.createInstance('@mozilla.org/filepicker;1', 'nsIFilePicker');
		
		filePicker.init(window, bundle.GetStringFromName('export-report-filepicker-title'), CI.nsIFilePicker.modeSave);
		
		filePicker.defaultString = workspace.name;
		
		let reportExporters = [];
		let components = weaponryCommon.enumerateComponents('weaponry-report-exporters');
		let componentsLength = components.length;
		
		let i, component, reportExporter;
		
		for (i = 0; i < componentsLength; i += 1) {
			component = components[i];
			reportExporter = null;
			
			if (component.type == 'service') {
				reportExporter = weaponryCommon.getService(component.contractID, 'IWeaponryReportFileExporter');
			} else {
				reportExporter = weaponryCommon.createInstance(component.contractID, 'IWeaponryReportFileExporter');
			}
			
			filePicker.appendFilter(reportExporter.reportFileType, '*.' + reportExporter.reportFileExtension);
			
			reportExporters.push(reportExporter);
		}
		
		if (reportExporters.length == 0) {
			window.alert(bundle.GetStringFromName('no-exporters-failure-message'));
			
			return;
		}
		
		let result = filePicker.show();
		
		if (result == CI.nsIFilePicker.returnOK || result == CI.nsIFilePicker.returnReplace) {
			let reportExporter = reportExporters[filePicker.filterIndex];
			
			if (reportExporter instanceof CI.IWeaponryTaskPrototype) {
				let tasksService = weaponryCommon.getService('@tasks.weaponry.gnucitizen.org/service;1', 'IWeaponryTasksService');
				let task = tasksService.createTaskWithPrototype(reportExporter);
				
				if (task.taskPrototype instanceof CI.IWeaponryWorkspaceHolder) {
					task.taskPrototype.setWorkspace(workspace);
				}
				
				task.setup(JSON.stringify({workspaceName:workspace.name}));
				task.start();
				
				tasksService.openTasksWindow();
			} else
			if (reportExporter instanceof CI.IWeaponryTaskHolder) {
				let tasksService = weaponryCommon.getService('@tasks.weaponry.gnucitizen.org/service;1', 'IWeaponryTasksService');
				
				let task = tasksService.createTaskWithPrototype({
					QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryTaskHolder]),
					
					reportExporter: reportExporter,
					file: filePicker.file,
					weaponryCommon: weaponryCommon,
					fileNoLongerExistFailureMessage: bundle.GetStringFromName('file-no-longer-exist-failure-message'),
					
					getTask: function () {
						return this.reportExporter.getTask();
					},
					
					setTask: function (task) {
						this.reportExporter.setTask(task);
					},
					
					unsetTask: function (task) {
						this.reportExporter.unsetTask(task);
					},
					
					type: 'report-export-task',
					title: bundle.formatStringFromName('export-task-title', [reportExporter.reportFileType], 1),
					status: filePicker.file.path,
					progress: -1,
					thumbnailUri: 'moz-icon://.' + reportExporter.reportFileExtension + '?size=64',
					isActable: true,
					
					act: function () {
						if (this.file.exists()) {
							this.file.launch();
						} else {
							this.weaponryCommon.alert(null, this.fileNoLongerExistFailureMessage);
							
							this.getTask().destroy();
						}
					},
					
					start: function () {
						this.reportExporter.exportReportToFile(workspace, this.file);
					}
				});
				
				task.start();
				
				tasksService.openTasksWindow();
			} else {
				reportExporter.exportReportToFile(workspace, filePicker.file.path);
			}
		}
	};
	
	/* -------------------------------------------------------------------- */
	
	this.issuesTable = weaponryWorkspaces.mapFastTableAPI(this.reportsService.issuesTable);
	
	/* -------------------------------------------------------------------- */
	
	this.registerIssuesStringBundle = function (bundle) {
		return this.reportsService.registerIssuesStringBundle(bundle);
	};
	
	this.registerIssuesStringBundleUrl = function (url) {
		return this.reportsService.registerIssuesStringBundleUrl(url);
	};
	
	/* -------------------------------------------------------------------- */
	
	this.generateIssueString = function (name) {
		return this.reportsService.wrappedJSObject.generateIssueString(name);
	};
	
	this.generateIssueRecord = function (item) {
		return this.reportsService.wrappedJSObject.generateIssueRecordFast(item);
	};
};

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/