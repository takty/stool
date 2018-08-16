/**
 *
 * Side Header (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-08-16
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	const CLS_STICKY_ELM     = 'st-sticky-header';
	const CLS_STICKY_ELM_TOP = 'st-sticky-header-top';

	const DESKTOP_WIDTH_MIN = 1200;

	const CLS_ENTRY      = 'st-side-header-entry';
	const CLS_ENTRY_HEAD = 'st-side-header-entry-header';
	const CLS_ENTRY_CONT = 'st-side-header-entry-content';

	const getSiteHeaderOffset = ST.makeOffsetFunction(CLS_STICKY_ELM, CLS_STICKY_ELM_TOP);
	const tars = collectElements();

	let wpabH = 0;
	let shH   = 0;
	let isEnabled = false;
	let isPrinting = false;

	window.addEventListener('resize', onResize);
	onResize();
	function scrollAF() {
		onScroll();
		rafId = window.requestAnimationFrame(scrollAF);
	}
	let rafId = 0;

	doBeforePrint(function () {
		isEnabled = false;
		isPrinting = true;
		for (let i = 0; i < tars.length; i += 1) turnOffFixed(tars[i]);
	});
	doAfterPrint(function () {
		isPrinting = false;
		onResize();
	});


	// -------------------------------------------------------------------------

	function collectElements() {
		const ret = [];
		const es = document.getElementsByClassName(CLS_ENTRY);

		for (let i = 0; i < es.length; i += 1) {
			const e = es[i];

			const eh = e.getElementsByClassName(CLS_ENTRY_HEAD)[0];
			const ec = e.getElementsByClassName(CLS_ENTRY_CONT)[0];
			if (!eh || !ec) continue;

			const d = document.createElement('div');
			d.classList.add('st-side-header-entry-header-spacer');

			ret.push({entry: e, header: eh, content: ec, dummy_header: d, cur_state: false});
		}
		return ret;
	}

	function onResize() {
		if (isPrinting) return;
		if (window.innerWidth < DESKTOP_WIDTH_MIN) {
			if (isEnabled) {
				window.cancelAnimationFrame(rafId);
				rafId = 0;
				isEnabled = false;
				for (let i = 0; i < tars.length; i += 1) turnOffFixed(tars[i]);
			}
		} else {
			if (!isEnabled) {
				setTimeout(function () {
					isEnabled = true;
					for (let i = 0; i < tars.length; i += 1) turnOnFixed(tars[i]);
				}, 0);
			}
			setTimeout(function () {
				for (let i = 0; i < tars.length; i += 1) updateFixed(tars[i]);
				wpabH = ST.getWpAdminBarHeight();
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
		if (tar.dummy_header.parentNode === tar.entry) {
			tar.entry.removeChild(tar.dummy_header);
		}
		tar.entry.insertBefore(tar.header, tar.content);
		tar.header.style.maxWidth = '';
	}

	function updateFixed(tar) {
		const w = tar.dummy_header.clientWidth;
		if (0 < w) {
			tar.header.style.maxWidth = w + 'px';
			const hs = getComputedStyle(tar.header);
			const hh = tar.header.clientHeight + parseInt(hs.marginTop) + parseInt(hs.marginBottom);
			tar.dummy_header.style.minHeight = hh + 'px';
		} else {
			setTimeout(function () {updateFixed(tar);}, 10);
		}
	}

	function onScroll() {
		if (isPrinting) return;
		if (window.innerWidth < DESKTOP_WIDTH_MIN) return;  // This is needed!

		const pageYOffset = window.pageYOffset;

		for (let i = 0; i < tars.length; i += 1) {
			const tar = tars[i];
			const newState = getState(tar, pageYOffset, shH);
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
		const viewY = pageYOffset + siteHeaderH + wpabH;
		const tarB = tar.entry.getBoundingClientRect();
		const entryY = tarB.top + pageYOffset, entryY2 = entryY + tar.entry.clientHeight;
		const headH = tar.header.clientHeight;

		if (entryY < viewY) {
			if (headH < entryY2 - viewY) return 'fixed';
			return 'bottom';
		}
		return 'top';
	}


	// Utilities ---------------------------------------------------------------

	function doBeforePrint(func, forceMediaCheck = true) {
		window.addEventListener('beforeprint', func, false);
		if (forceMediaCheck || !('onbeforeprint' in window)) {
			if (window.matchMedia) {
				let mediaQueryList = window.matchMedia('print');
				mediaQueryList.addListener(function (mql) {
					if (mql.matches) func();
				});
			}
		}
	}

	function doAfterPrint(func, forceMediaCheck = true) {
		window.addEventListener('afterprint', func, false);
		if (forceMediaCheck || !('onafterprint' in window)) {
			if (window.matchMedia) {
				let mediaQueryList = window.matchMedia('screen');
				mediaQueryList.addListener(function (mql) {
					if (mql.matches) func();
				});
			}
		}
	}

});
