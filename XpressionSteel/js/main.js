/*global window, document, tizen, console, setTimeout */
/*jslint plusplus: true*/

var canvas, context, clockRadiusX, clockRadiusY, battery, timeformat, colorIndex = 1, colorSec = "#000000", face = 1;
var lastTap = 0;
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
	var dx1 = 0, dy1 = 0, dx2 = 0, dy2 = 0, dx3 = 0, dy3 = 0, dx4 = 0, dy4 = 0;

	context.save();

	// Assigns the clock creation location in the middle of the canvas
	context.translate(canvas.width / 2, canvas.height / 2);

	// Assign the style of the number which will be applied to the clock plate
	context.beginPath();

	// context.fillStyle = '#D6D7D6';

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

		dx4 = clockRadiusX * 1.1 * Math.cos(angle);
		dy4 = clockRadiusY * 1.1 * Math.sin(angle);

		// context.arc(dx, dy, 3, 0, 2 * Math.PI, false);
		if (i === 12 || i === 6 || i === 9 || i === 3) {
			// if (i === 12) {
			// context.fillStyle = '#FF1000';
			// }

			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.font = 'bold 30px serif';
		} else {
			context.fillStyle = '#000000';
			context.font = 'bold 20px serif';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
		}
		if (i === 12 || i === 9 || i === 6 || i === 3) {
			if (i === 12) {
				context.fillStyle = colorSec;
			}

			if (face === 1) {
				context.fillText(i, dx, dy);
			} else if (face === 2) {

				if (i === 3) {
					context.fillText("III", dx, dy);
				} else if (i === 6) {
					context.fillText("VI", dx, dy);
				} else if (i === 9) {
					context.fillText("IX", dx, dy);
				} else if (i === 12) {
					context.fillText("XII", dx, dy);
				}
			} else if (face === 3) {
				context.lineWidth = 5;
				context.lineJoin = "round";
				context.moveTo(dx, dy);
				context.lineTo(dx4, dy4);
				context.stroke();
			}
			context.fill();
		} else {
			context.font = 'bold 15px serif';
			context.strokeStyle = colorSec;
			// context.fillText(i, dx, dy);
			context.lineWidth = 1;
			context.lineJoin = "round";
			if (face === 1 || face === 2) {
				context.moveTo(dx1, dy1);
				context.lineTo(dx2, dy2);
				context.lineTo(dx3, dy3);
				context.lineTo(dx1, dy1);
			} else {
				context.lineWidth = 3;
				context.lineJoin = "round";
				context.moveTo(dx1, dy1);
				context.lineTo(dx4, dy4);
			}
			context.stroke();

		}

	}
	context.closePath();

	// Render center dot
	context.beginPath();

	context.fillStyle = '#444444';
	context.strokeStyle = '#444444';
	context.lineWidth = 1;

	context.arc(0, 0, 7, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();
	context.closePath();

	// Render SecondsDot
	context.beginPath();

	context.fillStyle = face === 1 ? colorSec : "#F53E2C";
	context.strokeStyle = face === 1 ? colorSec : "#F53E2C";
	context.lineWidth = 1;

	context.arc(0, 0, 4, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();
	context.closePath();

	// brand
	context.beginPath();

	context.fillStyle = '#131213';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = 'italic 15px monospace';

	context.fillText("Xpressions", 0, -canvas.height / 2 + 70);
	// context.fillText("Neo Sport", 0, -canvas.height/2 + 75);

	context.fill();
	context.closePath();

}

function renderNeedle(angle, radius, needletype) {
	'use strict';
	context.save();
	context.rotate(angle);
	context.beginPath();
	if (face === 1) {
		if (needletype === "hour") {
			context.lineWidth = 3;
			context.fillStyle = "#444444";
			context.strokeStyle = '#131213';
			context.lineJoin = 'round';
			context.moveTo(6, -2);
			context.lineTo(6, 2);

			context.lineTo(15, 4);

			context.lineTo(radius, 4);
			context.lineTo(radius + 10, 0)
			context.lineTo(radius, -4);

			context.lineTo(15, -4);
			context.fill();

		} else if (needletype === "minute") {
			context.lineWidth = 3;
			context.fillStyle = "#28ABE1";
			context.strokeStyle = '#333333';
			context.lineJoin = 'round';
			context.moveTo(6, -2);
			context.lineTo(6, 2);

			context.lineTo(15, 4);

			context.lineTo(radius, 4);
			context.lineTo(radius + 10, 0)
			context.lineTo(radius, -4);

			context.lineTo(15, -4);
			// context.fill();
		} else if (needletype === "second") {
			context.lineWidth = 4;
			context.strokeStyle = '#000000';// '#28ABE1';
			context.moveTo(-10, 0);
			context.lineTo(0, 0);

			context.lineWidth = 3;
			context.moveTo(0, 0);
			context.lineTo(0, 0);
			context.lineTo(radius, 0);
		}
	} else if (face === 2 || face === 3) {
		if (needletype === "hour") {
			context.lineWidth = 6;
			context.fillStyle = "#444444";
			context.strokeStyle = '#131213';
			context.lineJoin = 'round';
			context.moveTo(6, 0);
			context.lineTo(6, 0);

			context.lineTo(15, 0);

			context.lineTo(radius, 0);
			context.lineTo(radius + 10, 0)
			context.lineTo(radius, 0);

			context.lineTo(15, 0);
			context.fill();

		} else if (needletype === "minute") {
			context.lineWidth = 5;
			context.fillStyle = "#28ABE1";
			context.strokeStyle = '#444444';
			context.lineJoin = 'round';
			context.moveTo(6, 0);
			context.lineTo(6, 0);

			context.lineTo(15, 0);

			context.lineTo(radius, 0);
			context.lineTo(radius + 10, 0)
			context.lineTo(radius, 0);

			context.lineTo(15, 0);
			// context.fill();
		} else if (needletype === "second") {
			context.lineWidth = 2;
			context.strokeStyle = '#F53E2C';// '#28ABE1';
			context.moveTo(-10, 0);
			context.lineTo(0, 0);

			context.lineWidth = 3;
			context.moveTo(0, 0);
			context.lineTo(0, 0);
			context.lineTo(radius, 0);
		}
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
	radius = clockRadiusX * 0.5;
	renderNeedle(angle, radius, "hour");
}

function renderMinuteNeedle(minute) {
	'use strict';

	var angle = null, radius = null;

	angle = (minute - 15) * (Math.PI * 2) / 60;
	radius = clockRadiusX * 0.70;
	renderNeedle(angle, radius, "minute");
}

function renderSecondNeedle(milliseconds) {
	'use strict';
	var angle = null, radius = null, outerradius = null;

	angle = (milliseconds - 15000) * (Math.PI * 2) / 60000.0;
	radius = clockRadiusX * 0.80;
	outerradius = clockRadiusX * 0.82;
	renderNeedle(angle, radius, "second");

}

function renderBattery(battery) {
	'use strict';
	try {
		context.beginPath();
		context.font = 'bold 20px monospace';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = '#131213';

		var batteryPercentage = battery.level;

		context.fillText(Math.floor(batteryPercentage * 100) + '%',
				canvas.width * 6.5 / 10, canvas.height * 7.25 / 10);
		context.closePath();

		context.beginPath();
		context.fillStyle = '#131213';
		context.strokeStyle = '#000000';
		context.lineWidth = 2;

		context.rect(canvas.width * 4.3 / 10, canvas.height * 7 / 10,
				canvas.width * 1.2 / 10, canvas.height * 0.5 / 10);
		context.fillRect(canvas.width * 5.5 / 10, canvas.height * 7.15 / 10,
				canvas.width * 0.25 / 10, canvas.height * 0.2 / 10);
		context.stroke();
		context.closePath();

		context.beginPath();
		context.fillStyle = '#131213';
		context.strokeStyle = batteryPercentage > 0.35 ? '#000000' : '#D10000';

		context.lineWidth = 4;
		if (batteryPercentage > 0) {
			context.moveTo(canvas.width * 4.6 / 10, canvas.height * 7 / 10 + 3);
			context.lineTo(canvas.width * 4.6 / 10,
					canvas.height * 7.5 / 10 - 3);
		}
		if (batteryPercentage > 0.35) {
			context.moveTo(canvas.width * 4.9 / 10, canvas.height * 7 / 10 + 3);
			context.lineTo(canvas.width * 4.9 / 10,
					canvas.height * 7.5 / 10 - 3);
		}
		if (batteryPercentage > 0.75) {
			context.moveTo(canvas.width * 5.2 / 10, canvas.height * 7 / 10 + 3);
			context.lineTo(canvas.width * 5.2 / 10,
					canvas.height * 7.5 / 10 - 3);
		}

		context.stroke();

		context.closePath();

		context.restore();
	} catch (Exception) {
	}
}

function renderDigitalTime(hour, minute, day, dateOfMonth, month, seconds) {
	'use strict';
	context.save();

	context.beginPath();
	context.strokeStyle = '#444444';
	context.lineWidth = 1;

	context.rect(canvas.width * 2.5 / 10 - 2, -12, canvas.width * 1 / 10 + 4,
			20 + 4);
	context.stroke();
	context.closePath();

	context.beginPath();
	context.strokeStyle = '#000000';
	context.lineWidth = 1;

	context.rect(canvas.width * 2.5 / 10, -10, canvas.width * 1 / 10, 20);
	context.stroke();
	context.closePath();

	context.beginPath();
	context.font = 'bold 20px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#000000';

	context.fillText(dateOfMonth, canvas.width * 3 / 10, 0);
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
			.getCurrentDateTime().getMonth(), nextMove = 100;

	// var battery = tizen.systeminfo.
	// Erase the previous time
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);

	context.save();

	// Assigns the clock creation location in the middle of the canvas
	// context.translate(canvas.width / 2, canvas.height / 2);

	renderBattery(battery);

	renderDots();
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
	var date = getDate(), nextMove = 30000;
	tizen.systeminfo
			.getPropertyValue("BATTERY", successCallback, errorCallback);

	setTimeout(function() {
		window.requestAnimationFrame(getBattery);
	}, nextMove);
}

function changeFace(){
	try {
		if (face === 1) {
			face = 2;
		} else if (face === 2) {
			face = 3;
		} else if (face === 3) {
			face = 1;
		}

	} catch (err) {
		alert('error');
		console.log('Error: ', err.message);
	}
	
}

function showMenu(){
	if(document.getElementById('imgChangeTheme').style.visibility === 'visible')
		document.getElementById('imgChangeTheme').style.visibility = 'hidden';
		else
			document.getElementById('imgChangeTheme').style.visibility = 'visible';
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
//			
//			
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
