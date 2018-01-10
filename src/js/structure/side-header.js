/**
 *
 * Side Header (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-01-01
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	var CLS_STICKY_ELM     = 'st-sticky-header';
	var CLS_STICKY_ELM_TOP = 'st-sticky-header-top';

	var DESKTOP_WIDTH_MIN = 1200;

	var CLS_ENTRY      = 'st-side-header-entry';
	var CLS_ENTRY_HEAD = 'st-side-header-entry-header';
	var CLS_ENTRY_CONT = 'st-side-header-entry-content';

	var getSiteHeaderOffset = makeOffsetFunction(CLS_STICKY_ELM, CLS_STICKY_ELM_TOP);
	var tars = collectElements();

	var isEnabled = false;
	var wpabH = 0;
	var shH   = 0;

	window.addEventListener('resize', onResize);
	onResize();
	function scrollAF() {
		onScroll();
		rafId = window.requestAnimationFrame(scrollAF);
	}
	var rafId = 0;


	// -------------------------------------------------------------------------

	function collectElements() {
		var ret = [];
		var es = document.getElementsByClassName(CLS_ENTRY);

		for (var i = 0; i < es.length; i += 1) {
			var e = es[i];

			var eh = e.getElementsByClassName(CLS_ENTRY_HEAD)[0];
			var ec = e.getElementsByClassName(CLS_ENTRY_CONT)[0];
			if (!eh || !ec) continue;

			var d = document.createElement('div');
			d.style.position = 'relative';
			d.style.overflow = 'hidden';
			d.style.flexGrow = 1;
			d.style.width = '100%';

			ret.push({entry: e, header: eh, content: ec, dummy_header: d, cur_state: false});
		}
		return ret;
	}

	function onResize() {
		if (window.innerWidth < DESKTOP_WIDTH_MIN) {
			if (isEnabled) {
				window.cancelAnimationFrame(rafId);
				rafId = 0;
				isEnabled = false;
				for (var i = 0; i < tars.length; i += 1) turnOffFixed(tars[i]);
			}
		} else {
			if (!isEnabled) {
				setTimeout(function () {
					isEnabled = true;
					for (var i = 0; i < tars.length; i += 1) turnOnFixed(tars[i]);
				}, 0);
			}
			setTimeout(function () {
				for (var i = 0; i < tars.length; i += 1) updateFixed(tars[i]);
				wpabH = getWpAdminBarHeight();
				shH   = getSiteHeaderOffset();
				scrollAF();
			}, 0);
		}
	}

	function turnOnFixed(tar) {
		tar.header.style.maxWidth = tar.header.clientWidth + 'px';
		tar.dummy_header.appendChild(tar.header);
		tar.entry.insertBefore(tar.dummy_header, tar.content);
		if (tar.cur_state) tar.entry.classList.remove(tar.cur_state);
		tar.cur_state = false;
	}

	function turnOffFixed(tar) {
		if (tar.cur_state) tar.entry.classList.remove(tar.cur_state);
		tar.cur_state = false;
		tar.entry.removeChild(tar.dummy_header);
		tar.entry.insertBefore(tar.header, tar.content);
		tar.header.style.maxWidth = '';
	}

	function updateFixed(tar) {
		var w = tar.dummy_header.clientWidth;
		if (0 < w) {
			tar.header.style.maxWidth = w + 'px';
			var hs = getComputedStyle(tar.header);
			var hh = tar.header.clientHeight + parseInt(hs.marginTop) + parseInt(hs.marginBottom);
			tar.dummy_header.style.minHeight = hh + 'px';
		} else {
			setTimeout(function () {updateFixed(tar);}, 10);
		}
	}

	function onScroll() {
		if (window.innerWidth < DESKTOP_WIDTH_MIN) return;  // This is needed!

		var pageYOffset = window.pageYOffset;

		for (var i = 0; i < tars.length; i += 1) {
			var tar = tars[i];
			var newState = getState(tar, pageYOffset, shH);
			if (tar.cur_state === newState) continue;

			if (tar.cur_state) tar.entry.classList.remove(tar.cur_state);
			tar.entry.classList.add(newState);

			tar.cur_state = newState;
			if (newState === 'fixed') {
				tar.header.style.top = (shH + wpabH) + 'px';
			} else {
				tar.header.style.top = '';
			}
		}
	}

	function getState(tar, pageYOffset, siteHeaderH) {
		var viewY = pageYOffset + siteHeaderH;
		var entryY = elementTopOnWindow(tar.entry), entryY2 = entryY + tar.entry.clientHeight;
		var headH = tar.header.clientHeight;

		if (entryY < viewY) {
			if (headH < entryY2 - viewY) return 'fixed';
			return 'bottom';
		}
		return 'top';
	}


	// Utilities ---------------------------------------------------------------

	function makeOffsetFunction(fixedElementClass, fixedHeightClass) {
		var elmFixed = document.getElementsByClassName(fixedElementClass);
		if (elmFixed && elmFixed.length > 0) {
			elmFixed = elmFixed[0];
			var elmHeight = document.getElementsByClassName(fixedHeightClass);
			if (elmHeight) elmHeight = elmHeight[0];
			else elmHeight = elmFixed;

			return function () {
				var pos = getComputedStyle(elmFixed).position;
				return pos === 'fixed' ? elmHeight.clientHeight : 0;
			};
		}
		return function () { return 0; }
	}

	function wrapFunction(fn, delay) {
		var st;
		return function() {
			if (st) clearTimeout(st);
			st = setTimeout(function () {
				fn();
				st = null;
			}, delay);
		};
	}

	function getWpAdminBarHeight() {
		var wpab = document.getElementById('wpadminbar');
		return wpab ? wpab.clientHeight : 0;
	}

	function elementTopOnWindow(elm) {
		var top = 0;
		while (elm) {
			top += elm.offsetTop + getTranslateY(elm);
			elm = elm.offsetParent;
		}
		return top;
	}

	function getTranslateY(elm) {
		if (!elm.style) return 0;
		var ss = elm.style.transform.split(')');
		ss.pop();
		for (var i = 0; i < ss.length; i += 1) {
			var vs = ss[i].split('(');
			var fun = vs[0].trim();
			var args = vs[1];
			switch (fun) {
			case 'translate':
				var xy = args.split(',');
				return parseFloat(xy[1] || '0');
			case 'translateY':
				return parseFloat(args);
			}
		}
		return 0;
	}

});
