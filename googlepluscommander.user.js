// ==UserScript==
// @name  Google+ Commander
// @author mattn
// @version Tue, 05 Jul 2011
// @namespace https://github.com/mattn/googlepluscommander
// @description keybinds for Google+. you can use j/k to scroll, and type 'c' to comment, 's' to share, '+' to +1.
// @match https://plus.google.com/*
// ==/UserScript==

(function() {
	function click(elem) {
		var e = document.createEvent("MouseEvent");
		e.initMouseEvent("click", true, true, event.view, 0, 0, 0, 0, 0, false, false, false, 0, null);
		elem.dispatchEvent(e);
	}

	function plus(elem) {
		var elems = elem.getElementsByTagName('button');
		for (var n = 0; n < elems.length; n++) {
			if (elems[n].getAttribute('g:type') == 'plusone') {
				click(elems[n]);
			}
		}
	}

	function tools(elem) {
		return Array.prototype.slice.call(elem.getElementsByTagName('span'), 0).filter(function(e, i, a) {
			if (e.getAttribute('role') != 'button') return false;
			return true;
		});
	}

	function install(elem) {
		elem.addEventListener('keyup', function(e) {
			switch (e.keyCode) {
				case 67:
					elems = tools(e.target);
					click(elems[elems.length - 2]);
					break;
				case 83:
					elems = tools(e.target);
					click(elems[elems.length - 1]);
					break;
				case 187:
					plus(e.target);
					break;
			}
		}, false)
	}

	var elems = document.getElementsByTagName('div');
	for (var n = 0; n < elems.length; n++) {
		var e = elems[n];
		if (e.id.substring(0, 7) == 'update-') install(e);
	}
})()

