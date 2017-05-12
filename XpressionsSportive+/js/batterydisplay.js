function getBattery() {
	try {
		var date = getDate(), nextMove = 30000;
		tizen.systeminfo.getPropertyValue("BATTERY", successCallback,
				errorCallback);

		setTimeout(function() {
			window.requestAnimationFrame(getBattery);
		}, nextMove);
	} catch (Exception) {
	}
}

function renderBatteryCircular(battery) {
	'use strict';
	try {
		// 24 Hour Format
		var outerradius = clockRadiusX * 0.20;
		context.beginPath();
		context.fillStyle = '#222222';
		context.strokeStyle = '#333333';
		context.lineWidth = 2;
		//outerradius = clockRadiusX * 0.15;
		context.arc(canvas.width * 0.5, canvas.height * 0.265, outerradius, 0,
				Math.PI * 2, false);
		context.fill();
		context.stroke();
		context.closePath();

		context.beginPath();
		context.font = 'bold 20px monospace';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = '#D6D7D6';

		var batteryPercentage = battery.level;

		context.fillText(Math.floor(batteryPercentage * 100) + '%',
				canvas.width * 5 / 10, canvas.height * 2.8 / 10);
		context.closePath();

		context.beginPath();
		context.lineWidth = 1;
		context.fillStyle = '#D10000';
		context.strokeStyle = '#D10000';
		context.lineJoin = 'round';
		
		context.moveTo(canvas.width * 0.505, canvas.height * 0.2);
		context.lineTo(canvas.width * 0.49, canvas.height * 0.22);		
		context.lineTo(canvas.width * 0.495, canvas.height * 0.22);
		context.lineTo(canvas.width * 0.495, canvas.height * 0.24);
		context.lineTo(canvas.width * 0.51, canvas.height * 0.22);
		context.lineTo(canvas.width * 0.505, canvas.height * 0.22);
		context.lineTo(canvas.width * 0.505, canvas.height * 0.2);
		
		context.stroke();
		context.fill();
		context.closePath();
		
		var dx = 0, dy = 0, i = 1, angle = null, startDayAngle = null, endDayAngle = null;
		context.fillStyle = '#D6D7D6';

		// Create 12 dots in a circle
		//var week = [ "10", "20", "30", "W", "T", "F", "S" ];
		
		
		for (i = 1; i <= 10; i++) {
			angle = (i - (3)) * (Math.PI * 2) / 10;

			context.beginPath();			
			
			context.lineWidth = 4;

			startDayAngle = ((i - 0.4) - (3)) * (Math.PI * 2) / 10;
			endDayAngle = ((i + 0.4) - (3)) * (Math.PI * 2) / 10;		
		
			setstrokeStyleContext(i, Math.floor(batteryPercentage * 100));	
			
			context.arc(canvas.width * 0.5, canvas.height * 0.265, outerradius,
					startDayAngle, endDayAngle, false);

			context.stroke();

			context.closePath();
			
			
		}

		


	} catch (e) {
		console.log("Exception :" + e);
	}
}

function setstrokeStyleContext(i, battery){
	if (battery > 40) {
		context.strokeStyle = '#CCCCCC';	
	}
	else if (battery > 20) {
		context.strokeStyle = '#FFC200';	
	}
	else{
		context.strokeStyle = '#D10000';
	}
	
	if(i * 10 > battery){
		context.strokeStyle = '#444444';
	}
}


function renderBatterySquare(battery) {
	'use strict';

	if (playId === 0 || playId === 2)
		return;

	try {
		context.beginPath();
		context.font = 'bold 20px monospace';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = '#999999';

		var batteryPercentage = battery.level;

		context.fillText(Math.floor(batteryPercentage * 100) + '%',
				canvas.width * 5 / 10, canvas.height * 2.65 / 10);
		context.closePath();

		context.beginPath();
		context.fillStyle = '#666666';
		context.strokeStyle = '#666666';
		context.lineWidth = 2;

		context.rect(canvas.width * 4.3 / 10, canvas.height * 1.75 / 10,
				canvas.width * 1.2 / 10, canvas.height * 0.5 / 10);
		context.fillRect(canvas.width * 5.5 / 10, canvas.height * 1.90 / 10,
				canvas.width * 0.25 / 10, canvas.height * 0.2 / 10);
		context.stroke();
		context.closePath();

		context.beginPath();
		context.fillStyle = '#CCCCCC';
		if (batteryPercentage < 0.10)
			context.strokeStyle = '#D10000';
		else if (batteryPercentage >= 0.1 && batteryPercentage < 0.25)
			context.strokeStyle = '#FFC200';
		else
			context.strokeStyle = '#999999';

		context.lineWidth = 4;
		if (batteryPercentage > 0) {
			context.moveTo(canvas.width * 4.6 / 10, canvas.height * 2 / 10 + 3);
			context.lineTo(canvas.width * 4.6 / 10, canvas.height * 2 / 10 - 3);
		}
		if (batteryPercentage > 0.35) {
			context.moveTo(canvas.width * 4.9 / 10, canvas.height * 2 / 10 + 3);
			context.lineTo(canvas.width * 4.9 / 10, canvas.height * 2 / 10 - 3);
		}
		if (batteryPercentage > 0.75) {
			context.moveTo(canvas.width * 5.2 / 10, canvas.height * 2 / 10 + 3);
			context.lineTo(canvas.width * 5.2 / 10, canvas.height * 2 / 10 - 3);
		}

		context.stroke();

		context.closePath();

		context.restore();
	} catch (err) {
		console.log(err);
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