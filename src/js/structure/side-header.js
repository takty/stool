/**
 *
 * Side Header (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-01-12
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	const CLS_STICKY_ELM     = 'st-sticky-header';
	const CLS_STICKY_ELM_TOP = 'st-sticky-header-top';

	const DESKTOP_WIDTH_MIN = 1200;

	const CLS_ENTRY      = 'st-side-header-entry';
	const CLS_ENTRY_HEAD = 'st-side-header-entry-header';
	const CLS_ENTRY_CONT = 'st-side-header-entry-content';

	const getSiteHeaderOffset = makeOffsetFunction(CLS_STICKY_ELM, CLS_STICKY_ELM_TOP);
	const tars = collectElements();

	let isEnabled = false;
	let wpabH = 0;
	let shH   = 0;

	window.addEventListener('resize', onResize);
	onResize();
	function scrollAF() {
		onScroll();
		rafId = window.requestAnimationFrame(scrollAF);
	}
	let rafId = 0;


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
		const viewY = pageYOffset + siteHeaderH;
		const tarB = tar.entry.getBoundingClientRect();
		// const entryY = elementTopOnWindow(tar.entry), entryY2 = entryY + tar.entry.clientHeight;
		const entryY = tarB.top + pageYOffset, entryY2 = entryY + tar.entry.clientHeight;
		const headH = tar.header.clientHeight;

		if (entryY < viewY) {
			if (headH < entryY2 - viewY) return 'fixed';
			return 'bottom';
		}
		return 'top';
	}


	// Utilities ---------------------------------------------------------------

	function makeOffsetFunction(fixedElementClass, fixedHeightClass) {
		let elmFixed = document.getElementsByClassName(fixedElementClass);
		if (elmFixed && elmFixed.length > 0) {
			elmFixed = elmFixed[0];
			let elmHeight = document.getElementsByClassName(fixedHeightClass);
			if (elmHeight) elmHeight = elmHeight[0];
			else elmHeight = elmFixed;

			return function () {
				const pos = getComputedStyle(elmFixed).position;
				return pos === 'fixed' ? elmHeight.clientHeight : 0;
			};
		}
		return function () { return 0; }
	}

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

	function getWpAdminBarHeight() {
		const wpab = document.getElementById('wpadminbar');
		return wpab ? wpab.clientHeight : 0;
	}

	function elementTopOnWindow(elm) {
		let top = 0;
		while (elm) {
			top += elm.offsetTop + getTranslateY(elm);
			elm = elm.offsetParent;
		}
		return top;
	}

	function getTranslateY(elm) {
		if (!elm.style) return 0;
		const ss = elm.style.transform.split(')');
		ss.pop();
		for (let i = 0; i < ss.length; i += 1) {
			const vs = ss[i].split('(');
			const fun = vs[0].trim();
			const args = vs[1];
			switch (fun) {
			case 'translate':
				const xy = args.split(',');
				return parseFloat(xy[1] || '0');
			case 'translateY':
				return parseFloat(args);
			}
		}
		return 0;
	}

});
