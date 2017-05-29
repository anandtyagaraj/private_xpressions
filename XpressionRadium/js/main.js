/*global window, document, tizen, console, setTimeout */
/*jslint plusplus: true*/

var canvas, context, clockRadiusX, clockRadiusY, battery, timeformat;

window.requestAnimationFrame = window.requestAnimationFrame
		|| window.webkitRequestAnimationFrame
		|| window.mozRequestAnimationFrame || window.oRequestAnimationFrame
		|| window.msRequestAnimationFrame || function(callback) {
			'use strict';
			window.setTimeout(callback, 1000 / 60);
		};

function renderDots() {
	'use strict';

	var dx = 0, dy = 0, i = 1, angle = null, dx1 = 0, dy1 = 0;

	context.save();

	// Assigns the clock creation location in the middle of the canvas
	context.translate(canvas.width / 2, canvas.height / 2);

	// Assign the style of the number which will be applied to the clock plate

	// context.fillStyle = '#D6D7D6';

	// Create 12 dots in a circle
	for (i = 1; i <= 24; i++) {
		context.beginPath();
		angle = (i - 6) * (Math.PI * 2) / 24;

		dx = clockRadiusX * 0.95 * Math.cos(angle);
		dy = clockRadiusY * 0.95 * Math.sin(angle);

		dx1 = clockRadiusX * 1.00 * Math.cos(angle);
		dy1 = clockRadiusY * 1.00 * Math.sin(angle);

		// context.arc(dx, dy, 3, 0, 2 * Math.PI, false);
		if (i % 2 === 0) {
			context.strokeStyle = "#43DA8A";

		} else {
			context.strokeStyle = "#0D3E24";
		}

		context.font = '400 15px/2 sans-serif';

		context.lineWidth = 3;
		context.lineJoin = "round";
		context.moveTo(dx, dy);
		context.lineTo(dx1, dy1);

		context.stroke();
		context.closePath();
	}

	// brand
	context.beginPath();

	context.fillStyle = '#AAAAAA';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '15px italic monospace';

	context.fillText("Xpressions", 0, -canvas.height / 2 + 60);

	context.fill();
	context.closePath();

}

function renderHourNeedle(hour) {
	'use strict';

	var angle = null, radius = null, outerradius = null;

	angle = (hour - 3) * (Math.PI * 2) / 12;
	radius = clockRadiusX * 0.9;
	outerradius = clockRadiusX * 0.90;

	// Render Hour circle
	//
	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = '#0D3E24';
	context.lineWidth = 4;

	context.arc(0, 0, outerradius, 0, Math.PI * 2, false);
	context.stroke();

	context.closePath();

	//
	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = '#43DA8A';// #28ABE1';
	context.lineWidth = 4;

	context.arc(0, 0, radius, 1.5 * Math.PI, angle, false);
	context.stroke();

	context.closePath();

}

function renderMinuteNeedle(minute) {
	'use strict';

	var angle = null, radius = null, outerradius = null;

	angle = (minute - 15) * (Math.PI * 2) / 60;
	radius = clockRadiusX * 0.83;
	// renderNeedle(angle, radius, "minute");

	outerradius = clockRadiusX * 0.83;
	// renderNeedle(angle, radius, "hour");

	// Render Hour circle
	//
	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = '#0E4E4E';
	context.lineWidth = 4;

	context.arc(0, 0, outerradius, 0, Math.PI * 2, false);
	context.stroke();

	context.closePath();

	//
	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = '#36DAD9';// #28ABE1';
	context.lineWidth = 4;

	context.arc(0, 0, radius, 1.5 * Math.PI, angle, false);
	context.stroke();

	context.closePath();

}

function renderSecondNeedle(milliseconds) {
	'use strict';
	var angle = null, radius = null, outerradius = null, dx = 0, dy = 0, dx1 = 0, dy1 = 0, i = 1, secondsangle = null;

	angle = (milliseconds - 15000) * (Math.PI * 2) / 60000.0;
	radius = clockRadiusX * 0.76;
	outerradius = clockRadiusX * 0.76;
	// renderNeedle(angle, radius, "second");

	// Render seconds circle

	//
	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = '#405500';
	context.lineWidth = 4;

	context.arc(0, 0, outerradius, 0, Math.PI * 2, false);
	context.stroke();

	context.closePath();

	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = '#99CC00';// #28ABE1';
	context.lineWidth = 4;

	context.arc(0, 0, radius, 1.5 * Math.PI, angle, false);
	context.stroke();

	context.closePath();

	for (i = 1; i <= 60; i++) {
		context.beginPath();
		secondsangle = (i - 15) * (Math.PI * 2) / 60;

		dx = clockRadiusX * 0.70 * Math.cos(secondsangle);
		dy = clockRadiusX * 0.70 * Math.sin(secondsangle);

		dx1 = clockRadiusX * 0.72 * Math.cos(secondsangle);
		dy1 = clockRadiusX * 0.72 * Math.sin(secondsangle);

		if (i % 5 === 0) {
			context.strokeStyle = "#99CC00";
		} else {

			context.strokeStyle = "#405500";

		}
		//
		context.font = '400 15px/2 sans-serif';
		//
		context.lineWidth = 2;
		context.lineJoin = "round";
		context.moveTo(dx, dy);
		context.lineTo(dx1, dy1);
		//
		context.stroke();
		context.closePath();
	}

}

function renderBattery(battery) {
	'use strict';
	try {
		var outerradius = null, angle = null;

		outerradius = clockRadiusX * 0.15;

		context.beginPath();

		context.fillStyle = '#333333';
		context.strokeStyle = '#333333';

		context.lineWidth = 2;

		context.arc(0, -40, outerradius, Math.PI, 2 * Math.PI, false);
		context.fill();
		context.stroke();

		context.closePath();

		context.beginPath();

		if (battery.level * 100 > 40) {
			context.strokeStyle = '#30CE7A';
		} else if (battery.level * 100 > 10) {
			context.strokeStyle = '#FF9000';
		} else {
			context.strokeStyle = '#FF1000';
		}
		context.lineWidth = 4;

		angle = Math.PI + ((Math.PI * 2 - Math.PI) * battery.level);
		context.arc(0, -40, outerradius, Math.PI, angle, false);

		context.stroke();
		context.closePath();

		context.beginPath();
		context.font = '15px monospace';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = '#FFFFFF';

		context.fillText(Math.floor(battery.level * 100) + '%', 0, -50);
		context.closePath();

		// context.beginPath();
		// context.font = '12px monospace';
		// context.textAlign = 'center';
		// context.textBaseline = 'middle';
		// context.fillStyle = '#FFFFFF';
		//
		// context.fillText('Battery', 0, -33);
		// context.closePath();

		context.beginPath();
		context.fillStyle = '#30CE7A';
		context.strokeStyle = '#30CE7A';
		context.lineWidth = 4;

		context.fillRect(-5, -38, 10, 10);

		context.moveTo(-10, -33);
		context.lineTo(0, -33);
		context.lineTo(10, -33);
		context.stroke();

		context.closePath();

	} catch (error) {
		console.error(error);
	}
}

function renderDigitalTime(hour, minute, day, dateOfMonth, month, seconds) {
	'use strict';
	context.save();
	context.beginPath();

	if (minute < 10) {
		minute = "0" + minute;
	}

	var ampm = "AM", sDay = "Test", sMonth = "";

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

	context.font = '40px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#FFFFFF';

	if (seconds < 10) {
		seconds = "0" + seconds;
	}

	// context.fillText(hour + ":" + minute + ":" + seconds + " " + ampm, 0, 0);
	context.fillText(hour + ":" + minute + ":" + seconds, 0, 0);

	context.font = '15px monospace';
	context.textAlign = 'right';
	if (timeformat === "0") {
		context.fillText(ampm, canvas.width / 2 - 60, 7);
	}

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
	context.closePath();

	context.beginPath();
	context.font = '20px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#99CC00';

	context.fillText(sDay, 0, 50);
	context.closePath();

	context.beginPath();
	context.font = '25px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#FFFFFF';

	context.fillText(dateOfMonth + " " + sMonth, 0, 80);
	context.closePath();

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
	// renderBattery(_battery);
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

	renderDots();
	renderBattery(battery);
	renderDigitalTime(hours, minutes, day, dateOfMonth, month, seconds);
	renderHourNeedle(hour);
	renderMinuteNeedle(minute);
	renderSecondNeedle(milliseconds);

	context.restore();

	setTimeout(function() {
		window.requestAnimationFrame(watch);
	}, nextMove);

}

function getBattery() {
	var date = getDate(), nextMove = 60000;
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
//				var y = e.y;
//
//				var yMin = canvas.height * 3 / 10;
//				var yMax = canvas.height * 7 / 10;
//
//				if (y >= yMin && y <= yMax) {
//
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

	getBattery();

	window.requestAnimationFrame(watch);

};
