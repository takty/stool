/**
 *
 * Sticky Header - scroll (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-07-12
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

	window.ST.onBeforePrint(function () { setEnabled(false); });

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
		if (!flag) {
			if (isFloating) turnOffFloating();
			isFloating = false;
		}
		isEnabled = flag;
	}

	function onResize() {
		setEnabled(canEnabled());
		if (!isEnabled) return;

		const h = elmSticky.offsetHeight + 'px';
		elmPh.style.minHeight = h;
		elmPh.style.maxHeight = h;
		onScroll();
	}

	function onScroll() {
		if (!isEnabled) return;
		const top = isFloating ? elmPh.getBoundingClientRect().top : elmSticky.getBoundingClientRect().top;
		const offset = elmStickyView.offsetTop;

		if (top + offset < window.ST.getWpAdminBarHeight()) {
			if (!isFloating) turnOnFloating();

			// Recalc here!
			const height = elmSticky.offsetHeight;
			const offset = (elmStickyView === elmSticky) ? 0 : elmStickyView.offsetTop;
			adjustFloating(offset, height);
		} else {
			if (isFloating) turnOffFloating();
		}
	}

	function turnOnFloating() {
		elmSticky.classList.add(CLS_STATE_STICKY);
		elmSticky.classList.add(CLS_STATE_FLOATING);
		elmSticky.parentNode.insertBefore(elmPh, elmSticky);
		isFloating = true;
	}

	function adjustFloating(offset, height) {
		elmSticky.style.top = (-height + window.ST.getWpAdminBarHeight()) + 'px';
		elmSticky.style.transform = 'translateY(' + (height - offset) + 'px)';
	}

	function turnOffFloating() {
		elmSticky.classList.remove(CLS_STATE_STICKY);
		elmSticky.classList.remove(CLS_STATE_FLOATING);
		elmSticky.parentNode.removeChild(elmPh);
		elmSticky.style.top = '';
		elmSticky.style.transform = '';
		isFloating = false;
	}


	// Common ------------------------------------------------------------------


	function canEnabled() {
		const FIXED_MIN_WINDOW_WIDTH = 600;  // for-tablet-up
		const WINDOW_HEIGHT_RATE = 0.2;

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

});
