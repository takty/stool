/**
 *
 * Sticky Header - fixed (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-02-16
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	const CLS_STICKY_ELM     = 'st-sticky-header';
	const CLS_STICKY_ELM_TOP = 'st-sticky-header-top';
	const CLS_STATE_STICKY   = 'sticky';
	const CLS_STATE_FLOATING = 'floating';

	const elmSticky     = document.getElementsByClassName(CLS_STICKY_ELM)[0];
	const elmStickyView = document.getElementsByClassName(CLS_STICKY_ELM_TOP)[0];
	if (!elmSticky || !elmStickyView) return;

	const elmPh      = document.createElement('div');
	let isEnabled  = false;
	let isFloating = false;

	setEnabled(canEnabled());
	window.addEventListener('resize', onResize);
	onResize();
	addEventListenerWithOptions(window, 'scroll', wrapFunction(onScroll, 10), {capture: true});
	onScroll();

	doBeforePrint(function () {setEnabled(false);});

	function setEnabled(flag) {
		if (flag === isEnabled) return;
		if (flag) {
			elmSticky.classList.add(CLS_STATE_STICKY);
			elmSticky.parentNode.insertBefore(elmPh, elmSticky);
		} else {
			elmSticky.classList.remove(CLS_STATE_STICKY);
			elmSticky.classList.remove(CLS_STATE_FLOATING);
			elmSticky.style.transform = '';
			elmSticky.parentNode.removeChild(elmPh);
			isFloating = false;
		}
		isEnabled = flag;
	}

	function onResize() {
		setEnabled(canEnabled());
		if (!isEnabled) return;

		const h = elmSticky.clientHeight + 'px';
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
		let offset = elmStickyView.offsetTop;
		if (elmStickyView === elmSticky) offset -= elmSticky.offsetTop;

		if (offset < window.pageYOffset) {
			elmSticky.style.transform = 'translateY(-' + offset + 'px)';
		} else {
			elmSticky.style.transform = '';
		}
	}


	// Common ------------------------------------------------------------------

	function canEnabled() {
		const FIXED_MIN_WINDOW_WIDTH = 600;  // for-tablet-up
		const WINDOW_HEIGHT_RATE = 0.3;

		const fmww = (typeof STOOL_FIXED_MIN_WINDOW_WIDTH !== 'undefined') ? STOOL_FIXED_MIN_WINDOW_WIDTH : FIXED_MIN_WINDOW_WIDTH;
		if (window.innerWidth < fmww) return false;
		const h = elmStickyView.clientHeight;
		return (h < window.innerHeight * WINDOW_HEIGHT_RATE);
	}


	// Utilities ---------------------------------------------------------------

	function wrapFunction(fn, delay) {
		let st;
		return function() {
			if (st) clearTimeout(st);
			st = setTimeout(function () {
				fn();
				st = null;
			}, delay);
		};
	}

	function doBeforePrint(func, forceMediaCheck = true) {
		window.addEventListener('beforeprint', func, false);
		if (forceMediaCheck || !('onbeforeprint' in window)) {
			let printMedia;
			if (window.matchMedia && (printMedia = matchMedia('print')) && printMedia.addListener) {
				printMedia.addListener(function () {if (printMedia.matches) func();});
			}
		}
	}


	let supportsPassive = false;
	try {
		const opts = Object.defineProperty({}, 'passive', {
			get: function() { supportsPassive = true; }
		});
		window.addEventListener('test', null, opts);
	} catch (e) {}

	function addEventListenerWithOptions(target, type, handler, options) {
		let optionsOrCapture = options;
		if (!supportsPassive) {
			optionsOrCapture = options.capture;
		}
		target.addEventListener(type, handler, optionsOrCapture);
	}

});
