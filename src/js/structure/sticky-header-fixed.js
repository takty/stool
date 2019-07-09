/**
 *
 * Sticky Header - fixed (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-07-09
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	const CLS_STICKY_ELM     = 'st-sticky-header';
	const CLS_STICKY_ELM_TOP = 'st-sticky-header-top';
	const CLS_STATE_STICKY   = 'sticky';
	const CLS_STATE_FLOATING = 'floating';
	const CLS_STATE_OFFSET   = 'offset';

	const elmSticky     = document.getElementsByClassName(CLS_STICKY_ELM)[0];
	const elmStickyView = document.getElementsByClassName(CLS_STICKY_ELM_TOP)[0];
	if (!elmSticky || !elmStickyView) return;

	window.ST.onBeforePrint(() => { setEnabled(false); });

	const elmPh    = document.createElement('div');
	let isEnabled  = false;
	let isFloating = false;

	setEnabled(canEnabled());
	window.ST.onResize(onResize);
	onResize();
	window.ST.onScroll(onScroll);
	onScroll();

	function setEnabled(flag) {
		if (flag === isEnabled) return;
		if (flag) {
			elmSticky.classList.add(CLS_STATE_STICKY);
			elmSticky.parentNode.insertBefore(elmPh, elmSticky);

			const bcr = elmPh.getBoundingClientRect();
			elmSticky.style.top = (bcr.top + window.pageYOffset) + 'px';
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
		// eslint-disable-next-line no-multi-assign
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
			elmSticky.classList.add(CLS_STATE_OFFSET);
		} else {
			elmSticky.style.transform = '';
			elmSticky.classList.remove(CLS_STATE_OFFSET);
		}
	}


	// Common ------------------------------------------------------------------


	function canEnabled() {
		const FIXED_MIN_WINDOW_WIDTH = 600;  // for-tablet-up
		const WINDOW_HEIGHT_RATE = 0.3;

		const fmww = (window.STOOL_FIXED_MIN_WINDOW_WIDTH !== undefined) ? window.STOOL_FIXED_MIN_WINDOW_WIDTH : FIXED_MIN_WINDOW_WIDTH;
		if (window.innerWidth < fmww) return false;

		if (window.ST.BROWSER === 'safari') {
			const ua = window.navigator.userAgent.toLowerCase();
			const ts = ua.split(' ');
			for (let i = 0; i < ts.length; i += 1) {
				if (ts[i].indexOf('version') !== -1) {
					const ss = ts[i].split('/');
					if (1 < ss.length) {
						const v = parseInt(ss[1]);
						if (v <= 10) return false;
					}
				}
			}
		}
		const h = elmStickyView.clientHeight;
		return (h < window.innerHeight * WINDOW_HEIGHT_RATE);
	}


	// Utilities ---------------------------------------------------------------


	// let supportsPassive = false;
	// try {
	// 	const opts = Object.defineProperty({}, 'passive', {
	// 		get: function () { return supportsPassive = true; }
	// 	});
	// 	window.addEventListener('test', null, opts);
	// } catch (e) {
	// 	// do nothing
	// }

	// function addEventListenerWithOptions(target, type, handler, options) {
	// 	let optionsOrCapture = options;
	// 	if (!supportsPassive) {
	// 		optionsOrCapture = options.capture;
	// 	}
	// 	target.addEventListener(type, handler, optionsOrCapture);
	// }

});
