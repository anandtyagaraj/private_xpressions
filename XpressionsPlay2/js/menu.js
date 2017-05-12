function showMenu() {

	
	
	if (document.getElementById('menu').style.visibility == 'visible') {
		document.getElementById('menu').style.visibility = 'hidden';	
		
	} else {
		document.getElementById('menu').style.visibility = 'visible';


		setTimeout(function() {
			window.requestAnimationFrame(closeMenu());
		}, 20000);
	}

}

function closeMenu() {

	if (document.getElementById('menu').style.visibility == 'visible') {
		document.getElementById('menu').style.visibility = 'hidden';
	}

	clearTimeout(function() {
		window.requestAnimationFrame(closeMenu());
	});
}
