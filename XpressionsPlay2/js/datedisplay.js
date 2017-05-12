function renderShowMonth(month, day, dateofMonth) {
	var sDay, sMonth;

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

	try {

		if (playId === 1) {
			var outerradius = clockRadiusX * 0.25;

			context.beginPath();
			context.fillStyle = '#131213';
			context.strokeStyle = '#666666';
			context.lineWidth = 2;

			context.arc(canvas.width * 5 / 10, canvas.height * 7.5 / 10,
					outerradius, 0, Math.PI * 2, false);
			// context.stroke();
			context.fill();
			context.closePath();

			context.beginPath();
			context.font = '22px monospace';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.fillStyle = '#CCCCCC';

			context.fillText(sDay, canvas.width * 5 / 10,
					canvas.height * 6.8 / 10);
			context.closePath();

			context.beginPath();
			context.font = '30px monospace';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.fillStyle = '#FFFFFF';

			context.fillText(dateofMonth, canvas.width * 5 / 10,
					canvas.height * 7.5 / 10);
			context.closePath();

			context.beginPath();
			context.font = '20px monospace';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.fillStyle = '#999999';

			context.fillText(sMonth, canvas.width * 5 / 10,
					canvas.height * 8.2 / 10);
			context.closePath();

		} else if (playId === 0) {

			context.beginPath();
			context.font = '30px monospace';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.fillStyle = '#CCCCCC';

			context.fillText(sDay + ", " + sMonth + " " + dateofMonth,
					canvas.width * 5 / 10, canvas.height * 6.8 / 10);
			context.closePath();
		}

		context.restore();
	} catch (error) {
		console.log("Error in showMonth:" + error);
	}

}

function showDateAdvanced(month, day, dateofMonth) {
	'use strict';
	try {
		// 24 Hour Format
		var outerradius = clockRadiusX * 0.25;
		context.beginPath();
		context.fillStyle = '#222222';
		context.strokeStyle = '#333333';
		context.lineWidth = 2;
		outerradius = clockRadiusX * 0.15;
		context.arc(canvas.width * 0.2, canvas.height * 0.5, outerradius, 0,
				Math.PI * 2, false);
		context.fill();
		context.stroke();
		context.closePath();

		context.beginPath();
		context.font = '22px monospace';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = '#FFFFFF';

		context.fillText(dateofMonth, canvas.width * 0.2, canvas.height * 0.5);
		context.closePath();

		context.beginPath();

		var dx = 0, dy = 0, i = 1, angle = null, startDayAngle = null, endDayAngle = null;
		context.fillStyle = '#D6D7D6';

		// Create 12 dots in a circle
		var week = [ "S", "M", "T", "W", "T", "F", "S" ];
		for (i = 1; i <= 7; i++) {
			angle = (i - (3)) * (Math.PI * 2) / 7;

			dx = canvas.width * 0.2 + clockRadiusX * 0.21 * Math.cos(angle);
			dy = canvas.height * 0.5 + clockRadiusX * 0.21 * Math.sin(angle);

			//console.log(week[i - 1] + "x: " + dx + "y: " + dy);

			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.font = '16px monospace';
			context.fillText(week[i - 1], dx, dy);

			if (day === (i - 1)) {
				startDayAngle = ((i - 0.5) - (3)) * (Math.PI * 2) / 7;
				endDayAngle = ((i + 0.5) - (3)) * (Math.PI * 2) / 7;
			}
		}

		context.closePath();

		context.beginPath();
		
		context.strokeStyle = '#ff0000';
		context.lineWidth = 3;

		context.arc(canvas.width * 0.2, canvas.height * 0.5, outerradius,
				startDayAngle, endDayAngle, false);

		context.stroke();

		context.closePath();
	} catch (e) {
		console.log("Exception :" + e);
	}
}
