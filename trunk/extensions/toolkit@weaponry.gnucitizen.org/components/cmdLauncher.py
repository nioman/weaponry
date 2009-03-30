#!/usr/bin/env python

from xpcom import components
from subprocess import Popen, PIPE

class resultPusher:
	_com_interfaces_ = [components.interfaces.nsIRunnable]

	def __init__(self, result, observer):
		self.result = result
		self.observer = observer

	def run(self):
		self.observer.onresult(self.result)

class jobFinisher:
	_com_interfaces_ = [components.interfaces.nsIRunnable]

	def __init__(self, observer):
		self.observer = observer

	def run(self):
		self.observer.onfinish()

class threadedLauncher:
	_com_interfaces_ = [components.interfaces.nsIRunnable]

	def __init__(self, cmd, observer):
		self.cmd = cmd
		self.observer = observer

	def run(self):
		main = components.classes['@mozilla.org/thread-manager;1'].getService().mainThread;

		self.proc = Popen(self.cmd.split(' '), stdout=PIPE)

		while self.proc.returncode is None:
			main.dispatch(resultPusher(self.proc.stdout.readline(), self.observer), main.DISPATCH_NORMAL);
			self.proc.poll()

		main.dispatch(jobFinisher(self.observer), main.DISPATCH_NORMAL);

class cmdLauncher:
	_com_interfaces_ = [components.interfaces.cmdILauncher]
	_reg_clsid_ = '{4e5c9764-d465-4fef-ae24-8032f257d175}'
	_reg_contractid_ = '@toolkit.weaponry.gnucitizen.org/cmdLauncher;1'
	_reg_desc_ = 'Interface for Launching Command line Tools'

	def __init__(self):
		pass

	def launch(self, cmd, observer):
		background = components.classes['@mozilla.org/thread-manager;1'].getService().newThread(0);
		background.dispatch(threadedLauncher(cmd, observer), background.DISPATCH_NORMAL);
