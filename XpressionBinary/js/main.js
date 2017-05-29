/*global window, document, tizen, console, setTimeout */
/*jslint plusplus: true*/

var canvas, context, clockRadiusX, clockRadiusY, battery;

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

function renderBattery(battery) {
	'use strict';
	try {
		context.beginPath();

		if (battery.level * 100 > 40) {
			context.strokeStyle = '#71E1F9';
			context.fillStyle = '#71E1F9';
		} else if (battery.level * 100 > 10) {
			context.strokeStyle = '#FF9000';
			context.fillStyle = '#FF9000';
		} else {
			context.strokeStyle = '#FF1000';
			context.fillStyle = '#FF1000';
		}

		// context.strokeStyle = '#333333';
		context.lineWidth = 4;

		context.fillRect(canvas.width * 0.875, canvas.height * 0.25,
				canvas.width * 0.05, canvas.height * 0.05);
		context.fillRect(canvas.width * 0.85, canvas.height * 0.2667,
				canvas.width * 0.025, canvas.height * 0.01667);
		context.fillRect(canvas.width * 0.925, canvas.height * 0.2667,
				canvas.width * 0.025, canvas.height * 0.01667);

		// context.lineTo(canvas.width * 0.95, canvas.height * 0.2667);
		context.stroke();
		context.fill();

		context.closePath();

		context.beginPath();
		context.font = '15px monospace';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = '#AAAAAA';

		context.fillText(Math.floor(battery.level * 100) + '%',
				canvas.width * 0.9, canvas.height * 0.35);

		context.closePath();

		context.restore();
	} catch (error) {
		console.error(error);
	}
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

function showHour(hour) {
	'use strict';
	// Render center dot

	var x, y;
	var FLAG_A = 1; // 0001
	var FLAG_B = 2; // 0010
	var FLAG_C = 4; // 0100
	var FLAG_D = 8; // 1000
	var currenthour;

	if (hour > 12) {
		currenthour = hour - 12;
	} else {
		currenthour = hour;
	}
	context.beginPath();
	context.fillStyle = '#666666';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '15px italic monospace';

	context.fillText("H", (canvas.width * 0.15), (canvas.height * 0.08));

	context.fill();
	context.closePath();

	for (var i = 0; i < 4; i++) {

		x = (canvas.width * 0.25) + i * (canvas.width * 0.1875);
		y = (canvas.height * 0.125);

		context.beginPath();
		context.fillStyle = '#AAAAAA';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.font = '15px italic monospace';

		if (i === 0)
			context.fillText(8, x, y / 2);
		else if (i === 1)
			context.fillText(4, x, y / 2);
		else if (i === 2)
			context.fillText(2, x, y / 2);
		else if (i === 3)
			context.fillText(1, x, y / 2);

		context.fill();
		context.closePath();
		// ------------------------------------------------------
		context.beginPath();

		if (i === 0) {
			if (currenthour & FLAG_D) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#131213';
			}
		} else if (i === 1) {
			if (currenthour & FLAG_C) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#131213';
			}
		} else if (i === 2) {
			if (currenthour & FLAG_B) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#131213';
			}
		} else if (i === 3) {
			if (currenthour & FLAG_A) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#131213';
			}
		}

		context.strokeStyle = '#FFFFFF';

		context.lineWidth = 1;

		context.arc(x, y, 7, 0, 2 * Math.PI, false);// 8
		context.fill();
		context.stroke();
		context.closePath();
	}

}

function fillArea2() {
	'use strict'
	// brand
	context.beginPath();

	context.fillStyle = '#111111';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '15px italic monospace';

	context.fillRect(canvas.width * 0.2, canvas.height * 0.2, canvas.width
			- (canvas.width * 0.2), canvas.height - (canvas.height * 0.2));

	context.fill();
	context.closePath();

	context.beginPath();
	context.lineWidth = 5;
	context.strokeStyle = '#111111';

	context.moveTo(0, 0);
	context.lineTo(canvas.width * 0.22, canvas.height * 0.22);

	context.stroke();
	context.closePath();

}

function showBrand() {
	'use strict'
	// brand
	context.beginPath();

	context.fillStyle = '#AAAAAA';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '15px italic monospace';

	context.fillText("Xpressions", canvas.width / 2, canvas.height * 0.25);

	context.fill();
	context.closePath();
}

function showDigitalTime(hour, minute, seconds) {
	'use strict'

	var hh, mm, ss;

	if (hour < 10)
		hh = "0" + hour;
	else
		hh = hour;

	if (minute < 10)
		mm = "0" + minute;
	else
		mm = minute;

	if (seconds < 10)
		ss = "0" + seconds;
	else
		ss = seconds;

	context.beginPath();

	context.fillStyle = '#FFFFFF';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '30px italic monospace';

	context.fillText(hh + " : " + mm + " : " + ss, canvas.width / 2,
			canvas.height * 0.4);

	context.fill();
	context.closePath();

	context.beginPath();
	if (hour < 12) {
		context.fillStyle = '#68D6F2';
	} else {
		context.fillStyle = '#333333';
	}
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '15px italic monospace';

	context.fillText("AM", canvas.width * 0.95, canvas.height * 0.07);

	context.fill();
	context.closePath();

	context.beginPath();

	if (hour > 11) {
		context.fillStyle = '#68D6F2';
	} else {
		context.fillStyle = '#333333';
	}

	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '15px italic monospace';

	context.fillText("PM", canvas.width * 0.95, canvas.height * 0.14);

	context.fill();
	context.closePath();
}

function showMinute(minute) {
	'use strict'
	// Render center dot

	var x, y;
	var FLAG_A = 1; // 0001
	var FLAG_B = 2; // 0010
	var FLAG_C = 4; // 0100
	var FLAG_D = 8; // 1000
	var FLAG_E = 16;
	var FLAG_F = 32;
	var currentminute = minute;

	context.beginPath();
	context.fillStyle = '#666666';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '15px italic monospace';

	context.fillText("M", (canvas.width * 0.08), (canvas.height * 0.15));

	context.fill();
	context.closePath();

	for (var i = 0; i < 6; i++) {

		x = (canvas.width * 0.125);
		y = (canvas.height * 0.25) + i * (canvas.height * 0.125);

		context.beginPath();
		context.fillStyle = '#AAAAAA';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.font = '15px italic monospace';

		if (i === 0)
			context.fillText(32, x / 2, y);
		else if (i === 1)
			context.fillText(16, x / 2, y);
		else if (i === 2)
			context.fillText(8, x / 2, y);
		else if (i === 3)
			context.fillText(4, x / 2, y);
		else if (i === 4)
			context.fillText(2, x / 2, y);
		else if (i === 5)
			context.fillText(1, x / 2, y);

		context.fill();
		context.closePath();

		// -----------------------------------------
		context.beginPath();
		if (i === 0) {
			if (currentminute & FLAG_F) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#131213';
			}
		} else if (i === 1) {
			if (currentminute & FLAG_E) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#131213';
			}
		} else if (i === 2) {
			if (currentminute & FLAG_D) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#131213';
			}
		} else if (i === 3) {
			if (currentminute & FLAG_C) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#131213';
			}
		} else if (i === 4) {
			if (currentminute & FLAG_B) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#131213';
			}
		} else if (i === 5) {
			if (currentminute & FLAG_A) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#131213';
			}
		}

		context.strokeStyle = '#FFFFFF';
		context.lineWidth = 1;

		context.arc(x, y, 7, 0, 2 * Math.PI, false);// 32
		context.fill();
		context.stroke();
		context.closePath();
	}

}

function showSeconds(seconds) {
	'use strict'
	// Render center dot

	var x, y;
	var FLAG_A = 1; // 0001
	var FLAG_B = 2; // 0010
	var FLAG_C = 4; // 0100
	var FLAG_D = 8; // 1000
	var FLAG_E = 16;
	var FLAG_F = 32;
	var currentsecond = seconds;

	for (var i = 0; i < 6; i++) {

		if (i > 2) {
			x = (canvas.width * 0.35) + (i - 3) * (canvas.width * 0.16667);
			y = (canvas.height * 0.8)
		} else {
			x = (canvas.width * 0.35) + i * (canvas.width * 0.16667);
			y = (canvas.height * 0.6);
		}

		context.beginPath();
		context.fillStyle = '#CCCCCC';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.font = '15px italic monospace';

		if (i === 0)
			context.fillText(32, x, (canvas.height * 0.7));
		else if (i === 1)
			context.fillText(16, x, (canvas.height * 0.7));
		else if (i === 2)
			context.fillText(8, x, (canvas.height * 0.7));
		else if (i === 3)
			context.fillText(4, x, (canvas.height * 0.9));
		else if (i === 4)
			context.fillText(2, x, (canvas.height * 0.9));
		else if (i === 5)
			context.fillText(1, x, (canvas.height * 0.9));

		context.fill();
		context.closePath();

		// ------------------------------------------

		context.beginPath();
		if (i === 0) {
			if (currentsecond & FLAG_F) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#000000';
			}
		} else if (i === 1) {
			if (currentsecond & FLAG_E) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#000000';
			}
		} else if (i === 2) {
			if (currentsecond & FLAG_D) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#000000';
			}
		} else if (i === 3) {
			if (currentsecond & FLAG_C) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#000000';
			}
		} else if (i === 4) {
			if (currentsecond & FLAG_B) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#000000';
			}
		} else if (i === 5) {
			if (currentsecond & FLAG_A) {
				context.fillStyle = '#68D6F2';
			} else {
				context.fillStyle = '#000000';
			}
		}

		context.strokeStyle = '#D6D7D6';
		context.lineWidth = 1;

		// context.arc(x, y, 4, 0, 2 * Math.PI, false);// 32
		context.fillRect(x - 10, y, 20, 10);
		context.fill();
		context.stroke();
		context.closePath();
	}

}

function fillArea3() {
	'use strict'
	// brand
	context.beginPath();

	context.fillStyle = '#222222';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '15px italic monospace';

	context.fillRect(canvas.width * 0.8, canvas.height * 0.45, canvas.width
			- (canvas.width * 0.8), canvas.height - (canvas.height * 0.45));

	context.fill();
	context.closePath();
}

function showDate(day, dateOfMonth, month) {
	'use strict'

	var sDay, sMonth;
	// brand
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

	context.beginPath();

	context.fillStyle = '#EEEEEE';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '20px italic monospace';

	context.fillText(sDay, canvas.width * 0.9, canvas.height * 0.6);

	context.fill();
	context.closePath();

	context.beginPath();

	context.fillStyle = '#68D6F2';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '25px italic monospace';

	context.fillText(dateOfMonth, canvas.width * 0.9, canvas.height * 0.75);

	context.fill();
	context.closePath();

	context.beginPath();

	context.fillStyle = '#D6D7D6';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '20px italic monospace';

	context.fillText(sMonth, canvas.width * 0.9, canvas.height * 0.9);

	context.fill();
	context.closePath();
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

	showHour(hours);
	showMinute(minutes);
	fillArea2();
	showBrand();
	showDigitalTime(hours, minutes, seconds);
	showSeconds(seconds);
	fillArea3();
	showDate(day, dateOfMonth, month);
	renderBattery(battery);

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

window.onload = function() {
	'use strict';

	canvas = document.querySelector('canvas');
	context = canvas.getContext('2d');
	clockRadiusX = document.width / 2;
	clockRadiusY = document.height / 2;

	// Assigns the area that will use Canvas
	canvas.width = document.width;
	canvas.height = document.height;// canvas.width;

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
