setInterval(function () {
	document.getElementById('d').builder.rebuild();
}, 1000);

setTimeout(function () {
	var someListener = {
	  item: null,
	  willRebuild : function(builder) {
	    this.item = builder.getResourceAtIndex(builder.root.currentIndex);
	  },
	  didRebuild : function(builder) {
	    if (this.item) {
	      var idx = builder.getIndexOfResource(this.item)
	      if (idx != -1) builder.root.view.selection.select(idx);
	    }
	  }
	};
	
	document.getElementById('d').builder.addListener(someListener);
}, 1000);