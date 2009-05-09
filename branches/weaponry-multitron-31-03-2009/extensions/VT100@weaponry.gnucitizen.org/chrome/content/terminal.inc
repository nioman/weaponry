/**
 * VT100 API
 **/
var VT100 = {
	openTerminal: function (options) {
		if (!options) {
			options = {};
		}

		return window.openDialog('chrome://VT100/content/terminal.htm', '', 'resizable=no,chrome', options);
	},
	runCmd: function (cmd, options) {
		var w = this.openTerminal({noecho:true});
		var l = Components.classes['@toolkit.weaponry.gnucitizen.org/cmdLauncher;1']
		                  .getService(Components.interfaces.cmdILauncher);

		w.addEventListener('TerminalReady', function () {
			l.launch(cmd, {
				title: cmd,

				onresult: function (data) {
					w.term.write(data);
				},

				onfinish: function () {
					w.close();
				}
			});
		}, true);
	},
};
