/**
 * TERMINAL
 **/
var term = null;

/**
 * ON LOAD
 **/
function onload() {
	if('arguments' in window && window.arguments.length > 0) {
		var options = window.arguments[0];
	} else {
		var options = {};
	}

	if (options.title) {
		window.title = options.title;
	}

	if (!options.handler) {
		options.handler = function () {
			var line = this.lineBuffer;
			this.newLine();

			this.write(line);
			this.prompt();
		}
	}

	window.term = new Terminal({
		handler: options.handler,
		x: 0,
		Y: 0,
		cols: options.cols ? options.cols : 80,
		rows: options.rows ? options.rows : 24,
		frameWidth: 0,
		bgColor: '#232e45'});

	window.term.open();

	if (options.invaders_must_die) {
		window.title = 'Invaders Must Die';
		TermlibInvaders.start(window.term);
	}
}

/**
 * ON RESIZE
 **/
function onresize() {
	var t = term;
	var d = t.getDimensions();
	var c = t.conf;

	var col_size = d.width/c.cols;
	var row_size = d.height/c.rows;

	var new_cols = new Number(new String(window.innerWidth/col_size).split('.')[0]) - 1;
	var new_rows = new Number(new String(window.innerHeight/row_size).split('.')[0]);

	t.maxCols = c.cols = new_cols;
	t.maxLines = c.rows = new_rows;

	window.term.rebuild();
}
