/*global window, document, tizen, console, setTimeout */
/*jslint plusplus: true*/

var canvas, context, clockRadiusX, clockRadiusY, battery, timeformat, colorIndex = 1, colorSec = "#28ABE1",savedColorSelectionKey = "ColorSelectionKey";

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
	context.beginPath();

	context.fillStyle = colorSec;// '#009AC9';

	// Create 12 dots in a circle
	for (i = 1; i <= 12; i++) {
		angle = (i - 3) * (Math.PI * 2) / 12;
		angle1 = (i + 0.02 - 3) * (Math.PI * 2) / 12;
		angle2 = (i - 0.02 - 3) * (Math.PI * 2) / 12;

		dx = clockRadiusX * 0.9 * Math.cos(angle);
		dy = clockRadiusY * 0.9 * Math.sin(angle);

		dx1 = clockRadiusX * 1.00 * Math.cos(angle);
		dy1 = clockRadiusY * 1.00 * Math.sin(angle);

		dx2 = clockRadiusX * 1.03 * Math.cos(angle1);
		dy2 = clockRadiusY * 1.03 * Math.sin(angle1);

		dx3 = clockRadiusX * 1.03 * Math.cos(angle2);
		dy3 = clockRadiusY * 1.03 * Math.sin(angle2);

		// context.arc(dx, dy, 3, 0, 2 * Math.PI, false);
		if (i === 12 || i === 6 || i === 9 || i === 3) {
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.font = '25px serif';
		} else {
			context.font = '10px serif';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
		}
		if (i === 12 || i === 9 || i === 6 || i === 3) {
			context.fillText(i, dx, dy);
		} else {
			// context.fillText(".", dx, dy);

			context.beginPath();
			context.font = '400 15px sans-serif';
			context.strokeStyle = colorSec;// "#30CE7A";
			context.fillText(i, dx, dy);
			context.lineWidth = 1;
			context.lineJoin = "round";
			context.moveTo(dx1, dy1);
			context.lineTo(dx2, dy2);
			context.lineTo(dx3, dy3);
			context.lineTo(dx1, dy1);

			context.stroke();

		}
		context.fill();
	}
	context.closePath();

	// // Render center dot
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
	// context.fillStyle = '#28ABE1';
	// context.strokeStyle = '#28ABE1';
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

	context.fillText("Xpressions", 0, -canvas.height / 2 + 70);

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
		context.fillStyle = '#D6D7D6';
		context.strokeStyle = colorSec;// '#68D6F2';
		context.lineJoin = 'round';
		context.moveTo((radius - radius * 0.15), -2);
		context.lineTo((radius - radius * 0.15), 2);

		context.lineTo((radius - radius * 0.1), 4);

		context.lineTo(radius, 4);
		context.lineTo(radius + 10, 0);
		context.lineTo(radius, -4);

		context.lineTo((radius - radius * 0.1), -4);
		context.fill();

	} else if (needletype === "minute") {
		context.lineWidth = 2;
		context.fillStyle = "#999C9B";
		context.strokeStyle = '#FFFFFF';
		context.lineJoin = 'round';
		context.moveTo((radius - radius * 0.15), -2);
		context.lineTo((radius - radius * 0.15), 2);

		context.lineTo((radius - radius * 0.1), 4);

		context.lineTo(radius, 4);
		context.lineTo(radius + 10, 0);
		context.lineTo(radius, -4);

		context.lineTo((radius - radius * 0.1), -4);
		context.fill();
	} else if (needletype === "second") {
		context.lineWidth = 6;
		context.strokeStyle = colorSec;// '#28ABE1';
		// context.moveTo(-10, 0);
		// context.lineTo(0, 0);
		//
		// context.lineWidth = 2;
		// context.moveTo(0, 0);
		// context.lineTo(0, 0);
		// context.lineTo(radius, 0);

		context.moveTo(radius, -10);
		context.lineTo(radius, 0);

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
	try {
		var angle = null, radius = null, outerradius = null;

		angle = (battery.level - 0.25) * (Math.PI * 2) / 1.0;

		radius = clockRadiusX * 0.20;
		outerradius = clockRadiusX * 0.20;

		context.beginPath();
		context.fillStyle = '#131213';
		context.strokeStyle = '#333333';
		context.lineWidth = 2;

		context.arc(canvas.width * 4 / 10, canvas.height * 7 / 10, outerradius,
				0, Math.PI * 2, false);
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

		context.arc(canvas.width * 4 / 10, canvas.height * 7 / 10, radius,
				1.5 * Math.PI, angle, false);
		context.stroke();

		context.closePath();

		context.beginPath();
		context.font = '22px monospace';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = '#FFFFFF';

		context.fillText(Math.floor(battery.level * 100) + '%',
				canvas.width * 4 / 10, canvas.height * 7 / 10);

		context.closePath();

		context.beginPath();
		context.fillStyle = '#999C9B';
		context.strokeStyle = '#999C9B';
		context.lineWidth = 4;

		context.fillRect(canvas.width * 4 / 10 - 5,
				canvas.height * 7 / 10 + 10, 10, 10);// canvas.width/2,
														// canvas.height * 3 / 4

		context.moveTo(canvas.width * 4 / 10 - 10, canvas.height * 7 / 10 + 15);
		context.lineTo(canvas.width * 4 / 10, canvas.height * 7 / 10 + 15);
		context.lineTo(canvas.width * 4 / 10 + 10, canvas.height * 7 / 10 + 15);
		context.stroke();

		context.closePath();

		context.restore();
	} catch (error) {
		console.error(error);
	}
}

function changeColor() {
	colorIndex = colorIndex + 1;

	if (colorIndex > 9)
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
	}
	saveColorStorage(colorSec);
}

function renderDigitalTime(hour, minute, day, dateOfMonth, month, seconds) {
	'use strict';

	context.save();

	// Assigns the clock creation location in the middle of the canvas
	context.translate(-canvas.width / 2, -canvas.height / 2);
	context.beginPath();

	if (minute < 10) {
		minute = "0" + minute;
	}

	var ampm = "AM", sDay = "Test", sMonth = "", outerradius, twentyfourhourangle, twentyfourhourradius, twentyfourhour, twentyfourminute, secondsangle;
	secondsangle = (seconds - 15) * (Math.PI * 2) / 60;
	twentyfourhour = hour;
	twentyfourminute = minute;
	if (timeformat === "0") {
		if (hour > 11) {
			ampm = "PM";
			if (hour > 12) {
				hour = hour - 12;
			}

		}

		if (hour === 0) {
			hour = 12;
		}
	}

	if (hour < 10) {
		hour = "0" + hour;
	}

	context.lineJoin = "bevel";
	context.lineWidth = 2;
	context.strokeStyle = "#333333";
	context.beginPath();
	context.lineJoin = "round";
	context.moveTo(canvas.width * 2 / 10, canvas.height * 4.2 / 10);
	context.lineTo(canvas.width * 8 / 10, canvas.height * 4.2 / 10);
	context.stroke();

	context.font = '35px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#FFFFFF';

	// context.fillText(ampm, -20, 60);

	// context.font = '30px monospace';
	// context.textAlign = 'center';
	// context.textBaseline = 'middle';
	// context.fillStyle = '#30CE7A';

	if (seconds < 10)
		seconds = "0" + seconds;

	// context.fillText(hour + ":" + minute + ":" + seconds + " " + ampm, 0,
	// -60);

	if (timeformat === "0") {
		context.fillText(hour + ":" + minute, canvas.width / 2,
				canvas.height / 2);
		context.font = '20px monospace';
		context.fillStyle = colorSec;// '#71E1F9';
		context.fillText(seconds, canvas.width * 6.9 / 10,
				canvas.height * 5.1 / 10);

		context.font = '15px monospace';
		context.fillText(ampm, canvas.width * 2.7 / 10,
				canvas.height * 4.7 / 10);
	} else {
		context.fillText(hour + ":" + minute, canvas.width / 2,
				canvas.height / 2);
		context.font = '22px monospace';
		context.fillStyle = colorSec;
		'#71E1F9';
		context.fillText(seconds, canvas.width * 6.9 / 10,
				canvas.height * 5.1 / 10);
	}

	context.lineJoin = "bevel";
	context.lineWidth = 2;
	context.strokeStyle = "#333333";
	context.beginPath();
	context.lineJoin = "round";
	context.moveTo(canvas.width * 2 / 10, canvas.height * 5.8 / 10);
	context.lineTo(canvas.width * 8 / 10, canvas.height * 5.8 / 10);
	context.stroke();

	context.font = '20px serif';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#30CE7A';

	try {
		if (day === 0) {
			sDay = LANG_JSON_DAY_SHORT_DATA["Sunday"];
		} else if (day === 1) {
			sDay = LANG_JSON_DAY_SHORT_DATA["Monday"];
		} else if (day === 2) {
			sDay = LANG_JSON_DAY_SHORT_DATA["Tuesday"];
		} else if (day === 3) {
			sDay = LANG_JSON_DAY_SHORT_DATA["Wednesday"];
		} else if (day === 4) {
			sDay = LANG_JSON_DAY_SHORT_DATA["Thursday"];
		} else if (day === 5) {
			sDay = LANG_JSON_DAY_SHORT_DATA["Friday"];
		} else if (day === 6) {
			sDay = LANG_JSON_DAY_SHORT_DATA["Saturday"];
		}
	} catch (Exception) {

		console.log("Anand" + Exception);
		if (day === 0) {
			sDay = "Sun";
		} else if (day === 1) {
			sDay = "Mon";
		} else if (day === 2) {
			sDay = "Tue";
		} else if (day === 3) {
			sDay = "Wed";
		} else if (day === 4) {
			sDay = "Thu";
		} else if (day === 5) {
			sDay = "Fri";
		} else if (day === 6) {
			sDay = "Sat";
		}
	}

	try {
		if (month === 0) {
			sMonth = LANG_JSON_MONTH_SHORT_DATA["1"];
		} else if (month === 1) {
			sMonth = LANG_JSON_MONTH_SHORT_DATA["2"];
		} else if (month === 2) {
			sMonth = LANG_JSON_MONTH_SHORT_DATA["3"];
		} else if (month === 3) {
			sMonth = LANG_JSON_MONTH_SHORT_DATA["4"];
		} else if (month === 4) {
			sMonth = LANG_JSON_MONTH_SHORT_DATA["5"];
		} else if (month === 5) {
			sMonth = LANG_JSON_MONTH_SHORT_DATA["6"];
		} else if (month === 6) {
			sMonth = LANG_JSON_MONTH_SHORT_DATA["7"];
		} else if (month === 7) {
			sMonth = LANG_JSON_MONTH_SHORT_DATA["8"];
		} else if (month === 8) {
			sMonth = LANG_JSON_MONTH_SHORT_DATA["9"];
		} else if (month === 9) {
			sMonth = LANG_JSON_MONTH_SHORT_DATA["10"];
		} else if (month === 10) {
			sMonth = LANG_JSON_MONTH_SHORT_DATA["11"];
		} else if (month === 11) {
			sMonth = LANG_JSON_MONTH_SHORT_DATA["12"];
		}
	} catch (Exception) {
		if (month === 0) {
			sMonth = "Jan";
		} else if (month === 1) {
			sMonth = "Feb";
		} else if (month === 2) {
			sMonth = "Mar";
		} else if (month === 3) {
			sMonth = "Apr";
		} else if (month === 4) {
			sMonth = "May";
		} else if (month === 5) {
			sMonth = "June";
		} else if (month === 6) {
			sMonth = "July";
		} else if (month === 7) {
			sMonth = "Aug";
		} else if (month === 8) {
			sMonth = "Sept";
		} else if (month === 9) {
			sMonth = "Oct";
		} else if (month === 10) {
			sMonth = "Nov";
		} else if (month === 11) {
			sMonth = "Dec";
		}
	}
	// topDateText = sDay + ", " + sMonth + " " + dateOfMonth;
	// context.fillText(topDateText, 0, -110);

	context.closePath();

	outerradius = clockRadiusX * 0.25;

	// Render seconds circle

	// context.beginPath();
	// context.fillStyle = '#131213';
	// context.strokeStyle = '#666666';
	// context.lineWidth = 2;
	//
	// context.arc(77, 0, outerradius, 0, Math.PI * 2, false);
	// context.stroke();
	//
	// context.closePath();

	context.beginPath();
	context.font = '25px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#D6D7D6';

	context.fillText(sDay, canvas.width / 2, canvas.height * 3 / 10);
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
	context.fillStyle = colorSec;

	context.fillText(sMonth + " " + dateOfMonth, canvas.width / 2,
			canvas.height * 3.7 / 10);
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

function watch() {
	'use strict';

	// Import the current time
	// noinspection JSUnusedAssignment
	var date = getDate(), hours = date.getHours(), minutes = date.getMinutes(), seconds = date
			.getSeconds(), hour = hours + minutes / 60, minute = minutes
			+ seconds / 60, milliseconds = seconds * 1000
			+ date.getMilliseconds(), day = tizen.time.getCurrentDateTime()
			.getDay(), dateOfMonth = tizen.time.getCurrentDateTime().getDate(), month = tizen.time
			.getCurrentDateTime().getMonth(), nextMove = 1000;

	// var battery = tizen.systeminfo.
	// Erase the previous time
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);

	context.save();

	// Assigns the clock creation location in the middle of the canvas
	// context.translate(canvas.width / 2, canvas.height / 2);

	renderBattery(battery);

	renderDots();

	renderDigitalTime(hours, minutes, day, dateOfMonth, month, seconds);

	renderSecondNeedle(milliseconds);
	renderHourNeedle(hour);
	renderMinuteNeedle(minute);

	context.restore();

	setTimeout(function() {
		window.requestAnimationFrame(watch);
	}, nextMove);

}

function getBattery() {
	var date = getDate(), nextMove = 30000;
	tizen.systeminfo
			.getPropertyValue("BATTERY", successCallback, errorCallback);

	setTimeout(function() {
		window.requestAnimationFrame(getBattery);
	}, nextMove);
}

function handleTimeClick(){
	if (timeformat === "0") {
		timeformat = "1";// 24 hr
	} else if (timeformat === "1") {
		timeformat = "0";// 12 hr
	}
}

function saveColorStorage(data) {
	var key = savedColorSelectionKey;
	// var data = data;

	// localStorage setItem
	if ("localStorage" in window) {
		localStorage.setItem(key, data);
		// location.reload();
	} else {
		console.error("no localStorage in window");
	}

	// sessionStorage setItem
	// if ("sessionStorage" in window) {
	// sessionStorage.setItem(key.value, data.value);
	// location.reload();
	// } else {
	// alert("no sessionStorage in window");
	// }
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

	timeformat = "0";// 12Hr
//	try {
//		canvas.addEventListener('click', function(e) {
//
//			try {
//
//				var y = e.y;
//
//				var yMin = canvas.height * 4.2 / 10;
//				var yMax = canvas.height * 5.8 / 10;
//
//				if (y >= yMin && y <= yMax) {
//					if (timeformat === "0") {
//						timeformat = "1";// 24 hr
//					} else if (timeformat === "1") {
//						timeformat = "0";// 12 hr
//					}
//				}
//			} catch (err) {
//				console.log('Error: ', err.message);
//			}
//
//		});
//	} catch (err) {
//	}
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
	
	try {
		var colorValue = localStorage.getItem(savedColorSelectionKey);
		if (colorValue != null) {
			colorSec = colorValue;
			console.log("Color saved is:" + colorSec);
		} else {
			console.log("Color NOT saved");
		}
	}
	catch(error){
		console.error(error);
	}

	getBattery();

	window.requestAnimationFrame(watch);

};
