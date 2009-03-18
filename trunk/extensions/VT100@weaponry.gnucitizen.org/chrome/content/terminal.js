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
		options.handler = function (ch) {
			this.write(ch);
		}
	}

	window.term = new VT100((options.cols ? options.cols : 80), (options.rows ? options.rows : 24), 'term');
	window.term.curs_set(true, true);

	if (options.noecho) {
		window.term.noecho();
	}

	VT100.go_getch_ = function() {
		var vt = VT100.the_vt_;

		if (vt === undefined) {
			return;
		}

		var ch = vt.key_buf_.shift();

		if (ch === undefined) {
			return;
		}

		if (vt.echo_ && ch.length == 1) {
			vt.addch(ch);
		}

		options.handler.call(window.term, ch);
	}
}

/**
 * ON RESIZE
 **/
function onresize() {
	// TODO: make resize work with VT100
}
