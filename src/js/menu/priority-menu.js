/**
 *
 * Priority Menu (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-08-26
 *
 */


document.addEventListener('DOMContentLoaded', () => {

	const CLS_TARGET      = 'stool-priority-menu';
	const CLS_BUTTON      = 'stool-priority-menu-button';
	const CLS_POPUP       = 'stool-priority-menu-popup';
	const CLS_STATE_READY = 'ready';
	const CLS_STATE_OPEN  = 'open';

	const pms = document.getElementsByClassName(CLS_TARGET);
	for (let i = 0; i < pms.length; i += 1) initialize(pms[i]);


	// -------------------------------------------------------------------------


	function initialize(pm) {
		const popup = document.createElement('ul');
		popup.classList.add(CLS_POPUP);

		const btn = document.createElement('span');
		btn.classList.add(CLS_BUTTON);
		btn.addEventListener('click', () => {
			btn.classList.toggle(CLS_STATE_OPEN);
			popup.classList.toggle(CLS_STATE_OPEN);
		});
		btn.style.display = 'none';

		pm.appendChild(btn);
		pm.appendChild(popup);

		const menu = pm.getElementsByTagName('ul')[0];
		const mis = [].slice.call(menu.getElementsByTagName('li'));

		for (let i = 0; i < mis.length; i += 1) {
			const as = mis[i].getElementsByTagName('a');
			if (as.length === 0) continue;
			as[0].addEventListener('click', () => {
				btn.classList.remove(CLS_STATE_OPEN);
				popup.classList.remove(CLS_STATE_OPEN);
			});
		}
		let btnSize = 0;
		if (0 < mis.length) { btnSize = mis[0].clientHeight; }
		btn.style.minWidth  = btnSize + 'px';

		let ws;
		setTimeout(() => {
			ws = mis.map((e) => e.offsetWidth);
			onResize(menu, btnSize, mis, ws, btn, popup);
		}, 10);
		window.ST.onResize(() => { onResize(menu, btnSize, mis, ws, btn, popup); });
		setTimeout(() => { pm.classList.add(CLS_STATE_READY); }, 100);
	}

	function onResize(menu, btnSize, mis, ws, btn, popup) {
		let remain = menu.parentElement.getBoundingClientRect().width;
		let sep = mis.length;

		let sum = 0;
		for (let i = 0; i < ws.length; i += 1) sum += ws[i];

		if (remain < sum) {
			remain -= (btnSize + 8);
			for (let i = 0; i < ws.length; i += 1) {
				if ((remain -= ws[i]) < 0) {
					sep = i;
					break;
				}
			}
		}
		for (let i = 0; i < sep; i += 1) {
			const p = mis[i].parentElement;
			if (p === menu) ws[i] = mis[i].offsetWidth;
			else menu.appendChild(mis[i]);
		}
		for (let i = sep; i < mis.length; i += 1) popup.appendChild(mis[i]);
		btn.style.display = (sep === mis.length) ? 'none' : '';
	}

});
