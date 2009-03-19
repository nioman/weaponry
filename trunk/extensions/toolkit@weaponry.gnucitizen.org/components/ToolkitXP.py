#
# XPCOM IMPORTS
#
from xpcom import components

#
# TOOLKIT XP
#
class ToolkitXP:
	_com_interfaces_ = [components.interfaces.IToolkitXP]
	_reg_clsid_ = '{9d2f9380-13db-11de-ab7a-0002a5d5c51b}'
	_reg_contractid_ = '@weaponry.gnucitizen.org/ToolkitXP;1'
	_reg_desc_ = 'Weaponry Toolkit Service'

	def __init__(self):
		pass

	def load_service(self, properties_file):
		pass
