/**
 *
 * Fix Edge
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2018-10-09
 *
 */


document.addEventListener('DOMContentLoaded', function () {

	if (ST.BROWSER === 'edge') {
		// Fix the image option bug which occurs when the window does not have scroll bar
		const wpwrap = document.getElementById('wpwrap');
		if (wpwrap) wpwrap.style.minHeight = '101%';
	}

});
