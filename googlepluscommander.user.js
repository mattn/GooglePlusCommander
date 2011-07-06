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
  function invokeMouseEvent(elem, evname) {
    var e = document.createEvent('MouseEvents');
    e.initMouseEvent(evname, true, true, e.view||window, 0, 0, 0, 0, 0,
      false, false, false, false, 0, null);
    elem.dispatchEvent(e);
  }

  function click(elem) {
    invokeMouseEvent(elem, 'click');
  }

  function mousedown(elem) {
    invokeMouseEvent(elem, 'mousedown');
  }

  function mouseup(elem) {
    invokeMouseEvent(elem, 'mouseup');
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

  function newEntry() {
    var elems = getElementsByTagAndClassName('div', 'n-Nd');
    if (elems.length > 0) {
      window.scrollTo(0, 0);
      click(elems[0]);
      return true;
    }
    return false;
  }

  function closeForm(elem) {
    if (elem.id.match(/\.f$/)) {
      var cancel = findCancelElement(elem);
      if (cancel) {
        elem.blur();
        cancel.focus();
        if (cancel.id.match(/\.c$/)) {
          click(cancel);
        } else {
          mousedown(cancel);
          mouseup(cancel);
        }
        return true;
      }
    }
    return false;
  }

  function installKey(elem) {
    elem.addEventListener('keyup', function(e) {
      if (e.target.id.substring(0, 7) != 'update-') return;
      var c = String.fromCharCode(e.keyCode ? e.keyCode : e.charCode)
      if (!e.shiftKey) c = c.toLowerCase();
      switch (c) {
        case 'i':
          if (newEntry()) {
            return;
          }
          break;
        case 'c':
          if (!e.ctrlKey) {
            click(tools(e.target)[0]);
            return;
          }
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
        case '+', '\xbb':
          plus(e.target);
          return;
          break;
      }
      e.preventDefault();
    }, false)
    elem.className += ' gpcommander';
  }

  function installEditorKeys(elem) {
    elem.addEventListener('keyup', function(e) {
      var hooked = false;
      if (hasClass(e.target, 'editable')) {
        var c = String.fromCharCode(e.keyCode ? e.keyCode : e.charCode);
        if (!e.shiftKey) {
          c = c.toLowerCase();
        }
        switch (c) {
          case '\x1b':
            hooked = closeForm(e.target);
            break;
        }
      }
      if (!hooked) {
        e.preventDefault();
      }
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

  function getElementsByTagAndClassName(tag, clazz) {
    var retval = [];
    var elems = document.getElementsByTagName(tag);
    for (var i = 0, I = elems.length; i < I; ++i) {
      var e = elems[i];
      if (hasClass(e, clazz)) {
        retval.push(e);
      }
    }
    return retval;
  }

  function findElement(elem, matcher) {
    if (matcher(elem)) {
      return elem;
    }
    for (var child = elem.firstChild; child; child = child.nextSibling) {
      var found = findElement(child, matcher);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  function findElementFromNext(elem, matcher) {
    for (var curr = elem.nextSibling; curr; curr = curr.nextSibling) {
      var found = findElement(curr, matcher); 
      if (found) {
        return found;
      }
    }
    if (elem.parentNode) {
      return findElementFromNext(elem.parentNode, matcher);
    } else {
      return undefined;
    }
  }

  function findCancelElement(elem) {
    return findElementFromNext(elem, function(e) {
      return e.id && e.id.match(/\.c(ancel)?$/);
    });
  }

  function install() {
    var elems = document.getElementsByTagName('div');
    for (var n = 0; n < elems.length; n++) {
      var e = elems[n];
      if (e.id.substring(0, 7) == 'update-' && !hasClass(e, 'gpcommander')) {
        installKey(e);
      } else if (hasClass(e, 'editable') && !hasClass(e, 'gpcommander')) {
        installEditorKeys(e);
      }
    }
  }
  window.setInterval(install, 1000);
})()
