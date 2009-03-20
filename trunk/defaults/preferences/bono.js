/**
 * DEBUGGING PREFS
 * copied from https://developer.mozilla.org/en/Debugging_a_XULRunner_Application
 **/
pref('browser.dom.window.dump.enabled', true);
pref('javascript.options.showInConsole', true);
pref('javascript.options.strict', true);
pref('nglayout.debug.disable_xul_cache', true);
pref('nglayout.debug.disable_xul_fastload', true);

/**
 * EXTENSION MANAGER
 * copied from https://developer.mozilla.org/en/XULRunner_tips#Extension_Manager
 **/
pref('xpinstall.dialog.confirm', 'chrome://mozapps/content/xpinstall/xpinstallConfirm.xul');
pref('xpinstall.dialog.progress.skin', 'chrome://mozapps/content/extensions/extensions.xul?type=themes');
pref('xpinstall.dialog.progress.chrome', 'chrome://mozapps/content/extensions/extensions.xul?type=extensions');
pref('xpinstall.dialog.progress.type.skin', 'Extension:Manager-themes');
pref('xpinstall.dialog.progress.type.chrome', 'Extension:Manager-extensions');
pref('extensions.update.enabled', true);
pref('extensions.update.interval', 86400);
pref('extensions.dss.enabled', false);
pref('extensions.dss.switchPending', false);
pref('extensions.ignoreMTimeChanges', false);
pref('extensions.logging.enabled', false);
pref('general.skins.selectedSkin', 'classic/1.0');
pref('extensions.update.url', 'chrome://mozapps/locale/extensions/extensions.properties');
pref('extensions.getMoreExtensionsURL', 'chrome://mozapps/locale/extensions/extensions.properties');
pref('extensions.getMoreThemesURL', 'chrome://mozapps/locale/extensions/extensions.properties');

/**
 * PREFERENCES NEEDED FOR FILE DOWNLOAD DIALOGS
 * copied from https://developer.mozilla.org/en/XULRunner_tips#Preferences_needed_for_file_download_dialogs
 **/
pref('browser.download.useDownloadDir', true);
pref('browser.download.folderList', 0);
pref('browser.download.manager.showAlertOnComplete', true);
pref('browser.download.manager.showAlertInterval', 2000);
pref('browser.download.manager.retention', 2);
pref('browser.download.manager.showWhenStarting', true);
pref('browser.download.manager.useWindow', true);
pref('browser.download.manager.closeWhenDone', true);
pref('browser.download.manager.openDelay', 0);
pref('browser.download.manager.focusWhenStarting', false);
pref('browser.download.manager.flashCount', 2);
pref('alerts.slideIncrement', 1);
pref('alerts.slideIncrementTime', 10);
pref('alerts.totalOpenTime', 4000);
pref('alerts.height', 50);

/**
 * ENABLING PASSWORD MANAGER
 * copied from https://developer.mozilla.org/en/XULRunner_tips#Enabling_Password_Manager
 **/
pref('signon.rememberSignons', true);
pref('signon.expireMasterPassword', false);
pref('signon.SignonFileName', 'signons.txt');

/**
 * DEFINE THE WAY WE HANDLE browserDOMWindow
 * I am not sure if this is actually needed
 **/
pref('browser.link.open_external', 2);
pref('browser.link.open_newwindow', 2);
pref('browser.link.open_newwindow.restriction', 0);

/**
 * XULRUNNER
 **/
pref('toolkit.defaultChromeURI', 'chrome://app/content/main.xul');
pref('toolkit.singletonWindowType', 'app:main');
pref('browser.chromeURL', 'chrome://app/content/browser.xul');
