/**
 *
 * Sticky Header - fixed (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2017-12-29
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	var CLS_STICKY_ELM     = 'st-sticky-header';
	var CLS_STICKY_ELM_TOP = 'st-sticky-header-top';
	var CLS_STATE_STICKY   = 'sticky';
	var CLS_STATE_FLOATING = 'floating';

	var elmSticky     = document.getElementsByClassName(CLS_STICKY_ELM)[0];
	var elmStickyView = document.getElementsByClassName(CLS_STICKY_ELM_TOP)[0];
	if (!elmSticky || !elmStickyView) return;

	var elmPh      = document.createElement('div');
	var isEnabled  = false;
	var isFloating = false;

	setEnabled(canEnabled());
	window.addEventListener('resize', onResize);
	onResize();
	addEventListenerWithOptions(window, 'scroll', wrapFunction(onScroll, 10), {capture: true});
	onScroll();

	function setEnabled(flag) {
		if (flag === isEnabled) return;
		if (flag) {
			elmSticky.classList.add(CLS_STATE_STICKY);
			elmSticky.parentNode.insertBefore(elmPh, elmSticky);
		} else {
			elmSticky.classList.remove(CLS_STATE_STICKY, CLS_STATE_FLOATING);
			elmSticky.style.transform = '';
			elmSticky.parentNode.removeChild(elmPh);
			isFloating = false;
		}
		isEnabled = flag;
	}

	function onResize() {
		setEnabled(canEnabled());
		if (!isEnabled) return;

		var h = elmSticky.clientHeight + 'px';
		elmPh.style.minHeight = elmPh.style.maxHeight = h;
		onScroll();
	}

	function onScroll() {
		if (!isEnabled) return;

		if (window.pageYOffset === 0) {
			if (isFloating) elmSticky.classList.remove(CLS_STATE_FLOATING);
			isFloating = false;
		} else {
			if (!isFloating) elmSticky.classList.add(CLS_STATE_FLOATING);
			isFloating = true;
		}
		var offset = elmStickyView.offsetTop;
		if (elmStickyView === elmSticky) offset -= elmSticky.offsetTop;

		if (offset < window.pageYOffset) {
			elmSticky.style.transform = 'translateY(-' + offset + 'px)';
		} else {
			elmSticky.style.transform = '';
		}
	}


	// Common ------------------------------------------------------------------

	function canEnabled() {
		var FIXED_MIN_WINDOW_WIDTH = 600;  // for-tablet-up
		var WINDOW_HEIGHT_RATE = 0.3;

		var fmww = (typeof STOOL_FIXED_MIN_WINDOW_WIDTH !== 'undefined') ? STOOL_FIXED_MIN_WINDOW_WIDTH : FIXED_MIN_WINDOW_WIDTH;
		if (window.innerWidth < fmww) return false;
		var h = elmStickyView.clientHeight;
		return (h < window.innerHeight * WINDOW_HEIGHT_RATE);
	}


	// Utilities ---------------------------------------------------------------

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


	var supportsPassive = false;
	try {
		var opts = Object.defineProperty({}, 'passive', {
			get: function() { supportsPassive = true; }
		});
		window.addEventListener('test', null, opts);
	} catch (e) {}

	function addEventListenerWithOptions(target, type, handler, options) {
		var optionsOrCapture = options;
		if (!supportsPassive) {
			optionsOrCapture = options.capture;
		}
		target.addEventListener(type, handler, optionsOrCapture);
	}

});
