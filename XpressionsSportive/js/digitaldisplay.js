function renderDigitalTime(hour, minute, day, dateOfMonth, month, seconds) {
	'use strict';
	try {
		// context.save();

		// Assigns the clock creation location in the middle of the canvas
		context.translate(-canvas.width / 2, -canvas.height / 2);

		if (minute < 10) {
			minute = "0" + minute;
		}

		var ampm = "AM";
		
		
		if (itimeformat < 1) {
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

		if (seconds < 10)
			seconds = "0" + seconds;

		

		showBrand();

		showDigital(hour, minute, seconds);

		
	} catch (error) {
		console.log('Error in renderDigitalTime' + error);
	}
}

function showDigital(hour, minute, seconds) {
	context.beginPath();
	context.lineWidth = 3;
	context.fillStyle = '#222222';
	context.strokeStyle = '#999999';
	context.lineJoin = 'round';

	context.moveTo(canvas.width * 0.6, canvas.height * 0.45);
	context.lineTo(canvas.width * 0.9, canvas.height * 0.45);
	context.lineTo(canvas.width * 0.9, canvas.height * 0.55);
	context.lineTo(canvas.width * 0.6, canvas.height * 0.55);
	context.lineTo(canvas.width * 0.6, canvas.height * 0.45);

	context.stroke();
	context.fill();
	context.closePath();

	context.beginPath();

	context.fillStyle = "#BBBBBB";
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	// context.font = '15px italic monospace';
	context.font = "italic bold 25px monospace";

	context
			.fillText(hour + ":" + minute + ":" + seconds, (canvas.width * 0.75),
					(canvas.height * 0.5));

	context.fill();
	context.closePath();
}
