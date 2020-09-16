/**
 *
 * Sticky Header - fixed (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2020-09-16
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	const CLS_STICKY_ELM          = 'st-sticky-header';
	const CLS_STICKY_ELM_DISABLED = 'st-sticky-header-disabled';
	const CLS_STICKY_ELM_TOP      = 'st-sticky-header-top';

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
		if (elmSticky.classList.contains(CLS_STICKY_ELM_DISABLED) && flag) elmSticky.classList.remove(CLS_STICKY_ELM_DISABLED);
		else if (!elmSticky.classList.contains(CLS_STICKY_ELM_DISABLED) && !flag) elmSticky.classList.add(CLS_STICKY_ELM_DISABLED);

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
			elmSticky.style.top = null;
			elmSticky.parentNode.removeChild(elmPh);
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

		if (window.pageYOffset === 0) {
			if (isFloating) elmSticky.classList.remove(CLS_STATE_FLOATING);
			isFloating = false;
		} else {
			if (!isFloating) elmSticky.classList.add(CLS_STATE_FLOATING);
			isFloating = true;
		}
		let offset = elmStickyView.offsetTop;
		if (elmStickyView === elmSticky) offset = 0;
		offset += window.pageYOffset + elmPh.getBoundingClientRect().top - window.ST.getWpAdminBarHeight();

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
		const FIXED_MAX_WINDOW_HEIGHT_RATE = 0.2;

		const fmww = (window.STOOL_FIXED_MIN_WINDOW_WIDTH !== undefined) ? window.STOOL_FIXED_MIN_WINDOW_WIDTH : FIXED_MIN_WINDOW_WIDTH;
		if (window.innerWidth < fmww) return false;
		const fmwhr = (window.STOOL_FIXED_MAX_WINDOW_HEIGHT_RATE !== undefined) ? window.STOOL_FIXED_MAX_WINDOW_HEIGHT_RATE : FIXED_MAX_WINDOW_HEIGHT_RATE;
		if (window.innerHeight * fmwhr < elmStickyView.clientHeight) return false;

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
		return true;
	}

});
