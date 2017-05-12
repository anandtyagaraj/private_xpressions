/*global window, document, tizen, console, setTimeout */
/*jslint plusplus: true*/

var canvas, context, clockRadiusX, clockRadiusY, battery, itimeformat, colorIndex = 1, colorSec = "#ce5a57", bgIndex = 0, savedColorSelectionKey = "ColorSelectionKey", savedBGColorSelectionKey = "BGColorSelectionKey", steps = 0, calories = 0, windSpeed, windDeg, fetchAtleastOnce = 0, lastFetch = 0, lastStepFetch = 0, resetDate = 0, lastReset = 0, playId = 1, theme = 0, lastHR = 0;

window.requestAnimationFrame = window.requestAnimationFrame
		|| window.webkitRequestAnimationFrame
		|| window.mozRequestAnimationFrame || window.oRequestAnimationFrame
		|| window.msRequestAnimationFrame || function(callback) {
			'use strict';
			window.setTimeout(callback, 1000 / 60);
		};

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
	// setBGImage();
	context.save();

	// Assigns the clock creation location in the middle of the canvas
	// context.translate(canvas.width / 2, canvas.height / 2);

	handleTheme();
	
	renderBatteryCircular(battery);
	
	showCardio();
	
	renderDots(seconds);

	renderDigitalTime(hours, minutes, day, dateOfMonth, month, seconds);
	
	
	showDateAdvanced(month, day, dateOfMonth);
	
	renderHourNeedle(hour);
	renderMinuteNeedle(minute);
	renderSecondNeedle(seconds);
	
	renderCenterDots();

	try {

		var now = tizen.time.getCurrentDateTime();

		// console.log("Get Current Date Time: " + now);

		if (lastHR === 0) {
			lastHR = tizen.time.getCurrentDateTime().addDuration(
					new tizen.TimeDuration(-1, "MSECS"));
		}

		// console.log("lastFetch :" + lastFetch);
		var timeDiff = now.difference(lastHR);

		// console.log("fetchAtleastOnce :" + fetchAtleastOnce);
		if (minutes === 0 && seconds < 1) {
			fetchAtleastOnce = 1;
			calculateHeartRate();
		} else if (timeDiff.greaterThan(new tizen.TimeDuration(59, "MINS"))) {
			lastHR = tizen.time.getCurrentDateTime().addDuration(
					new tizen.TimeDuration(-1, "MSECS"));
			calculateHeartRate();
		}
	} catch (error) {
		console.error('Exception' + error);
	}
	
	
	context.restore();

	setTimeout(function() {
		window.requestAnimationFrame(watch);
	}, nextMove);

}

window.onload = function() {
	'use strict';	
	
	console.log("onLoad!");

	canvas = document.querySelector('canvas');
	context = canvas.getContext('2d');
	clockRadiusX = document.width / 2;
	clockRadiusY = document.height / 2;

	// Assigns the area that will use Canvas
	canvas.width = document.width;
	canvas.height = document.height; // canvas.width;

	
	
	itimeformat = 0;
	
	window.addEventListener('tizenhwkey', function(e) {
		if (e.keyName === 'back') {
			try {
				disconnect();
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

		var colorBGValue = localStorage.getItem(savedBGColorSelectionKey);
		if (colorBGValue != null) {
			// canvas.style.background = '-webkit-radial-gradient(' +
			// colorBGValue + ' 30%, black 70%)';
			canvas.style.background = "#000000";
			console.log("Color saved is:" + colorBGValue);
		} else {
			console.log("Color NOT saved");
		}

		getBattery();
		
		calculateHeartRate();
	} catch (error) {
		console.error("Error while loading: " + error);
	}

	window.requestAnimationFrame(watch);

};
