/*global window, document, tizen, console, setTimeout */
/*jslint plusplus: true*/

var canvas, timeformatelement, changecolorelement, context, clockRadiusX, clockRadiusY, battery, timeformat, colorIndex = 1, colorSec = "#28ABE1", colorCanvasIndex = 1, colorCanvas = "#000000";

window.requestAnimationFrame = window.requestAnimationFrame
		|| window.webkitRequestAnimationFrame
		|| window.mozRequestAnimationFrame || window.oRequestAnimationFrame
		|| window.msRequestAnimationFrame || function(callback) {
			'use strict';
			window.setTimeout(callback, 1000 / 60);
		};

function renderDots() {
	'use strict';

	var dx = 0, dy = 0, i = 1, angle = null, angle1 = null, angle2 = null;
	var dx1 = 0, dy1 = 0, dx2 = 0, dy2 = 0, dx3 = 0, dy3 = 0;

	context.save();

	// Assigns the clock creation location in the middle of the canvas
	context.translate(canvas.width / 2, canvas.height / 2);

	// Assign the style of the number which will be applied to the clock plate
	// context.beginPath();
	//
	// if (colorCanvasIndex == 2) {
	// context.fillStyle = '#000000';
	// } else {
	// context.fillStyle = '#D6D7D6';
	// }
	//
	// // Create 12 dots in a circle
	// for (i = 1; i <= 12; i++) {
	// angle = (i - 3) * (Math.PI * 2) / 12;
	// angle1 = (i + 0.02 - 3) * (Math.PI * 2) / 12;
	// angle2 = (i - 0.02 - 3) * (Math.PI * 2) / 12;
	//
	// dx = clockRadiusX * 0.9 * Math.cos(angle);
	// dy = clockRadiusY * 0.9 * Math.sin(angle);
	//
	// dx1 = clockRadiusX * 1.00 * Math.cos(angle);
	// dy1 = clockRadiusY * 1.00 * Math.sin(angle);
	//
	// dx2 = clockRadiusX * 1.03 * Math.cos(angle1);
	// dy2 = clockRadiusY * 1.03 * Math.sin(angle1);
	//
	// dx3 = clockRadiusX * 1.03 * Math.cos(angle2);
	// dy3 = clockRadiusY * 1.03 * Math.sin(angle2);
	//
	// // context.arc(dx, dy, 3, 0, 2 * Math.PI, false);
	// if (i === 12 || i === 6 || i === 9 || i === 3) {
	// context.textAlign = 'center';
	// context.textBaseline = 'middle';
	// context.font = '25px serif';
	// } else {
	// context.font = '10px serif';
	// context.textAlign = 'center';
	// context.textBaseline = 'middle';
	// }
	// if (i === 12 || i === 9 || i === 6 || i === 3) {
	// context.fillText(i, dx, dy);
	// } else {
	// // context.fillText(".", dx, dy);
	//
	// context.beginPath();
	// context.font = '400 15px/2 sans-serif';
	// context.strokeStyle = colorSec;// "#30CE7A";
	// context.fillText(i, dx, dy);
	// context.lineWidth = 1;
	// context.lineJoin = "round";
	// context.moveTo(dx1, dy1);
	// context.lineTo(dx2, dy2);
	// context.lineTo(dx3, dy3);
	// context.lineTo(dx1, dy1);
	//
	// context.stroke();
	//
	// }
	// context.fill();
	// }
	// context.closePath();

	// Render center dot
	// context.beginPath();
	//
	// context.fillStyle = '#FFFFFF';
	// context.strokeStyle = '#FFFFFF';
	// context.lineWidth = 1;
	//
	// context.arc(0, 0, 7, 0, 2 * Math.PI, false);
	// context.fill();
	// context.stroke();
	// context.closePath();
	//
	// // Render MinutesDot
	// context.beginPath();
	//
	// context.fillStyle = colorSec;
	// context.strokeStyle = colorSec;
	// context.lineWidth = 1;
	//
	// context.arc(0, 0, 4, 0, 2 * Math.PI, false);
	// context.fill();
	// context.stroke();
	// context.closePath();

	// brand
	context.beginPath();

	context.fillStyle = '#AAAAAA';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '15px italic monospace';

	context.fillText("Xpressions", 0, -canvas.height * 4 / 10);

	context.fill();
	context.closePath();

}

function renderNeedle(angle, radius, needletype) {
	'use strict';
	context.save();
	context.rotate(angle);
	context.beginPath();
	if (needletype === "hour") {
		context.lineWidth = 3;

		if (colorCanvasIndex == 2) {
			context.fillStyle = '#131213';
			context.strokeStyle = '#000000';
		} else {
			context.fillStyle = '#D6D7D6';
			context.strokeStyle = '#FFFFFF';// '#68D6F2';
		}

		context.lineJoin = 'round';

		context.moveTo(6, 0);
		context.lineTo(6, 0);

		context.lineTo((radius * 0.65), 2);

		context.lineTo(radius * 0.75, 0);

		context.lineTo((radius * 0.65), -2);
		context.fill();

	} else if (needletype === "minute") {
		context.lineWidth = 2;

		if (colorCanvasIndex == 2) {
			context.fillStyle = '#131213';
			context.strokeStyle = '#333333';
		} else {
			context.fillStyle = "#888888";
			context.strokeStyle = '#999999';
		}

		context.lineJoin = 'round';

		context.moveTo(6, 0);
		context.lineTo(6, 0);

		context.lineTo((radius * 0.80), 2);

		context.lineTo(radius * 0.90, 0);

		context.lineTo((radius * 0.80), -2);
		context.fill();
	} else if (needletype === "second") {
		context.lineWidth = 6;
		context.strokeStyle = colorSec;// '#28ABE1';
		context.moveTo(-10, 0);
		context.lineTo(0, 0);

		context.lineWidth = 2;
		context.moveTo(0, 0);
		context.lineTo(0, 0);
		context.lineTo(radius, 0);

		// context.moveTo(radius - 3, -2);
		// context.lineTo(radius, 0);
		// context.lineTo(radius - 3, 2);

		context.moveTo(radius - 3, -10);
		context.lineTo(radius, 0);
		context.lineTo(radius + 3, -10);

		// context.arc(0, 0, radius, 1.5 * Math.PI, angle, false);

	}

	context.closePath();
	context.stroke();
	context.closePath();
	context.restore();

}

function renderHourNeedle(hour) {
	'use strict';

	var angle = null, radius = null;

	angle = (hour - 3) * (Math.PI * 2) / 12;
	radius = clockRadiusX * 0.80;
	renderNeedle(angle, radius, "hour");
}

function renderMinuteNeedle(minute) {
	'use strict';

	var angle = null, radius = null;

	angle = (minute - 15) * (Math.PI * 2) / 60;
	radius = clockRadiusX * 0.85;
	renderNeedle(angle, radius, "minute");
}

function renderSecondNeedle(milliseconds) {
	'use strict';
	var angle = null, radius = null, outerradius = null, dx1, dy1, dx2, dy2;

	angle = (milliseconds - 15000) * (Math.PI * 2) / 60000.0;

	// dx1 = 60 * Math.cos(angle);
	// dy1 = 80 * Math.sin(angle);
	//	
	// dx2 = 180 * Math.cos(angle);
	// dy2 = 240 * Math.sin(angle);
	//	

	// radius = Math.sqrt((dy2 - dy1) * (dy2 - dy1) + (dx2 - dx1) * (dx2 -
	// dx1));
	radius = clockRadiusX * 0.80;

	outerradius = clockRadiusX * 0.82;
	renderNeedle(angle, radius, "second");

	// Render seconds circle

	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = colorSec;// #28ABE1';
	context.lineWidth = 2;

	// context.arc(0, 0, radius, 1.5 * Math.PI, angle, false);
	context.arc(0, 0, radius, 1.5 * Math.PI, angle, false);

	context.stroke();

	context.closePath();

	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = '#333333';
	context.lineWidth = 1;

	context.arc(0, 0, outerradius, 0, Math.PI * 2, false);
	context.stroke();

	context.closePath();

}

function renderBattery(battery) {
	'use strict';

	var angle = null, radius = null, outerradius = null;

	angle = (battery.level - 0.25) * (Math.PI * 2) / 1.0;

	radius = clockRadiusX * 0.15;
	outerradius = clockRadiusX * 0.15;

	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = '#333333';
	context.lineWidth = 2;

	context.arc(canvas.width * 6 / 10, canvas.height * 9 / 10, outerradius, 0,
			Math.PI * 2, false);
	context.stroke();

	context.closePath();

	context.beginPath();
	context.fillStyle = '#131213';
	if (battery.level * 100 > 40) {
		context.strokeStyle = '#999999';
	} else if (battery.level * 100 > 10) {
		context.strokeStyle = '#FF9000';
	} else {
		context.strokeStyle = '#FF1000';
	}

	context.lineWidth = 2;

	context.arc(canvas.width * 6 / 10, canvas.height * 9 / 10, radius,
			1.5 * Math.PI, angle, false);
	context.stroke();

	context.closePath();

	context.beginPath();
	context.font = '18px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#FFFFFF';

	context.fillText(Math.floor(battery.level * 100) + '%',
			canvas.width * 6 / 10, canvas.height * 9 / 10);

	context.closePath();

	context.beginPath();
	context.fillStyle = '#999C9B';
	context.strokeStyle = '#999C9B';
	context.lineWidth = 4;

	context.fillRect(canvas.width * 6 / 10 - 5, canvas.height * 9 / 10 + 10,
			10, 10);// canvas.width/2, canvas.height * 3 / 4

	context.moveTo(canvas.width * 6 / 10 - 10, canvas.height * 9 / 10 + 15);
	context.lineTo(canvas.width * 6 / 10, canvas.height * 9 / 10 + 15);
	context.lineTo(canvas.width * 6 / 10 + 10, canvas.height * 9 / 10 + 15);
	context.stroke();

	context.closePath();

	context.restore();
}

function changeHourFormat() {

	if (timeformat === "0") {
		timeformat = "1";// 24 hr
	} else if (timeformat === "1") {
		timeformat = "0";// 12 hr
	}

}

// function changeColor(e) {
// colorIndex = colorIndex + 1;
//
// if (colorIndex > 10)
// colorIndex = 1;
//
// if (colorIndex === 1) {
// colorSec = "#28ABE1";
// } else if (colorIndex === 2) {
// colorSec = "#43DA8A";
// } else if (colorIndex === 3) {
// colorSec = "#FFC107";
// } else if (colorIndex === 4) {
// colorSec = "#99CC00";
// } else if (colorIndex === 5) {
// colorSec = "#CC67F3";
// } else if (colorIndex === 6) {
// colorSec = "#D31A00";
// } else if (colorIndex === 7) {
// colorSec = "#C3C3C3";
// } else if (colorIndex === 8) {
// colorSec = "#E9E067";
// } else if (colorIndex === 9) {
// colorSec = "#F26520";
// } else if (colorIndex === 10) {
// colorSec = "#B97A57";
// }
//
// }

function changeCanvasColor() {

	colorCanvasIndex = colorCanvasIndex + 1;

	if (colorCanvasIndex > 3)
		colorCanvasIndex = 1;

	if (colorCanvasIndex == 1) {
		colorCanvas = '#13688C';
	} else if (colorCanvasIndex == 2) {
		colorCanvas = '#FFFFFF';
	} else if (colorCanvasIndex == 3) {
		colorCanvas = '#000000';
	}

	context.fillStyle = colorCanvas;
	context.fillRect(0, 0, canvas.width, canvas.height);
}

function renderDigitalTime(hour, minute, day, dateOfMonth, month, seconds) {
	'use strict';

	context.save();

	// Assigns the clock creation location in the middle of the canvas
	context.translate(-canvas.width / 2, -canvas.height / 2);
	context.beginPath();

	var ampm = "AM", sDay = "Test", sMonth = "", outerradius, twentyfourhourangle, twentyfourhourradius, twentyfourhour, twentyfourminute, secondsangle, hourl1, hourl2, hourr1, hourr2, minl1, minl2, minr1, minr2, secl1, secl2, secl3, secr1, secr2, secr3;
	secondsangle = (seconds - 15) * (Math.PI * 2) / 60;
	twentyfourhour = hour;
	twentyfourminute = minute;

	// Hour Start
	hourl1 = hour - 1;
	hourl2 = hour - 2;
	hourr1 = hour + 1;
	hourr2 = hour + 2;

	if (hourl1 < 0)
		hourl1 += 24;
	if (hourl2 < 0)
		hourl2 += 24;

	if (hourr1 > 23)
		hourr1 -= 24;
	if (hourr2 > 23)
		hourr2 -= 24;

	if (timeformat === "0") {
		if (hour > 11) {
			ampm = "PM";
			if (hour > 12) {
				hour = hour - 12;

			}
			if (hourl1 > 12) {
				hourl1 = hourl1 - 12;

			}
			if (hourl2 > 12) {
				hourl2 = hourl2 - 12;

			}
			if (hourr1 > 12) {
				hourr1 = hourr1 - 12;

			}
			if (hourr2 > 12) {
				hourr2 = hourr2 - 12;

			}

		}

		if (hour === 0) {
			hour = 12;
		}
		if (hourl1 === 0) {
			hourl1 = 12;
		}
		if (hourl2 === 0) {
			hourl2 = 12;
		}
		if (hourr1 === 0) {
			hourr1 = 12;
		}
		if (hourr2 === 0) {
			hourr2 = 12;
		}
	}

	if (hour < 10) {
		hour = "0" + hour;
	}

	if (hourl1 < 10) {
		hourl1 = "0" + hourl1;
	}
	if (hourl2 < 10) {
		hourl2 = "0" + hourl2;
	}
	if (hourr1 < 10) {
		hourr1 = "0" + hourr1;
	}
	if (hourr2 < 10) {
		hourr2 = "0" + hourr2;
	}

	// Hour End

	// Sec Start
	secl1 = seconds - 1;
	secl2 = seconds - 2;
	secl3 = seconds - 3;
	secr1 = seconds + 1;
	secr2 = seconds + 2;
	secr3 = seconds + 3;

	if (secl1 < 0)
		secl1 += 60;
	if (secl2 < 0)
		secl2 += 60;
	if (secl3 < 0)
		secl3 += 60;

	if (secr1 > 59)
		secr1 -= 60;
	if (secr2 > 59)
		secr2 -= 60;
	if (secr3 > 59)
		secr3 -= 60;

	if (secl1 < 10)
		secl1 = "0" + secl1;
	if (secl2 < 10)
		secl2 = "0" + secl2;
	if (secl3 < 10)
		secl3 = "0" + secl3;
	if (secr1 < 10)
		secr1 = "0" + secr1;
	if (secr2 < 10)
		secr2 = "0" + secr2;
	if (secr3 < 10)
		secr3 = "0" + secr3;
	// Sec End

	// Min Start
	minl1 = minute - 1;
	minl2 = minute - 2;
	minr1 = minute + 1;
	minr2 = minute + 2;

	if (minl1 < 0)
		minl1 += 60;
	if (minl2 < 0)
		minl2 += 60;

	if (minr1 > 59)
		minr1 -= 60;
	if (minr2 > 59)
		minr2 -= 60;

	if (minl1 < 10)
		minl1 = "0" + minl1;
	if (minl2 < 10)
		minl2 = "0" + minl2;
	if (minr1 < 10)
		minr1 = "0" + minr1;
	if (minr2 < 10)
		minr2 = "0" + minr2;
	// Min End

	if (minute < 10) {
		minute = "0" + minute;
	}

	context.font = '35px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';

	if (colorCanvasIndex == 2) {
		context.fillStyle = '#131213';
	} else {
		context.fillStyle = '#FFFFFF';
	}

	if (seconds < 10)
		seconds = "0" + seconds;

	// context.fillText(hour + ":" + minute + ":" + seconds + " " + ampm, 0,
	// -60);

	if (timeformat === "0") {// AM-PM
		// AM PM
		context.font = '15px monospace';
		context.fillStyle = colorSec;// '#71E1F9';

		context.fillText(ampm, canvas.width / 2, canvas.height * 2.7 / 10);

	}
	// HOUR
	context.font = '50px monospace';
	context.fillStyle = '#FFFFFF';// '#71E1F9';
	context.fillText(hour, canvas.width / 2, canvas.height * 4 / 10);

	context.font = '25px monospace';
	context.fillStyle = '#888888';// '#71E1F9';
	context.fillText(hourl1, canvas.width * 3 / 10, canvas.height * 4 / 10);

	context.font = '20px monospace';
	context.fillStyle = '#444444';// '#71E1F9';
	context.fillText(hourl2, canvas.width * 1 / 10, canvas.height * 4 / 10);

	context.font = '25px monospace';
	context.fillStyle = '#888888';// '#71E1F9';
	context.fillText(hourr1, canvas.width * 7 / 10, canvas.height * 4 / 10);

	context.font = '20px monospace';
	context.fillStyle = '#444444';// '#71E1F9';
	context.fillText(hourr2, canvas.width * 9 / 10, canvas.height * 4 / 10);

	// Minute
	context.font = '35px monospace';
	context.fillStyle = '#CCCCCC';// '#71E1F9';
	context.fillText(minute, canvas.width / 2, canvas.height * 5.5 / 10);

	context.font = '17px monospace';
	context.fillStyle = '#666666';// '#71E1F9';
	context.fillText(minl1, canvas.width * 3 / 10, canvas.height * 5.5 / 10);

	context.font = '14px monospace';
	context.fillStyle = '#333333';// '#71E1F9';
	context.fillText(minl2, canvas.width * 1 / 10, canvas.height * 5.5 / 10);

	context.font = '17px monospace';
	context.fillStyle = '#666666';// '#71E1F9';
	context.fillText(minr1, canvas.width * 7 / 10, canvas.height * 5.5 / 10);

	context.font = '14px monospace';
	context.fillStyle = '#333333';// '#71E1F9';
	context.fillText(minr2, canvas.width * 9 / 10, canvas.height * 5.5 / 10);

	// Second
	context.font = '25px monospace';
	context.fillStyle = colorSec;// '#71E1F9';
	context.fillText(seconds, canvas.width / 2, canvas.height * 7 / 10);

	context.fillStyle = '#666666';// '#71E1F9';
	context.font = '16px monospace';
	context.fillText(secl1, canvas.width * 3.6 / 10, canvas.height * 7 / 10);

	context.fillStyle = '#444444';// '#71E1F9';
	context.font = '12px monospace';
	context.fillText(secl2, canvas.width * 2.3 / 10, canvas.height * 7 / 10);

	context.font = '12px monospace';
	context.fillText(secl3, canvas.width * 1 / 10, canvas.height * 7 / 10);

	context.fillStyle = '#666666';// '#71E1F9';
	context.font = '16px monospace';
	context.fillText(secr1, canvas.width * 6.3 / 10, canvas.height * 7 / 10);

	context.fillStyle = '#444444';// '#71E1F9';
	context.font = '12px monospace';
	context.fillText(secr2, canvas.width * 7.6 / 10, canvas.height * 7 / 10);

	context.font = '12px monospace';
	context.fillText(secr3, canvas.width * 9 / 10, canvas.height * 7 / 10);

	/*
	 * } else { context.font = '50px monospace'; context.fillStyle =
	 * '#FFFFFF';// '#71E1F9'; context.fillText(hour, canvas.width / 2,
	 * canvas.height * 4 / 10);
	 * 
	 * context.font = '35px monospace'; context.fillStyle = '#CCCCCC';//
	 * '#71E1F9'; context.fillText(minute, canvas.width / 2, canvas.height * 5.5 /
	 * 10);
	 * 
	 * context.font = '25px monospace'; context.fillStyle = colorSec;//
	 * '#71E1F9'; context.fillText(seconds, canvas.width / 2, canvas.height * 7 /
	 * 10); }
	 */

	// Draw Band
	/*
	 * context.beginPath(); context.fillStyle = colorSec; context.strokeStyle =
	 * '#111111'; context.lineWidth = 2;
	 * 
	 * outerradius = clockRadiusX * 2; context.arc(canvas.width / 2, 0,
	 * outerradius, 0, Math.PI * 2, false); context.stroke();
	 * 
	 * context.closePath();
	 */
	context.beginPath();
	context.lineWidth = 1;
	context.lineJoin = "round";
	context.strokeStyle = colorSec;
	context.moveTo(canvas.width * 2 / 10, canvas.height * 8 / 10);
	context.lineTo(canvas.width * 8 / 10, canvas.height * 8 / 10);
	context.stroke();
	context.closePath();

	// Draw Band End

	// context.lineJoin = "bevel";
	// context.lineWidth = 2;
	// context.strokeStyle = "#333333";
	// context.beginPath();
	// context.lineJoin = "round";
	// context.moveTo(canvas.width * 2 / 10, canvas.height * 5.8 / 10);
	// context.lineTo(canvas.width * 8 / 10, canvas.height * 5.8 / 10);
	// context.stroke();
	context.font = '20px serif';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#30CE7A';

	try {
		if (day === 0) {
			sDay = LANG_JSON_DATA["Sunday"];
		} else if (day === 1) {
			sDay = LANG_JSON_DATA["Monday"];
		} else if (day === 2) {
			sDay = LANG_JSON_DATA["Tuesday"];
		} else if (day === 3) {
			sDay = LANG_JSON_DATA["Wednesday"];
		} else if (day === 4) {
			sDay = LANG_JSON_DATA["Thursday"];
		} else if (day === 5) {
			sDay = LANG_JSON_DATA["Friday"];
		} else if (day === 6) {
			sDay = LANG_JSON_DATA["Saturday"];
		}
	} catch (Exception) {
		if (day === 0) {
			sDay = "Sunday";
		} else if (day === 1) {
			sDay = "Monday";
		} else if (day === 2) {
			sDay = "Tuesday";
		} else if (day === 3) {
			sDay = "Wednesday";
		} else if (day === 4) {
			sDay = "Thursday";
		} else if (day === 5) {
			sDay = "Friday";
		} else if (day === 6) {
			sDay = "Saturday";
		}
	}

	if (month === 0) {
		sMonth = "01";
	} else if (month === 1) {
		sMonth = "02";
	} else if (month === 2) {
		sMonth = "03";
	} else if (month === 3) {
		sMonth = "04";
	} else if (month === 4) {
		sMonth = "05";
	} else if (month === 5) {
		sMonth = "06";
	} else if (month === 6) {
		sMonth = "07";
	} else if (month === 7) {
		sMonth = "08";
	} else if (month === 8) {
		sMonth = "09";
	} else if (month === 9) {
		sMonth = "10";
	} else if (month === 10) {
		sMonth = "11";
	} else if (month === 11) {
		sMonth = "12";
	}

	// topDateText = sDay + ", " + sMonth + " " + dateOfMonth;
	// context.fillText(topDateText, 0, -110);

	context.closePath();

	outerradius = clockRadiusX * 0.26;

	// Render circle

	// context.beginPath();
	// context.fillStyle = colorSec;
	// context.strokeStyle = '#333333';
	// context.lineWidth = 2;
	//
	// // context.arc(canvas.width / 2, canvas.height * 7 / 10, outerradius,
	// // Math.PI * 0.35, Math.PI * 0.65, false);
	// context.arc(canvas.width * 7.5 / 10, canvas.height * 8.5 / 10,
	// outerradius,
	// 0, Math.PI * 2, false);
	// context.stroke();
	// context.fill();
	//
	// context.closePath();

	// context.beginPath();
	//
	// context.fillStyle = '#333333';
	// // context.arc(canvas.width / 2, canvas.height * 7 / 10, outerradius,
	// // Math.PI * 0.65, Math.PI * 0.35, false);
	//
	// outerradius = clockRadiusX * 0.25;
	// context.arc(canvas.width * 7.5 / 10, canvas.height * 8.5 / 10,
	// outerradius,
	// 0, Math.PI * 2, false);
	//
	// context.stroke();
	// context.fill();
	//
	// context.closePath();

	context.beginPath();
	context.font = '25px italic monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	if (colorCanvasIndex == 2) {
		context.fillStyle = '#000000';
	} else {
		context.fillStyle = '#D6D7D6';
	}

	context.fillText(sDay, canvas.width * 2 / 10, canvas.height * 9 / 10);
	context.closePath();

	// context.beginPath();
	// context.font = '30px monospace';
	// context.textAlign = 'center';
	// context.textBaseline = 'middle';
	// context.fillStyle = '#FFFFFF';
	//	
	// context.fillText(dateOfMonth, 77, 0);
	// context.closePath();

	context.beginPath();
	context.font = '22px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#EEEEEE';

	context.fillText(sMonth + "/" + dateOfMonth, canvas.width * 8 / 10,
			canvas.height * 9 / 10);
	context.closePath();

	// 24 Hour Format

	// context.beginPath();
	// context.fillStyle = '#131213';
	// context.strokeStyle = '#333333';
	// context.lineWidth = 2;
	// outerradius = clockRadiusX * 0.15;
	// context.arc(0, 70, outerradius, 0, Math.PI * 2, false);
	// context.stroke();
	//
	// context.closePath();
	//	
	// context.beginPath();
	// context.fillStyle = '#131213';
	// context.strokeStyle = '#28ABE1';
	// context.lineWidth = 2;
	// outerradius = clockRadiusX * 0.15;
	// context.arc(0, 70, outerradius, 1.5 * Math.PI, secondsangle, false);
	// context.stroke();
	//
	// context.closePath();
	//
	// context.beginPath();
	// context.font = '20px monospace';
	// context.textAlign = 'center';
	// context.textBaseline = 'middle';
	// context.fillStyle = '#FFFFFF';
	//
	// context.fillText(seconds, 0, 70);
	// context.closePath();

	// context.beginPath();
	//
	// var dx = 0, dy = 0, i = 1, angle = null;
	// context.fillStyle = '#D6D7D6';
	// // Create 12 dots in a circle
	// for (i = 1; i <= 12; i++) {
	// angle = (i - 3) * (Math.PI * 2) / 12;
	// dx = clockRadiusX * 0.23 * Math.cos(angle);
	// dy = clockRadiusX * 0.23 * Math.sin(angle) + 70;
	//
	// // context.arc(dx, dy, 3, 0, 2 * Math.PI, false);
	// if (i === 12 || i === 6 || i === 9 || i === 3) {
	// context.textAlign = 'center';
	// context.textBaseline = 'middle';
	// context.font = '12px serif';
	// } else {
	// context.font = '12px serif';
	// context.textAlign = 'center';
	// context.textBaseline = 'middle';
	// }
	// if (i === 12 || i === 9 || i === 6 || i === 3) {
	// context.fillText(i * 2, dx, dy);
	// } else {
	// context.fillText(".", dx, dy);
	//
	// }
	// context.fill();
	// }
	//
	// context.closePath();
	// twentyfourhourangle = (((twentyfourhour + (twentyfourminute / 60)) / 24)
	// - 0.25)
	// * (Math.PI * 2);
	// twentyfourhourradius = clockRadiusX * 0.3;
	//
	// context.beginPath();
	// context.fillStyle = '#131213';
	// context.strokeStyle = '#333333';
	// context.lineWidth = 2;
	//
	// context.arc(0, 70, twentyfourhourradius, 0, Math.PI * 2, false);
	//
	// context.stroke();
	//
	// context.closePath();
	//
	// context.beginPath();
	// context.fillStyle = '#131213';
	// context.strokeStyle = '#71E1F9';
	// context.lineWidth = 2;
	//
	// context.arc(0, 70, twentyfourhourradius, 1.5 * Math.PI,
	// twentyfourhourangle, false);
	//
	// context.stroke();
	//
	// context.closePath();

	context.restore();

}

function getDate() {
	'use strict';

	var date;
	try {
		date = tizen.time.getCurrentDateTime();
	} catch (err) {
		console.error('Error: ', err.message);
		date = new Date();
	}

	return date;
}

function successCallback(_battery) {

	battery = _battery;
	renderBattery(_battery);
}

function errorCallback(error) {
	/* Log the device battery level to the console */
	console.log("ERROR is " + error);

	context.beginPath();
	context.font = '20px serif';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#FF0000';
	context.fillText("Error: " + error, 100, 210);

	context.closePath();
	context.restore();
}

function renderTheme() {

	'use strict';

	var outerradius = clockRadiusX * 0.15;

	context.save();
	context.translate(-canvas.width / 2, -canvas.height / 2);
	context.beginPath();
	if (colorCanvasIndex == 2) {
		context.fillStyle = '#939293';
	} else {
		context.fillStyle = '#131213';
	}

	// context.strokeStyle = '#333333';
	context.lineWidth = 2;

	context.arc(canvas.width * 3 / 10, canvas.height * 5 / 10, outerradius, 0,
			Math.PI * 2, false);
	// context.stroke();
	context.fill();

	context.closePath();

	outerradius = clockRadiusX * 0.10;
	context.beginPath();
	context.fillStyle = '#535253';
	context.strokeStyle = '#333333';
	context.lineWidth = 2;

	context.arc(canvas.width * 3 / 10, canvas.height * 5 / 10, outerradius, 0,
			Math.PI * 2, false);
	context.stroke();
	context.fill();

	context.closePath();

	outerradius = clockRadiusX * 0.05;
	context.beginPath();
	if (colorCanvasIndex == 2) {
		context.fillStyle = '#131213';
	} else {
		context.fillStyle = '#939293';
	}
	context.strokeStyle = '#333333';
	context.lineWidth = 2;

	context.arc(canvas.width * 3 / 10, canvas.height * 5 / 10, outerradius, 0,
			Math.PI * 2, false);
	context.stroke();
	context.fill();

	context.closePath();

	context.restore();
}

function watch() {
	'use strict';

	// Import the current time
	// noinspection JSUnusedAssignment
	var date = getDate(), hours = date.getHours(), minutes = date.getMinutes(), seconds = date
			.getSeconds(), hour = hours + minutes / 60, minute = minutes
			+ seconds / 60, milliseconds = seconds * 1000
			+ date.getMilliseconds(), day = tizen.time.getCurrentDateTime()
			.getDay(), dateOfMonth = tizen.time.getCurrentDateTime().getDate(), month = tizen.time
			.getCurrentDateTime().getMonth(), nextMove = 100;

	// var battery = tizen.systeminfo.
	// Erase the previous time
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);

	context.save();

	// Assigns the clock creation location in the middle of the canvas
	// context.translate(canvas.width / 2, canvas.height / 2);

	context.fillStyle = colorCanvas;
	context.fillRect(0, 0, canvas.width, canvas.height);

	renderBattery(battery);
	renderDots();

	renderDigitalTime(hours, minutes, day, dateOfMonth, month, seconds);

	// renderTheme();

	// renderMinuteNeedle(minute);
	// renderHourNeedle(hour);

	// renderSecondNeedle(milliseconds);

	context.restore();

	setTimeout(function() {
		window.requestAnimationFrame(watch);
	}, nextMove);

}

function getBattery() {
	var date = getDate(), nextMove = 30000;// updates every 1min
	tizen.systeminfo
			.getPropertyValue("BATTERY", successCallback, errorCallback);

	setTimeout(function() {
		window.requestAnimationFrame(getBattery);
		// console.log('Battery Update: ', "Battery Update");

	}, nextMove);
}

window.onload = function() {
	'use strict';

	canvas = document.querySelector('canvas');
	context = canvas.getContext('2d');
	clockRadiusX = document.width / 2;
	clockRadiusY = document.height / 2;

	// Assigns the area that will use Canvas
	canvas.width = document.width;
	canvas.height = document.height;// canvas.width;

	timeformatelement = document.getElementById("imgtimeformat");

	console.log("Time Format Element is " + timeformatelement);
	if (timeformatelement != null) {
		timeformatelement.addEventListener("click", function(e) {
			if (timeformat === "0") {
				timeformat = "1";// 24 hr
			} else if (timeformat === "1") {
				timeformat = "0";// 12 hr
			}
		}, true);
	} else {
		// alert('NULL');
	}

	changecolorelement = document.getElementById("imgchangecolor");
	if (changecolorelement != null) {
		changecolorelement.addEventListener("click", function(e) {
			colorIndex = colorIndex + 1;

			if (colorIndex > 10)
				colorIndex = 1;

			if (colorIndex === 1) {
				colorSec = "#28ABE1";
			} else if (colorIndex === 2) {
				colorSec = "#43DA8A";
			} else if (colorIndex === 3) {
				colorSec = "#FFC107";
			} else if (colorIndex === 4) {
				colorSec = "#99CC00";
			} else if (colorIndex === 5) {
				colorSec = "#CC67F3";
			} else if (colorIndex === 6) {
				colorSec = "#D31A00";
			} else if (colorIndex === 7) {
				colorSec = "#C3C3C3";
			} else if (colorIndex === 8) {
				colorSec = "#E9E067";
			} else if (colorIndex === 9) {
				colorSec = "#F26520";
			} else if (colorIndex === 10) {
				colorSec = "#B97A57";
			}
		}, true);
	}

	timeformat = "0";// 12Hr
	// try {
	// canvas.addEventListener('click', function(e) {
	//
	// try {
	//
	// var x = e.x;
	// var y = e.y;
	//
	// var yMin = canvas.height * 2.7 / 10;
	// var yMax = canvas.height * 4.3 / 10;
	//
	// // var xCanvasMin = canvas.width * 1.5 / 10;
	// // var xCanvasMax = canvas.width * 4.5 / 10;
	// //
	// // var yCanvasMin = canvas.height * 3.5 / 10;
	// // var yCanvasMax = canvas.height * 6.5 / 10;
	// //
	// // if (x >= xCanvasMin && x <= xCanvasMax && y >= yCanvasMin
	// // && y <= yCanvasMax) {
	// // changeCanvasColor();
	// // }
	//
	// if (y >= yMin && y <= yMax) {
	// if (timeformat === "0") {
	// timeformat = "1";// 24 hr
	// } else if (timeformat === "1") {
	// timeformat = "0";// 12 hr
	// }
	// }
	// } catch (err) {
	// console.log('Error: ', err.message);
	// }
	//
	// });
	// } catch (err) {
	// }
	// add eventListener for tizenhwkey
	window.addEventListener('tizenhwkey', function(e) {
		if (e.keyName === 'back') {
			try {
				tizen.application.getCurrentApplication().exit();

			} catch (err) {
				console.error('Error: ', err.message);
			}
		}
	});

	getBattery();

	window.requestAnimationFrame(watch);

};
