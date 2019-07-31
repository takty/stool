/**
 *
 * Priority Menu (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-07-31
 *
 */


document.addEventListener('DOMContentLoaded', () => {

	const pms = document.getElementsByClassName('priority-menu');

	for (let i = 0; i < pms.length; i += 1) {
		init(pms[i]);
	}

	function init(pm) {
		const btn = document.createElement('span');
		btn.classList.add('priority-menu-button');
		btn.addEventListener('click', () => { popup.classList.toggle('visible'); });
		btn.style.display = 'none';

		const popup = document.createElement('ul');
		popup.classList.add('priority-menu-popup');

		pm.appendChild(btn);
		pm.appendChild(popup);

		const m = pm.getElementsByTagName('ul')[0];
		let hm = 0;

		const mis = Array.prototype.slice.call(m.getElementsByTagName('li'));
		if (0 < mis.length) { hm = mis[0].clientHeight; }
		for (let i = 0; i < mis.length; i += 1) mis[i].style.visibility = 'hidden';

		const miws = [];
		for (let i = 0; i < mis.length; i += 1) {
			miws.push(mis[i].clientWidth);
		}
		for (let i = 0; i < mis.length; i += 1) mis[i].style.visibility = '';
		btn.style.minWidth = hm + 'px';
		btn.style.minHeight = hm + 'px';

		setTimeout(() => {
			onResize(m, hm, mis, miws, btn, popup);
			m.parentElement.style.overflowX = 'visible';
			m.style.justifyContent = 'flex-end';
		}, 10);
		window.addEventListener('resize', function () {
			setTimeout(() => { onResize(m, hm, mis, miws, btn, popup); }, 10);
		});
		setTimeout(() => { pm.style.opacity = 1; }, 100);
	}

	function onResize(menu, hm, items, ws, btn, popup) {
		let remain = menu.getBoundingClientRect().width - (hm + 8);
		let sep = items.length;

		for (let i = 0; i < ws.length; i += 1) {
			if ((remain -= ws[i]) < 0) {
				sep = i;
				break;
			}
		}
		for (let i = 0; i < sep; i += 1) {
			const p = items[i].parentElement;
			if (p !== menu) menu.appendChild(items[i]);
		}
		for (let i = sep; i < items.length; i += 1) {
			popup.appendChild(items[i]);
		}
		btn.style.display = (sep === items.length) ? 'none' : '';
	}

});
