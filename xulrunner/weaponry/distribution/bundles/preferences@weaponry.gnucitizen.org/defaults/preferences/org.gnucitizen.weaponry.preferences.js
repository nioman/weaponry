/**
 *  org.gnucitizen.weaponry.preferences.js
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

// optional toolkit preferences
// toolkit.defaultChromeURI
// toolkit.singletonWindowType

// browser preferences
pref('browser.preferences.animateFadeIn', false);
pref('browser.preferences.instantApply', false);

// general preferences
pref('general.warnOnAboutConfig', false);

// browser jsannoyances preferences
pref('browser.jsannoyances.disabled', true);

// dom preferences
pref('dom.event.contextmenu.enabled', false);

// optional network preferences
// network.http.connect.timeout
// network.http.request.timeout

// optional network protocol handler preferences
// network.protocol-handler.warn-external.http
// network.protocol-handler.warn-external.https

// browser download preferences
pref('browser.download.folderList', 0);
pref('browser.download.useDownloadDir', true);
pref('browser.download.manager.showAlertOnComplete', true);
pref('browser.download.manager.showAlertInterval', 2000);
pref('browser.download.manager.retention', 2);
pref('browser.download.manager.showWhenStarting', true);
pref('browser.download.manager.useWindow', true);
pref('browser.download.manager.closeWhenDone', false);
pref('browser.download.manager.openDelay', 0);
pref('browser.download.manager.focusWhenStarting', false);
pref('browser.download.manager.flashCount', 2);

// optional browser preferences
// browser.chromeURL
// browser.hiddenWindowChromeURL

// optional browser link preferences
// browser.link.open_external
// browser.link.open_newwindow
// browser.link.open_newwindow.restriction

// optional browser xull error preferences
// browser.xul.error_pages.enabled
// browser.xul.error_pages.expert_bad_cert

// optional browser formfill preferences
// browser.formfill.enable

// optional general useragent preferences
// general.useragent.compatMode.firefox

// alerts preferences
pref('alerts.totalOpenTime', 4000);
pref('alerts.slideIncrement', 1);
pref('alerts.slideIncrementTime', 10);

// extensions misc preferences
pref('extensions.ignoreMTimeChanges', false);
pref('extensions.logging.enabled', false);

// extensions update preferences
pref('extensions.update.enabled', true);
pref('extensions.update.interval', 86400);

// extensions dss preferences
pref('extensions.dss.enabled', false);
pref('extensions.dss.switchPending', false);

// skin preferences
pref('general.skins.selectedSkin', 'classic/1.0');

// accessibility typeaheadfind preferences
pref('accessibility.typeaheadfind', true);
pref('accessibility.typeaheadfind.timeout', 5000);
pref('accessibility.typeaheadfind.flashBar', 1);
pref('accessibility.typeaheadfind.linksonly', false);
pref('accessibility.typeaheadfind.casesensitive', 0);

// signon misc preferences
pref('signon.debug', false);
pref('signon.autofillForms', true);
pref('signon.rememberSignons', true);
pref('signon.expireMasterPassword', false);

// signon file preferences
pref('signon.SignonFileName', 'signons.txt');
pref('signon.SignonFileName2', 'signons2.txt');
pref('signon.SignonFileName3', 'signons3.txt');

// app update preferences
pref('app.update.mode', 1);
pref('app.update.auto', false);
pref('app.update.timer', 600000);
pref('app.update.silent', false);
pref('app.update.interval', 86400);
pref('app.update.showInstalledUI', false);
pref('app.update.incompatible.mode', 0);
pref('app.update.nagTimer.restart', 1800);
pref('app.update.nagTimer.download', 86400);
pref('app.update.channel', 'release');

// optional app update preferences
// app.update.enabled
// app.update.url
// app.update.url.manual
// app.update.url.details

// optional extensions preferences
// extensions.getAddons.maxResults
// extensions.getAddons.cache.enabled
// extensions.getAddons.get.url
// extensions.getAddons.search.url
// extensions.getAddons.search.browseURL
// extensions.blocklist.url
// extensions.webservice.discoverURL
// extensions.update.url
// extensions.update.url.manual
// extensions.update.url.details

// optional security preferences
// security.alternate_certificate_error_page

/*  GNUCITIZEN (Information Security Think Tank)
 **********************************************/