function renderDots(seconds) {
	'use strict';

	var dx = 0, dy = 0, i = 1, angle = null, angle1 = null, angle2 = null;
	var dx1 = 0, dy1 = 0, dx2 = 0, dy2 = 0, dx3 = 0, dy3 = 0;

	context.save();

	// Assigns the clock creation location in the middle of the canvas
	context.translate(canvas.width / 2, canvas.height / 2);

	if (playId === 1) {
		// Assign the style of the number which will be applied to the clock
		// plate
		context.beginPath();

		context.fillStyle = '#D6D7D6'; // '#009AC9';

		// Create 12 dots in a circle
		for (i = 1; i <= 60; i++) {
			angle = (i - 15) * (Math.PI * 2) / 60;
			// angle1 = (i + 0.02 - 3) * (Math.PI * 2) / 60;
			// angle2 = (i - 0.02 - 3) * (Math.PI * 2) / 12;

			dx = clockRadiusX * 0.9 * Math.cos(angle);
			dy = clockRadiusY * 0.9 * Math.sin(angle);

			dx1 = clockRadiusX * 1 * Math.cos(angle);
			dy1 = clockRadiusY * 1 * Math.sin(angle);

			dx2 = clockRadiusX * 0.8 * Math.cos(angle);
			dy2 = clockRadiusY * 0.8 * Math.sin(angle);
			//
			dx3 = clockRadiusX * 0.95 * Math.cos(angle);
			dy3 = clockRadiusY * 0.95 * Math.sin(angle);

			// context.arc(dx, dy, 3, 0, 2 * Math.PI, false);
			if (i % 5 === 0) {

				context.textAlign = 'center';
				context.textBaseline = 'middle';
				context.font = '20px serif';
			} else {
				context.font = '20px serif';
				context.textAlign = 'center';
				context.textBaseline = 'middle';
			}
			if (i % 5 === 0) {

				if (i === 60) {
					context.fillStyle = colorSec;
					context.fillText(i / 5, dx, dy);
				} else if (i === 15 || i == 30 || i == 45) {
					context.fillStyle = "#D6D7D6";
					context.fillText(i / 5, dx, dy);
				} else
					context.fillStyle = "#222222";

				context.beginPath();
				context.font = '400 20px sans-serif';
				context.strokeStyle = "#D6D7D6";// colorSec; // "#30CE7A";

				context.lineWidth = 2;
				context.lineJoin = "round";
				context.moveTo(dx1, dy1);
				context.lineTo(dx3, dy3);

				context.stroke();

				if (i === 15 || i === 40 || i === 45) {
					// dont print
				} else {
					// context.fillText(i / 5, dx2, dy2);
				}

			} else {
				// console.log("i = " + i + " seconds = " + seconds);
				if (i <= seconds) {
					// context.strokeStyle = colorSec;
				} else {
					context.strokeStyle = "#444444";
				}

				context.beginPath();
				context.font = '400 20px sans-serif';
				context.strokeStyle = "#666666";// colorSec; // "#30CE7A";
				// context.fillText(i, dx, dy);
				context.lineWidth = 2;
				context.lineJoin = "round";
				context.moveTo(dx1, dy1);
				context.lineTo(dx3, dy3);

				context.stroke();
			}

			// }
			context.fill();
		}
		context.closePath();
	}

	// brand

	// context.beginPath();
	//
	// context.fillStyle = "#999999";
	// context.textAlign = 'center';
	// context.textBaseline = 'middle';
	// context.font = '15px italic monospace';
	//
	// context.fillText("Xpressions", -(canvas.width / 2) * (0.5),
	// (canvas.height /2 * 0.15));
	//
	// context.fill();
	// context.closePath();

}

function renderNeedle(angle, radius, needletype) {
	'use strict';

	context.rotate(angle);
	context.beginPath();
	if (needletype === "hour") {
		var x = 0, y = 0;
		context.lineWidth = 3;
		context.fillStyle = '#D6D7D6';
		context.strokeStyle = '#999999';
		context.lineJoin = 'round';
		// context.moveTo((radius - radius * 0.15), y-2);
		context.moveTo(x, y - 5);
		context.lineTo(x, y - 5);
		context.lineTo(x + radius - 10, y - 5);
		context.lineTo(x + radius, y);
		context.lineTo(x + radius - 10, y + 5);
		context.lineTo(x, y + 5);
		context.lineTo(x, y - 5);

		context.moveTo(x + radius - 20, y - 5);
		context.lineTo(x + radius - 20, y + 5);

		context.stroke();

	} else if (needletype === "minute") {
		var x = 0, y = 0;
		context.lineWidth = 3;
		context.fillStyle = '#D6D7D6';
		context.strokeStyle = '#D6D7D6';
		context.lineJoin = 'round';
		// context.moveTo((radius - radius * 0.15), y-2);
		context.moveTo(x, y - 5);
		context.lineTo(x, y - 5);
		context.lineTo(x + radius - 10, y - 5);
		context.lineTo(x + radius, y);
		context.lineTo(x + radius - 10, y + 5);
		context.lineTo(x, y + 5);
		context.lineTo(x, y - 5);

		context.moveTo(x + radius - 20, y - 5);
		context.lineTo(x + radius - 20, y + 5);

		context.stroke();
	} else if (needletype === "second") {

		context.lineWidth = 1;
		context.fillStyle = 'yellow';
		context.strokeStyle = 'yellow';
		context.lineJoin = 'round';
		context.moveTo((-radius * 0.3), -2);
		context.lineTo((-radius * 0.3), +2);
		context.lineTo((-radius * 0.1), +1);
		context.lineTo((radius - radius * 0.1), 0);
		context.lineTo((radius - radius * 0.1), +3);
		context.lineTo((radius - radius * 0.05), 0);
		context.lineTo((radius - radius * 0.1), -3);
		context.lineTo((radius - radius * 0.1), 0);

		context.fill();

	}

	context.closePath();
	context.stroke();
	context.closePath();
	context.restore();

}

function renderHourNeedle(hour) {
	'use strict';

	if (playId === 0)
		return;

	context.save();
	context.translate(canvas.width / 2, canvas.height / 2);

	var angle = null, radius = null;

	angle = (hour - 3) * (Math.PI * 2) / 12;
	radius = clockRadiusX * 0.65;
	renderNeedle(angle, radius, "hour");
}

function renderMinuteNeedle(minute) {
	'use strict';

	if (playId === 0)
		return;

	context.save();
	context.translate(canvas.width / 2, canvas.height / 2);

	var angle = null, radius = null;

	angle = (minute - 15) * (Math.PI * 2) / 60;
	radius = clockRadiusX * 0.75;
	renderNeedle(angle, radius, "minute");
}

function renderCenterDots() {
	
	if (playId === 0)
		return;
	
	// Render center dot
	context.beginPath();

	context.fillStyle = '#FFFFFF';
	context.strokeStyle = '#D6D7D6';
	context.lineWidth = 1;

	context.arc(canvas.width / 2, canvas.height / 2, 10, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();
	context.closePath();

	// Render SecondsDot
	context.beginPath();

	context.fillStyle = 'yellow';
	context.strokeStyle = 'yellow';
	context.lineWidth = 1;

	context.arc(canvas.width / 2, canvas.height / 2, 7, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();
	context.closePath();
}

function renderSecondNeedle(seconds) {
	'use strict';

	if (playId === 0)
		return;

	context.save();
	context.translate(canvas.width / 2, canvas.height / 2);

	var angle = null, radius = null, outerradius = null, dx1, dy1, dx2, dy2;

	angle = ((seconds * 1000) - 15000) * (Math.PI * 2) / 60000.0;

	radius = clockRadiusX * 0.9;

	outerradius = clockRadiusX * 0.9;
	renderNeedle(angle, outerradius, "second");

}
