function doA() {
	alert('A');
}

function doB() {
	alert('B');
}

function handleDOMContentLoadedEvent(event) {
	if (event.target != document) {
		return;
	}
	
	document.getElementById('test-commandA').addEventListener('command', doA, false);
	document.getElementById('test-commandB').setAttribute('oncommand', 'doB()');
}

addEventListener('DOMContentLoaded', handleDOMContentLoadedEvent, false);