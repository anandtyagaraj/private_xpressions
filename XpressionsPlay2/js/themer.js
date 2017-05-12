function renderShowAdvanced() {

	// context.beginPath();
	// context.fillStyle = '#111111';
	// context.strokeStyle = '#222222';
	// context.arc(canvas.width * 3 / 10, canvas.height * 7.5 / 10,
	// clockRadiusX * 0.2, 0, Math.PI * 2, false);
	// context.stroke();
	// context.fill();
	// context.closePath();
	//
	// context.beginPath();
	// context.fillStyle = '#111111';
	// context.strokeStyle = '#222222';
	// context.arc(canvas.width * 7 / 10, canvas.height * 7.5 / 10,
	// clockRadiusX * 0.2, 0, Math.PI * 2, false);
	// context.stroke();
	// context.fill();
	// context.closePath();

}

function showBrand() {

	context.beginPath();

	context.fillStyle = "#BBBBBB";
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	// context.font = '15px italic monospace';
	context.font = "italic bold 15px monospace";

	context
			.fillText("Xpressions", (canvas.width * 0.2),
					(canvas.height * 0.35));

	context.fill();
	context.closePath();
}

function changeTheme() {
	theme = theme + 1;

	if (theme > 4)
		theme = 0;
	
	watch();
}

function changeColor() {
	colorIndex = colorIndex + 1;

	if (colorIndex > 16)
		colorIndex = 1;

	if (colorIndex === 1) {
		colorSec = "#2A2222";
	} else if (colorIndex === 2) {
		colorSec = "#2E1F2D";
	} else if (colorIndex === 3) {
		colorSec = "#22242A";
	} else if (colorIndex === 4) {
		colorSec = "#201F2E";
	} else if (colorIndex === 5) {
		colorSec = "#2A222A";
	} else if (colorIndex === 6) {
		colorSec = "#2A2222";
	} else if (colorIndex === 7) {
		colorSec = "#1F242E";
	} else if (colorIndex === 8) {
		colorSec = "#2E1F1F";
	} else if (colorIndex === 9) {
		colorSec = "#ce5a57";
	} else if (colorIndex === 10) {
		colorSec = "#666666";
	}
	else if (colorIndex === 11) {
		colorSec = "#28ABE1";
	}
	else if (colorIndex === 12) {
		colorSec = "#43DA8A";
	}
	else if (colorIndex === 13) {
		colorSec = "#FFC107";
	}
	else if (colorIndex === 14) {
		colorSec = "#99CC00";
	}
	else if (colorIndex === 15) {
		colorSec = "#CC67F3";
	}
	else if (colorIndex === 16) {
		colorSec = "#D31A00";
	}
	//
	saveColorStorage(colorSec);
	watch();
}

function changeBGImage() {
	try {
		bgIndex = bgIndex + 1;

		if (bgIndex === 9)
			bgIndex = 0;

		setBGImage();
		
		watch();
	} catch (e) {
		console.log("error: " + e);
	}
}

function setBGImage() {
	var colorBg = "#000000";
	if (bgIndex === 0) {
		colorBg = "#000000"
	} else if (bgIndex === 1) {
		colorBg = "#2A2222";
	} else if (bgIndex === 2) {
		colorBg = "#2E1F2D";
	} else if (bgIndex === 3) {
		colorBg = "#22242A";
	} else if (bgIndex === 4) {
		colorBg = "#201F2E";
	} else if (bgIndex === 5) {
		colorBg = "#2A222A";
	} else if (bgIndex === 6) {
		colorBg = "#2A2222";
	} else if (bgIndex === 7) {
		colorBg = "#1F242E";
	} else if (bgIndex === 8) {
		colorBg = "#2E1F1F";
	}

	// canvas.style.background = '-webkit-radial-gradient(' + colorBg + ' 30%,
	// black 70%)';
	canvas.style.background = colorBg;
	saveBGColorStorage(colorBg);
}

function changePlay() {
	playId = playId + 1;

	if (playId > 2)
		playId = 0;

//	if (playId < 1 || playId === 2) {
//		document.getElementById('imgWeatherIcon').style.visibility = 'hidden';
//		document.getElementById('imgHrHist').style.visibility = 'hidden';
//		document.getElementById("imgConnection").style.visibility = 'hidden';
//
//	} else if (playId === 1) {
//		document.getElementById('imgWeatherIcon').style.visibility = 'visible';
//		document.getElementById('imgHrHist').style.visibility = 'visible';
//		document.getElementById("imgConnection").style.visibility = 'visible';
//	}

//	showMenu();
//	showMenu();

	
	watch();
}

function toggleTimeFormat() {
	if (itimeformat < 1) {
		itimeformat = 1; // 24 hr
	} else {
		itimeformat = 0; // 12 hr
	}
	watch();
}

function toggleTimeFormatRemote(format) {	
		itimeformat = format; // 12 hr	
}

function handleTheme() {

	switch (theme) {
	case 0:
		showTheme1();
		break;
	case 1:
		showTheme2();
		break;
	case 2:
		showTheme3();
		break;
	case 3:
		showTheme4();
		break;
	case 4:
		showTheme5();
		break;
	}
}

function showTheme1() {
	context.beginPath();

	context.moveTo((canvas.width * 0.7), 0);
	context.lineTo((canvas.width * 0.7), canvas.height);
	context.lineWidth = canvas.width * 0.08;

	// set line color
	context.strokeStyle = colorSec;
	context.stroke();
	context.closePath();

	context.beginPath();

	context.moveTo((canvas.width * 0.85), 0);
	context.lineTo((canvas.width * 0.85), canvas.height);
	context.lineWidth = canvas.width * 0.03;

	// set line color
	context.strokeStyle = colorSec;
	context.stroke();
	context.closePath();
}

function showTheme2() {
	context.beginPath();

	context.moveTo((canvas.width * 0.5), 0);
	context.lineTo((canvas.width * 0.5), canvas.height);
	context.lineWidth = canvas.width * 0.2;

	// set line color
	context.strokeStyle = colorSec;
	context.stroke();
	context.closePath();

}

function showTheme3() {
	context.beginPath();

	context.moveTo((canvas.width * 0.3), 0);
	context.lineTo((canvas.width * 0.3), canvas.height);
	context.lineWidth = canvas.width * 0.1;

	// set line color
	context.strokeStyle = colorSec;
	context.stroke();
	context.closePath();

	context.beginPath();

	context.moveTo((canvas.width * 0.7), 0);
	context.lineTo((canvas.width * 0.7), canvas.height);
	context.lineWidth = canvas.width * 0.1;

	// set line color
	context.strokeStyle = colorSec;
	context.stroke();
	context.closePath();

}

function showTheme4() {
	context.beginPath();

	context.moveTo((canvas.width * 0.75), 0);
	context.lineTo((canvas.width * 0.75), canvas.height);
	context.lineWidth = canvas.width * 0.5;

	// set line color
	context.strokeStyle = colorSec;
	context.stroke();
	context.closePath();

}

function showTheme5() {
	// context.beginPath();
	//
	// context.moveTo((canvas.width * 0.75), 0);
	// context.lineTo((canvas.width * 0.75), canvas.height);
	// context.lineWidth = canvas.width * 0.5;
	//
	// // set line color
	// context.strokeStyle = colorSec;
	// context.stroke();
	// context.closePath();
	
}
