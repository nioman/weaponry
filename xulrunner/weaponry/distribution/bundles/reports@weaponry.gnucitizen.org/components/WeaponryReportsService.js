/**
 *  WeaponryReportsService.js
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

const CHROMEBASE = 'reports.weaponry.gnucitizen.org';

/* ------------------------------------------------------------------------ */

Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

/* ------------------------------------------------------------------------ */

function WeaponryReportsService() {
	this.observerService = CC['@mozilla.org/observer-service;1'].getService(CI.nsIObserverService);
	this.stringBundleService = CC['@mozilla.org/intl/stringbundle;1'].getService(CI.nsIStringBundleService);
	this.workspacesService = CC['@workspaces.weaponry.gnucitizen.org/service;1'].getService(CI.IWeaponryWorkspacesService);
	this.levelsStringBundle = this.stringBundleService.createBundle('chrome://' + CHROMEBASE + '/locale/com/WeaponryReportsService.levels.properties');
	this.issuesStringBundles = [this.stringBundleService.createBundle('chrome://' + CHROMEBASE + '/locale/com/WeaponryReportsService.issues.properties')];
	this.issuesTable = this.workspacesService.getTableAPI('weaponryReportIssues', 'weaponry-report-issues');
	
	this.issuesTable.retrieveTable = 'weaponryReportIssuesExtendedView';
	this.issuesTable.enumerateTable = 'weaponryReportIssuesExtendedView';
}

WeaponryReportsService.prototype = {
	classDescription: 'Weaponry Reports Service',
	classID: Components.ID('{ce303510-083c-11df-8a39-0800200c9a66}'),
	contractID: '@reports.weaponry.gnucitizen.org/service;1',
	QueryInterface: XPCOMUtils.generateQI([CI.IWeaponryReportsService, CI.nsIObserver]),
	
	/* -------------------------------------------------------------------- */
	
	get wrappedJSObject () {
		return this;
	},
	
	/* -------------------------------------------------------------------- */
	
	observe: function(subject, topic, data) {
		if (topic == 'profile-after-change') {
			this.initializeComponent(subject, topic, data);
		} else
		if (topic == 'profile-before-change') {
			this.deinitializeComponent(subject, topic, data);
		} else
		
		if (topic == 'weaponry-workspace-connection-prepared') {
			this.prepareWorkspaceConnection(subject, topic, data);
		} else
		
		if (topic == 'weaponry-report-issue-found') {
			this.recordFoundReportIssue(subject, topic, data);
		}
	},
	
	/* -------------------------------------------------------------------- */
	
	initializeComponent: function (subject, topic, data) {
		this.observerService.addObserver(this, 'weaponry-workspace-connection-prepared', false);
		
		this.observerService.addObserver(this, 'weaponry-report-issue-found', false);
	},
	
	deinitializeComponent: function (subject, topic, data) {
		this.observerService.removeObserver(this, 'weaponry-workspace-connection-prepared');
		
		this.observerService.removeObserver(this, 'weaponry-report-issue-found');
	},
	
	/* -------------------------------------------------------------------- */
	
	prepareWorkspaceConnection: function (subject, topic, data) {
		let workspace = subject.QueryInterface(CI.IWeaponryWorkspace);
		
		workspace.executeStatement('CREATE TABLE IF NOT EXISTS weaponryReportIssues (timestamp DATE DEFAULT CURRENT_TIMESTAMP, type TEXT, signature TEXT, level INTEGER, title TEXT, summary TEXT, exact TEXT, description TEXT, explanation TEXT, metaData TEXT DEFAULT "{}" NOT NULL)', null);
		workspace.executeStatement('CREATE TEMP VIEW weaponryReportIssuesExtendedView AS SELECT (substr("00" || level, -2, 2) || "-" || type || "-" || title || "-" || timestamp) AS _sorter, _ROWID_ as _ROWID_, * FROM weaponryReportIssues ORDER BY _sorter DESC', null);
		workspace.executeStatement('CREATE TEMP TRIGGER weaponryReportIssuesUniqueTrigger BEFORE INSERT ON weaponryReportIssues FOR EACH ROW BEGIN DELETE FROM weaponryReportIssues WHERE signature = NEW.signature OR (type = NEW.type AND level = NEW.level AND title = NEW.title AND summary = NEW.summary AND exact = NEW.exact AND description = NEW.description AND explanation = NEW.explanation); END', null);
	},
	
	/* -------------------------------------------------------------------- */
	
	recordFoundReportIssue: function (subject, topic, data) {
		let workspace = subject.QueryInterface(CI.IWeaponryWorkspace);
		let item = this.generateIssueRecordFast(JSON.parse(data));
		
		this.issuesTable.wrappedJSObject.recordTableItemAsynchronouslyFast(workspace, item);
	},
	
	/* -------------------------------------------------------------------- */
	
	registerIssuesStringBundle: function (bundle) {
		this.issuesStringBundles.push(bundle);
	},
	
	registerIssuesStringBundleUrl: function (url) {
		this.registerIssuesStringBundle(this.stringBundleService.createBundle(url));
	},
	
	/* -------------------------------------------------------------------- */
	
	unregisterIssuesStringBundle: function (bundle) {
		// TODO: code
	},
	
	unregisterIssuesStringBundleUrl: function (url) {
		this.unregisterIssuesStringBundle(this.stringBundleService.createBundle(url));
	},
	
	/* -------------------------------------------------------------------- */
	
	generateIssueString: function (name) {
		let string = '';
		let length = this.issuesStringBundles.length;
		
		let i;
		
		for (i = 0; i < length; i += 1) {
			try {
				string = this.issuesStringBundles[i].GetStringFromName(name);
			} catch (e) {
				continue;
			}
			
			if (string) {
				break;
			}
		}
		
		return string;
	},
	
	/* -------------------------------------------------------------------- */
	
	generateIssueRecordFast: function (item) {
		let type = item.type;
		let signature = item.signature;
		let level = 0;
		
		try {
			level = parseInt(this.generateIssueString(type + '-level'), 10);
		} catch (e) {
			throw new Error('cannot find issue: ' + issue);
		}
		
		let title = this.pupulateTemplate(this.generateIssueString(type + '-title'), item);
		let summary = this.pupulateTemplate(this.generateIssueString(type + '-summary'), item);
		let exact = this.pupulateTemplate(this.generateIssueString(type + '-exact'), item);
		let safeItem = this.populateSafeFields(item);
		let description = this.pupulateTemplate(this.generateIssueString(type + '-description'), safeItem);
		let explanation = this.pupulateTemplate(this.generateIssueString(type + '-explanation'), safeItem);
		
		summary = summary.trim().replace(/\n+|\r+/g, ' ');
		
		return {type:type, signature:signature, level:level, title:title, summary:summary, exact:exact, explanation:explanation, description:description, metaData:JSON.stringify(item)};
	},
	
	generateIssueRecord: function (item) {
		return JSON.stringify(this.generateIssueRecordFast(JSON.parse(item)));
	},
	
	/* -------------------------------------------------------------------- */
	
	populateSafeFields: function (fields) {
		let safeFields = {};
		
		for (let field in fields) {
			safeFields[field] = fields[field] ? fields[field].toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') : '';
		}
		
		return safeFields;
	},
	
	/* -------------------------------------------------------------------- */
	
	pupulateTemplate: function (template, fields) {
		for (let field in fields) {
			template = template.replace(new RegExp('#' + field.replace(new RegExp('[.*+?|()\\[\\]{}\\\\]', 'g'), '\\$&') + '#', 'g'), fields[field] ? fields[field] : '');
		}
		
		return template;
	}
};

/* ------------------------------------------------------------------------ */

var NSGetFactory = XPCOMUtils.generateNSGetFactory([WeaponryReportsService]);

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/