/*global window, document, tizen, console, setTimeout */
/*jslint plusplus: true*/

var canvas, context, clockRadius;

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

	context.fillStyle = '#FFFFFF';

	// Create 4 dots in a circle
	for (i = 1; i <= 12; i++) {
		angle = (i - 3) * (Math.PI * 2) / 12;
		dx = clockRadius * 0.9 * Math.cos(angle);
		dy = clockRadius * 0.9 * Math.sin(angle);

		// context.arc(dx, dy, 3, 0, 2 * Math.PI, false);
		if (i === 12 || i === 6 || i === 9) {
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.font = '30px serif';
		} else {
			context.font = '10px serif';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
		}
		if (i !== 3) {
			context.fillText(i, dx, dy);
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

	// Render date and day of week
	context.beginPath();
	context.fillStyle = '#FFFFFF';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.strokeStyle = '#ff9000';
	context.lineWidth = 1;
	context.beginPath();
	context.moveTo((canvas.width / 2) - 90, -15);
	context.lineTo((canvas.width / 2) - 10, -15);

	context.moveTo((canvas.width / 2) - 10, -15);
	context.lineTo((canvas.width / 2) - 10, 15);

	context.moveTo((canvas.width / 2) - 90, 15);
	context.lineTo((canvas.width / 2) - 10, 15);

	context.moveTo((canvas.width / 2) - 90, -15);
	context.lineTo((canvas.width / 2) - 90, 15);

	context.moveTo((canvas.width / 2) - 40, -15);
	context.lineTo((canvas.width / 2) - 40, 15);

	context.closePath();
	context.stroke();
	context.closePath();

	// brand
	context.beginPath();
	context.fillStyle = '#131213';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '15px monospace';

	context.fillText("Xpressions", 0, -canvas.height / 2 + 100);

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
	} else if (needletype === "minute") {
		context.lineWidth = 4;
		context.strokeStyle = '#FFFFFF';
	} else if (needletype === "second") {
		context.lineWidth = 2;
		context.strokeStyle = '#FF0000';
	}
	context.moveTo((canvas.width / 4), -50);
	context.lineTo(radius, -50);
	context.closePath();
	context.stroke();
	context.closePath();
	context.restore();

}

function renderHourNeedle(hour) {
	'use strict';

	var angle = null, radius = null;

	angle = (hour - 3) * (Math.PI * 2) / 12;
	radius = clockRadius * 0.55;
	renderNeedle(angle, radius, "hour");
}

function renderMinuteNeedle(minute) {
	'use strict';

	var angle = null, radius = null;

	angle = (minute - 15) * (Math.PI * 2) / 60;
	radius = clockRadius * 0.75;
	renderNeedle(angle, radius, "minute");
}

function renderSecondNeedle(milliseconds) {
	'use strict';
	var angle = null, radius = null, outerradius = null;

	angle = (milliseconds - 15000) * (Math.PI * 2) / 60000.0;
	radius = clockRadius * 0.16;
	outerradius = clockRadius * 0.20;
	// renderNeedle(angle, radius, "second");

	// Render seconds circle
	// context.beginPath();
	// context.fillStyle = '#131213';
	// context.strokeStyle = '#D6D7D6';
	// context.lineWidth = 2;
	//
	// context.arc(canvas.width / 4, -50, clockRadius * 25, 0, angle, false);
	// context.fill();
	// context.stroke();
	// context.closePath();

	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = '#28ABE1';
	context.lineWidth = 2;

	context.arc(110, -45, radius, 4.7, angle, false);
	context.stroke();

	context.closePath();

	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = '#D6D7D6';
	context.lineWidth = 2;

	context.arc(110, -45, outerradius, 0, Math.PI * 2, false);
	context.stroke();

	context.closePath();

}

function renderBattery(battery) {
	'use strict';
	var angle = null, radius = null, outerradius = null;

	angle = (battery.level - 0.25) * (Math.PI * 2) / 1.0;
	radius = clockRadius * 0.16;
	outerradius = clockRadius * 0.20;
	
	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = '#FF9000';
	context.lineWidth = 2;

	context.arc(100, 117, radius, 4.7, angle, false);
	context.stroke();

	context.closePath();

	context.beginPath();
	context.fillStyle = '#131213';
	context.strokeStyle = '#D6D7D6';
	context.lineWidth = 2;

	context.arc(100, 117, outerradius, 0, Math.PI * 2, false);
	context.stroke();

	context.closePath();

	context.beginPath();
	context.font = '25px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#FFFFFF';
	context.fillText(battery.level * 100, 100, 117);

	context.closePath();

	context.beginPath();
	context.fillStyle = '#D3D4D3';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '10px monospace';

	context.fillText("BAT", 100, 132);

	context.fill();
	context.closePath();

	context.restore();
}

function renderDigitalTime(hour, minute, seconds, day, dateOfMonth, month) {
	'use strict';
	context.save();
	context.beginPath();

	if (hour < 10) {
		hour = "0" + hour;
	}
	if (minute < 10) {
		minute = "0" + minute;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}

	var ampm = "AM";
	if (hour > 11) {
		ampm = "PM";
		if (hour > 12) {
			hour = hour - 12;
		}
		if (hour === "00") {
			hour = 12;
		}
	}

	context.font = '20px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#D6D7D6';

	context.fillText(ampm, -canvas.width / 2 + 40, 0);

	context.font = '110px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#FFFFFF';

	context.fillText(hour + ":" + minute, 0, 60);

	context.font = '30px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#FFFFFF';

	context.fillText(seconds, 110, -45);

	context.font = '40px TizenSans';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#B3B4B3';

	var sDay = "Test", topDateText = "", sMonth = "";
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

	topDateText = sDay + ", " + sMonth + " " + dateOfMonth;
	context.fillText(topDateText, 0, -110);

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
	var sDay = "Test", topDateText = "", battery;
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

function successCallback(battery) {
	
	renderBattery(battery);
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
			+ seconds / 60, nextMove = 1000 - date.getMilliseconds(), milliseconds = seconds
			* 1000 + date.getMilliseconds(), day = tizen.time
			.getCurrentDateTime().getDay(), dateOfMonth = tizen.time
			.getCurrentDateTime().getDate(), month = tizen.time
			.getCurrentDateTime().getMonth();

	// var battery = tizen.systeminfo.
	// Erase the previous time
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);

	context.save();

	// Assigns the clock creation location in the middle of the canvas
	context.translate(canvas.width / 2, canvas.height / 2);

	// renderDayDate(day, dateOfMonth, month);
	renderDigitalTime(hours, minutes, seconds, day, dateOfMonth, month);

	renderSecondNeedle(milliseconds);
	
	context.beginPath();
	context.strokeStyle = '#D4D3D4';
	context.lineWidth = 1;
	context.moveTo(-(canvas.width / 2) + 80, canvas.height/2 - 40);
	context.lineTo((canvas.width / 2) - 80, canvas.height/2 - 40);	
	context.stroke();
	context.closePath();

	tizen.systeminfo
			.getPropertyValue("BATTERY", successCallback, errorCallback);
	context.restore();
	setTimeout(function() {
		window.requestAnimationFrame(watch);
	}, nextMove);
}

window.onload = function() {
	'use strict';

	canvas = document.querySelector('canvas');
	context = canvas.getContext('2d');
	clockRadius = document.width / 2;

	// Assigns the area that will use Canvas
	canvas.width = document.width;
	canvas.height = canvas.width;

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

	window.requestAnimationFrame(watch);
};
