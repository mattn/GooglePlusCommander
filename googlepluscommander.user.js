// ==UserScript==
// @name  Google+ Commander
// @author mattn
// @version Tue, 05 Jul 2011
// @namespace https://github.com/mattn/googlepluscommander
// @description keybinds for Google+. you can use j/k to scroll, and type 'c' to comment, 's' to share, '+' to +1.
// @include https://plus.google.com/*
// @match https://plus.google.com/*
// ==/UserScript==

(function() {
  function click(elem) {
    var e = document.createEvent('MouseEvent');
    e.initMouseEvent('click', true, true, e.view, 0, 0, 0, 0, 0, false, false, false, 0, null);
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
    var ret = [];
    var elems = elem.getElementsByTagName('button');
    for (var n = 0; n < elems.length; n++) {
      if (elems[n].getAttribute('g:type') == 'plusone') {
        var next = elems[n];
        while (next) {
          if (next.nodeType == 1 && next.getAttribute('role') == 'button')
            ret.push(next);
          next = next.nextSibling;
        }
      }
    }
    return ret;
  }

  function installKey(elem) {
    elem.addEventListener('keyup', function(e) {
      if (e.target.id.substring(0, 7) != 'update-') return;
      var c = String.fromCharCode(e.keyCode ? e.keyCode : e.charCode)
      if (!e.shiftKey) c = c.toLowerCase();
      switch (c) {
        case 'c':
          click(tools(e.target)[0]);
          return;
          break;
        case 'g':
          window.scrollTo(0, 0);
          return;
          break;
        case 'G':
          window.scrollTo(0, 9999);
          return;
          break;
        case 'n':
          click(document.getElementById('gbi1'));
          return;
          break;
        case 's':
          click(tools(e.target)[1]);
          return;
          break;
        case '+':
          plus(e.target);
          return;
          break;
      }
      e.preventDefault();
    }, false)
    elem.className += ' gpcommander';
  }

  function hasClass(elem, clazz) {
    var zz = elem.className.split(/\s+/g);
    for (var m = 0; m < zz.length; m++) {
      if (zz[m] == clazz) return true;
    }
    return false;
  }

  function install() {
    var elems = document.getElementsByTagName('div');
    for (var n = 0; n < elems.length; n++) {
      var e = elems[n];
      if (e.id.substring(0, 7) == 'update-' && !hasClass(e, 'gpcommander')) installKey(e);
    }
  }
  window.setInterval(install, 1000);
})()
