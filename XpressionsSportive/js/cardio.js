/**
 * 
 */
var heartRate = 0;
function showCardio() {
	'use strict';
	try {

		var outerradius = clockRadiusX * 0.20;
		context.beginPath();
		context.fillStyle = '#222222';
		context.strokeStyle = '#333333';
		context.lineWidth = 2;

		context.arc(canvas.width * 0.5, canvas.height * 0.73, outerradius, 0,
				Math.PI * 2, false);
		context.fill();
		context.stroke();
		context.closePath();

		context.beginPath();
		context.font = 'bold 20px monospace';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = '#D6D7D6';
		context.fillText(heartRate, canvas.width * 5 / 10,
				canvas.height * 7.4 / 10);
		context.closePath();

		context.beginPath();
		context.font = '14px monospace';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = '#999999';
		context
				.fillText("bpm", canvas.width * 5 / 10,
						canvas.height * 7.8 / 10);
		context.closePath();

		// Draw Heart Start------------------------------
		var radians = 45;
		var posX = canvas.width * 0.51;
		var posY = canvas.height * 0.67;

		// baseLen is essentially a scale indicator
		// e.g. length of the *square* part of a heart
		var baseLen = 6;

		context.save();

		// this moves origin 0,0 to our desired location
		context.translate(posX, posY);

		// optional: use context.rotate(0) to visualize
		// how we're drawing the heart using a square
		// and two half-circles
		context.rotate(4);

		// We want a pinkish heart.
		context.fillStyle = "#666666"// "rgba(255,100,100,0.9)";

		// puts the 2d drawing context into drawing mode
		context.beginPath();
		context.moveTo(-baseLen, 0);
		context.arc(0, 0, baseLen, 0, Math.PI, false);
		context.lineTo(baseLen, 0);
		context.arc(baseLen, -baseLen, baseLen, Math.PI * 90 / 180,
				Math.PI * 270 / 180, true);
		context.lineTo(baseLen, -baseLen * 2);
		context.lineTo(-baseLen, -baseLen * 2);
		context.lineTo(-baseLen, 0);

		// Fill the heart
		context.fill();

		// tells 2d drawing context we're done drawing
		context.closePath();

		// restores canvas state (e.g. origin and other settings)
		context.restore();
		// Draw Heart
		// End--------------------------------------------------------------

		var dx = 0, dy = 0, i = 1, angle = null, startDayAngle = null, endDayAngle = null;
		context.fillStyle = '#D6D7D6';

		// Create 12 dots in a circle
		// var week = [ "10", "20", "30", "W", "T", "F", "S" ];

		for (i = 1; i <= 10; i++) {
			angle = (i - (3)) * (Math.PI * 2) / 10;

			context.beginPath();

			context.lineWidth = 4;

			startDayAngle = ((i - 0.4) - (3)) * (Math.PI * 2) / 10;
			endDayAngle = ((i + 0.4) - (3)) * (Math.PI * 2) / 10;

			setStyleContext(i, heartRate);

			context.arc(canvas.width * 0.5, canvas.height * 0.73, outerradius,
					startDayAngle, endDayAngle, false);

			context.stroke();

			context.closePath();

		}

	} catch (e) {
		console.log("Exception :" + e);
	}
}

function setStyleContext(i, hr) {
	if (hr > 100 || hr < 40) {
		context.strokeStyle = '#D10000';
	} else if (hr > 40 && hr < 100) {
		context.strokeStyle = '#CCCCCC';
	}

	if ((i * 10) > hr) {
		context.strokeStyle = '#444444';
	}
}

function onchangedCB(hrmInfo) {
	if (hrmInfo.heartRate > 0) {
		heartRate = hrmInfo.heartRate;
		setTimeout(function() {
			window.requestAnimationFrame(stopHeartRate());
		}, 5000);
	} else {
		heartRate = "...";
	}
}

function calculateHeartRate() {
	try {

		window.webapis.motion.start("HRM", onchangedCB);

	} catch (err) {
		console.error(err);
	}
}

function stopHeartRate() {
	try {
		console.log("Stopping Heart Rate...");

		window.webapis.motion.stop("HRM");

		clearTimeout(function() {
			window.requestAnimationFrame(stopHeartRate());
		});
	} catch (error) {
		console.log("Stop Heart Rate error " + error);
	}
}
