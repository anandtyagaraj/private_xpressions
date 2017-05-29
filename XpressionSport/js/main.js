/*global window, document, tizen, console, setTimeout */
/*jslint plusplus: true*/

var canvas, context, clockRadius, battery, timeformat;

window.requestAnimationFrame = window.requestAnimationFrame
		|| window.webkitRequestAnimationFrame
		|| window.mozRequestAnimationFrame || window.oRequestAnimationFrame
		|| window.msRequestAnimationFrame || function(callback) {
			'use strict';
			window.setTimeout(callback, 1000 / 60);
		};

function renderDots() {
	'use strict';

	var dx = 0, dy = 0, i = 1, angle = null;

	context.save();

	// Assigns the clock creation location in the middle of the canvas
	context.translate(canvas.width / 2, canvas.height / 2);

	// Assign the style of the number which will be applied to the clock plate
	context.beginPath();

	context.fillStyle = '#30CE7A';

	// Create 12 dots in a circle
	for (i = 1; i <= 12; i++) {
		angle = (i - 3) * (Math.PI * 2) / 12;
		dx = clockRadius * 0.9 * Math.cos(angle);
		dy = clockRadius * 0.9 * Math.sin(angle);

		// context.arc(dx, dy, 3, 0, 2 * Math.PI, false);
		if (i === 12 || i === 6 || i === 9 || i === 3) {
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.font = '25px serif';
		} else {
			context.font = '15px serif';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
		}
		if (i === 12 || i === 9 || i === 6 || i === 3) {
			context.fillText(i, dx, dy);
		} else {
			context.fillText(".", dx, dy);
		}
		context.fill();
	}
	context.closePath();

	// Render center dot
	context.beginPath();

	context.fillStyle = '#ff9000';
	context.strokeStyle = '#FFFFFF';
	context.lineWidth = 1;

	context.arc(0, 0, 7, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();
	context.closePath();

	// Render SecondsDot
	context.beginPath();

	context.fillStyle = '#28ABE1';
	context.strokeStyle = '#28ABE1';
	context.lineWidth = 1;

	context.arc(0, 0, 3, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();
	context.closePath();

	// brand
	context.beginPath();

	context.fillStyle = '#AAAAAA';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '15px italic monospace';

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
	if (needletype === "hour") {
		context.lineWidth = 4;
		context.strokeStyle = '#D6D7D6';
		context.lineJoin = 'round';
		context.moveTo(6, -5);
		context.lineTo(6, 5);

	} else if (needletype === "minute") {
		context.lineWidth = 4;
		context.strokeStyle = '#FF9000';
		context.lineJoin = 'round';
		context.moveTo(6, -5);
		context.lineTo(6, 5);

	} else if (needletype === "second") {
		context.lineWidth = 4;
		context.strokeStyle = '#28ABE1';// '#28ABE1';
		context.moveTo(-10, 0);
		context.lineTo(0, 0);

		context.lineWidth = 2;
		context.moveTo(0, 0);
		context.lineTo(0, 0);

	}
	context.lineTo(radius, 0);
	context.closePath();
	context.stroke();
	context.closePath();
	context.restore();

}

function renderHourNeedle(hour) {
	'use strict';

	var angle = null, radius = null;

	angle = (hour - 3) * (Math.PI * 2) / 12;
	radius = clockRadius * 0.5;
	renderNeedle(angle, radius, "hour");
}

function renderMinuteNeedle(minute) {
	'use strict';

	var angle = null, radius = null;

	angle = (minute - 15) * (Math.PI * 2) / 60;
	radius = clockRadius * 0.65;
	renderNeedle(angle, radius, "minute");
}

function renderSecondNeedle(milliseconds) {
	'use strict';
	var angle = null, radius = null, outerradius = null;

	angle = (milliseconds - 15000) * (Math.PI * 2) / 60000.0;
	radius = clockRadius * 0.80;
	outerradius = clockRadius * 0.83;
	renderNeedle(angle, radius, "second");

	// Render seconds circle

	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = '#28ABE1';
	context.lineWidth = 2;

	context.arc(0, 0, radius, 4.7, angle, false);
	context.stroke();

	context.closePath();
	//
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
	try{
	var angle = null, radius = null, outerradius = null, color = '#131213';

	angle = (battery.level - 0.25) * (Math.PI * 2) / 1.0;
	radius = clockRadius * 0.27;
	outerradius = clockRadius * 0.30;

	context.beginPath();
	context.fillStyle = '#131213';
	if (battery.level * 100 > 40) {
		color = '#30CE7A';
		context.strokeStyle = '#30CE7A';
	} else if (battery.level * 100 > 10) {
		color = '#FF9000';
		context.strokeStyle = '#FF9000';
	} else {
		color = '#FF1000';
		context.strokeStyle = '#FF1000';
	}

	context.lineWidth = 2;

	//context.arc(90, 150, radius, 4.7, angle, false);
	context.stroke();

	context.closePath();

	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = '#666666';
	context.lineWidth = 2;

	//context.arc(90, 150, outerradius, 0, Math.PI * 2, false);
	context.stroke();

	context.closePath();

	context.beginPath();
	context.font = '25px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#FFFFFF';

	context.fillText(Math.floor(battery.level * 100) + '%', 90, 150);

	context.closePath();

	// context.beginPath();
	// context.fillStyle = '#30CE7A';
	// context.textAlign = 'center';
	// context.textBaseline = 'middle';
	// context.font = '10px monospace';
	//
	// context.fillText("BAT", 90, 170);
	//
	// context.fill();
	// context.closePath();
	context.beginPath();
	context.fillStyle = color;
	context.strokeStyle = color;
	context.lineWidth = 4;

	context.fillRect(80, 165, 10, 10);

	context.moveTo(70, 170);
	context.lineTo(80, 170);
	context.lineTo(100, 170);
	context.stroke();

	context.closePath();

	context.restore();
	
	}
	catch(error){
	console.error(error);	
	}
}

function renderDigitalTime(hour, minute, day, dateOfMonth, month) {
	'use strict';
	context.save();
	context.beginPath();

	if (minute < 10) {
		minute = "0" + minute;
	}

	var ampm = "AM", sDay = "Test", sMonth = "", outerradius;

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

	context.font = '20px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#30CE7A';

	if (timeformat === "0") {
		context.fillText(ampm, -20, 60);
	}

	context.font = '30px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#30CE7A';

	context.fillText(hour + ":" + minute, 0, 90);

	context.font = '20px serif';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#30CE7A';

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
		sMonth = "Jun";
	} else if (month === 6) {
		sMonth = "Jul";
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

	// topDateText = sDay + ", " + sMonth + " " + dateOfMonth;
	// context.fillText(topDateText, 0, -110);

	context.closePath();

	outerradius = clockRadius * 0.30;

	// Render seconds circle

	// context.beginPath();
	// context.fillStyle = '#131213';
	// context.strokeStyle = '#28ABE1';
	// context.lineWidth = 2;
	//
	// context.arc(0, 0, radius, 4.7, angle, false);
	// context.stroke();
	//
	// context.closePath();
	//
	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = '#666666';
	context.lineWidth = 2;

	context.arc(65, -10, outerradius, 0, Math.PI * 2, false);
	context.stroke();

	context.closePath();

	context.beginPath();
	context.font = '20px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#30CE7A';

	context.fillText(sDay, 65, -40);
	context.closePath();

	context.beginPath();
	context.font = '30px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#FFFFFF';

	context.fillText(dateOfMonth, 65, -10);
	context.closePath();

	context.beginPath();
	context.font = '15px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#30CE7A';

	context.fillText(sMonth, 65, 20);
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

function renderDayDate(day, dateOfMonth, month) {
	'use strict';

	context.beginPath();
	context.font = '20px serif';
	context.textAlign = 'left';
	context.textBaseline = 'middle';
	context.fillStyle = '#B3B4B3';
	var sDay = "Test", topDateText = "";
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

	topDateText = sDay + ", " + month + " " + dateOfMonth;

	context.fillText(topDateText, 0, 0);

	context.closePath();
	context.restore();
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
	renderDigitalTime(hours, minutes, day, dateOfMonth, month);
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
	clockRadius = document.width / 2;

	// Assigns the area that will use Canvas
	canvas.width = document.width;
	canvas.height = canvas.width;

	timeformat = "0";// 12Hr
//	try {
//		canvas.addEventListener('click', function(e) {
//
//			try {
//				var y = e.y;
//
//				var yMin = document.height * 6 / 10;
//				var yMax = document.height * 9 / 10;
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
