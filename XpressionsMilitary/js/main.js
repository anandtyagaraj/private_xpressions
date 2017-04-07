/*global window, document, tizen, console, setTimeout */
/*jslint plusplus: true*/

var canvas, context, clockRadiusX, clockRadiusY, battery, timeformat, colorIndex = 1, colorSec = "#28ABE1", bgIndex = 2, heartRate = "", bHRON = 0, savedColorSelectionKey = "ColorSelectionKey", savedBGColorSelectionKey = "BGColorSelectionKey", temperatureInCel = 0, temperatureInFah = 0, temperatureId, windSpeed, windDeg, tempUnit = 0, fetchAtleastOnce = 0, lastFetch = 0, resetDate = 0, lastReset = 0, playId = 1;

window.requestAnimationFrame = window.requestAnimationFrame
		|| window.webkitRequestAnimationFrame
		|| window.mozRequestAnimationFrame || window.oRequestAnimationFrame
		|| window.msRequestAnimationFrame || function(callback) {
			'use strict';
			window.setTimeout(callback, 1000 / 60);
		};

/*
 * Weather Notification START
 */
/*
 * Copyright (c) 2014 Samsung Electronics Co., Ltd. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. * Redistributions in binary
 * form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided
 * with the distribution. * Neither the name of Samsung Electronics Co., Ltd.
 * nor the names of its contributors may be used to endorse or promote products
 * derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var SAAgent = null;
var SASocket = null;
var CHANNELID = 1983;
var ProviderAppName = "Xpressions";

function createHTML(log_string) {
	// var content = document.getElementById("toast-content");
	// content.textContent = log_string;
	// tau.openPopup("#toast");
}



function onerror(err) {
	var c = document.getElementById("imgWeatherIcon");
	c.src = "icons\\noconnection.png";
	
	temperatureId = "";
	console.log("err [" + err + "]");
}

var agentCallback = {
	onconnect : function(socket) { 
		console.log("Trying to call agent...");
		SASocket = socket;
		SASocket.setSocketStatusListener(function(reason) {
			console.log("Service connection lost, Reason : [" + reason + "]");
			disconnect();
		});
		SASocket.setDataReceiveListener(onreceive);
		fetch();
	},
	onerror : onerror
};

var peerAgentFindCallback = {
	onpeeragentfound : function(peerAgent) {
		try {
			if (peerAgent.appName == ProviderAppName) {
				console.log("Trying to set Service Connection...");
				SAAgent.setServiceConnectionListener(agentCallback);
				SAAgent.requestServiceConnection(peerAgent);
			} else {
				console.log("Not expected app!! : " + peerAgent.appName);
				// createHTML("Not expected app!! : " + peerAgent.appName);
			}
		} catch (err) {
			console
					.log("exception [" + err.name + "] msg[" + err.message
							+ "]");
		}
	},
	onerror : onerror
}

function onsuccess(agents) {
	try {
		if (agents.length > 0) {
			SAAgent = agents[0];

			SAAgent.setPeerAgentFindListener(peerAgentFindCallback);
			SAAgent.findPeerAgents();

		} else {
			// createHTML("Not found SAAgent!!");
		}
	} catch (err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function connect() {
	if (SASocket) {
		console.log("SASocket not null");
		return false;
	}
	try {
		webapis.sa.requestSAAgent(onsuccess, function(err) {
			console.log("err [" + err.name + "] msg[" + err.message + "]");
		});
	} catch (err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function reconnect(){
	console.log("Trying to reconnect");
	disconnect();
	connect();
}

function disconnect() {
	try {
		if (SASocket) {
			console.log("Disconnect Service Connection...");
			SASocket.close();
			SASocket = null;
			
			onerror("Disconnected...")
			// createHTML("closeConnection");
		}
	} catch (err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function onreceive(channelId, data) {
	try {
		var receivedData = data;
		var obj = JSON.parse(data)
			console.log("Received Data!" + receivedData);
	
		if(obj != null){
			
			if(obj.command != null){
				switch(obj.command){		
				
				
				case "12":swapTimeFormat("0");break;
				case "24":swapTimeFormat("1");break;
				case "C":changeTempUnit(0); break;
				case "F":changeTempUnit(1); break;
				case "TEXT_COLOR":changeColor(); break;
				case "BACK_COLOR":changeBGImage(); break;
				case "12/24":swapTimeFormat(); break;
				case "C/F":changeTempUnit(); break;
				case "Theme":changePlay(); break;
				case "HR":calculateHeartRate(); break;
				
				}
			}
			else if(obj.temperatureId == undefined){
				//steps = obj.steps;
				//calories = obj.calories;
			}
			else{
				temperatureId = obj.temperatureId;
				temperatureInCel = obj.tempCel;
				temperatureInFah = obj.tempFah;
				console.log("Celcius: " + temperatureInCel);
				console.log("Fah: " + temperatureInFah);
				console.log("TempId: " + temperatureId);
			}
		}
		

//		if (receivedData == "No Weather") {
//			//fetchAtleastOnce = 0;
//		} else {
			fetchAtleastOnce = 1;

			lastFetch = tizen.time.getCurrentDateTime();
		//}

	} catch (err) {
		console.log("onReceive: exception [" + err.name + "] msg["
				+ err.message + "]");
	}
}

function fetch() {
	try {
		SASocket.sendData(CHANNELID, "request");
		console.log('Fetching weather info...');
	} catch (err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
		connect();
	}
}

/*
 * Weather Notification END
 */

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

		context.fillStyle = colorSec; // '#009AC9';

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

				if (i === 60)
					context.fillStyle = colorSec;
				else if (i === 15 || i == 30 || i == 45)
					context.fillStyle = "#D6D7D6";
				else
					context.fillStyle = "#222222";

				context.beginPath();
				context.font = '400 20px sans-serif';
				context.strokeStyle = "#D6D7D6";// colorSec; // "#30CE7A";
				//context.fillText(i, dx, dy);
				context.lineWidth = 2;
				context.lineJoin = "round";
				context.moveTo(dx1, dy1);
				context.lineTo(dx3, dy3);

				context.stroke();

				if (i === 15 || i === 40 || i === 45) {
					// dont print
				} else {
					//context.fillText(i / 5, dx2, dy2);
				}

			} else {
				// console.log("i = " + i + " seconds = " + seconds);
				if (i <= seconds) {
					context.strokeStyle = colorSec;
				} else {
					context.strokeStyle = "#444444";
				}

				context.beginPath();
				context.font = '400 20px sans-serif';
				// context.strokeStyle = "#666666";// colorSec; // "#30CE7A";
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
		context.lineWidth = 3;
		context.fillStyle = '#D6D7D6';
		context.strokeStyle = colorSec; // '#68D6F2';
		context.lineJoin = 'round';
		context.moveTo((radius - radius * 0.15), -2);
		context.lineTo((radius - radius * 0.15), 2);

		context.lineTo((radius - radius * 0.1), 4);

		context.lineTo(radius, 4);
		context.lineTo(radius + 10, 0);
		context.lineTo(radius, -4);

		context.lineTo((radius - radius * 0.1), -4);
		context.fill();

	} else if (needletype === "minute") {
		context.lineWidth = 2;
		context.fillStyle = "#999C9B";
		context.strokeStyle = '#FFFFFF';
		context.lineJoin = 'round';
		context.moveTo((radius - radius * 0.15), -2);
		context.lineTo((radius - radius * 0.15), 2);

		context.lineTo((radius - radius * 0.1), 4);

		context.lineTo(radius, 4);
		context.lineTo(radius + 10, 0);
		context.lineTo(radius, -4);

		context.lineTo((radius - radius * 0.1), -4);
		context.fill();
	} else if (needletype === "second") {
		context.lineWidth = 6;
		context.strokeStyle = colorSec; // '#28ABE1';
		// context.moveTo(-10, 0);
		// context.lineTo(0, 0);
		//
		// context.lineWidth = 2;
		// context.moveTo(0, 0);
		// context.lineTo(0, 0);
		// context.lineTo(radius, 0);

		context.moveTo(radius, -10);
		context.lineTo(radius, 5);

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
	radius = clockRadiusX * 0.80;
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
	radius = clockRadiusX * 0.85;
	renderNeedle(angle, radius, "minute");
}

function renderSecondNeedle(seconds) {
	'use strict';

	
	if (playId === 0)
		return;

	context.save();
	context.translate(canvas.width / 2, canvas.height / 2);
	
	var angle = null, radius = null, outerradius = null, dx1, dy1, dx2, dy2;

	angle = ((seconds * 1000) - 15000) * (Math.PI * 2) / 60000.0;

	
	radius = clockRadiusX * 0.87;

	outerradius = clockRadiusX * 0.87;
	renderNeedle(angle, outerradius, "second");

	
}

function renderBattery(battery) {
	'use strict';

	if (playId === 0)
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

function changeColor() {
	colorIndex = colorIndex + 1;

	if (colorIndex > 10)
		colorIndex = 1;

	if (colorIndex === 1) {
		colorSec = "#28ABE1";
	} else if (colorIndex === 2) {
		colorSec = "#43DA8A";
	} else if (colorIndex === 3) {
		colorSec = "#FFC107";
	} else if (colorIndex === 4) {
		colorSec = "#99CC00";
	} else if (colorIndex === 5) {
		colorSec = "#CC67F3";
	} else if (colorIndex === 6) {
		colorSec = "#D31A00";
	} else if (colorIndex === 7) {
		colorSec = "#C3C3C3";
	} else if (colorIndex === 8) {
		colorSec = "#E9E067";
	} else if (colorIndex === 9) {
		colorSec = "#F26520";
	} else if (colorIndex === 10) {
		colorSec = "#a200ff";
	}

	saveColorStorage(colorSec);
}

function changeBGImage() {
	try{
    bgIndex = bgIndex + 1;

    if (bgIndex === 9)
        bgIndex = 0;

    setBGImage();
	}
	catch(e){
		console.log("error: " + e);
	}
}

function setBGImage() {
    var colorBg = "#000000";
    if (bgIndex === 0) {
        colorBg = "#000000"            
    } else if (bgIndex === 1) {
        colorBg = "#666666";
    } else if (bgIndex === 2) {
        colorBg = "#053A5C";
    } else if (bgIndex === 3) {
        colorBg = "#435C57";
    } else if (bgIndex === 4) {
        colorBg = "#65633D";
    } else if (bgIndex === 5) {
        colorBg = "#5E425E";
    } else if (bgIndex === 6) {
        colorBg = "#732D45";
    } else if (bgIndex === 7) {
        colorBg = "#6C4833";
    } else if (bgIndex === 8) {
        colorBg = "#793926";
    }

    if(playId < 1)
    	canvas.style.background = colorBg;
    else   	
    canvas.style.background = '-webkit-radial-gradient(' + colorBg + ' 30%, black 70%)';
    //canvas.style.background = colorBg;
    saveBGColorStorage(colorBg);
}




function changeTempUnit() {
	if (tempUnit === 0)
		tempUnit = 1;
	else
		tempUnit = 0;
}

function changeTempUnit(unit) {
	tempUnit = unit;
}

function changePlay() {
	playId = playId + 1;

	if (playId > 1)
		playId = 0;

	if (playId < 1) {
		document.getElementById('imgWeatherIcon').style.visibility = 'hidden';
		document.getElementById('imgHrHist').style.visibility = 'hidden';
		
	} else {
		document.getElementById('imgWeatherIcon').style.visibility = 'visible';
		document.getElementById('imgHrHist').style.visibility = 'visible';
		
	}
	
	setBGImage();
	
	showMenu();
	showMenu();

}

function refreshWeather() {
	lastFetch = tizen.time.getCurrentDateTime();
	fetch();
}

function renderShowDigitalTime(hour, minute, seconds, ampm) {

	context.beginPath();
	context.lineJoin = "round";

	context.font = '100px serif';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = colorSec;

	if (timeformat === "0") {
		context.fillText(hour + ":" + minute, canvas.width * 5 / 10,
				canvas.height * 5 / 10);

		context.font = '40px monospace';
		context.fillStyle = "#D6D7D6";
		context.fillText(seconds, canvas.width * 7.9 / 10,
				canvas.height * 3 / 10);

		context.font = '25px monospace';
		context.fillText(ampm, canvas.width * 2 / 10, canvas.height * 3 / 10);
	} else {
		context.fillText(hour + ":" + minute, canvas.width * 5 / 10,
				canvas.height * 5 / 10);
		context.font = '40px monospace';
		context.fillStyle = "#D6D7D6";

		context.fillText(seconds, canvas.width * 7.9 / 10,
				canvas.height * 3 / 10);
	}

	context.closePath();

}

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

		    context.arc(canvas.width * 5 / 10, canvas.height * 7.5 / 10, outerradius, 0, Math.PI * 2, false);
		    //context.stroke();
		    context.fill();
		    context.closePath();

		    context.beginPath();
		    context.font = '22px monospace';
		    context.textAlign = 'center';
		    context.textBaseline = 'middle';
		    context.fillStyle = '#CCCCCC';

		    context.fillText(sDay, canvas.width * 5 / 10, canvas.height * 6.8 / 10);
		    context.closePath();

		    context.beginPath();
		    context.font = '30px monospace';
		    context.textAlign = 'center';
		    context.textBaseline = 'middle';
		    context.fillStyle = '#FFFFFF';

		    context.fillText(dateofMonth, canvas.width * 5 / 10, canvas.height * 7.5 / 10);
		    context.closePath();

		    context.beginPath();
		    context.font = '20px monospace';
		    context.textAlign = 'center';
		    context.textBaseline = 'middle';
		    context.fillStyle = '#999999';

		    context.fillText(sMonth, canvas.width * 5 / 10, canvas.height * 8.2 / 10);
		    context.closePath();

		}

		context.restore();
	} catch (error) {
		console.log("Error in showMonth:" + error);
	}

}

function showBrand() {

	context.beginPath();

	context.fillStyle = "#999999";
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	// context.font = '15px italic monospace';
	context.font = "italic bold 15px monospace";

	context.fillText("Xpressions", (canvas.width * 0.5), (canvas.height * 0.15));

	context.fill();
	context.closePath();
}

function renderShowAdvanced() {

	
	context.beginPath();
	context.fillStyle = '#111111';
	context.strokeStyle = '#222222';
	context.arc(canvas.width * 3 / 10, canvas.height * 7.5 / 10,
			clockRadiusX * 0.2, 0, Math.PI * 2, false);
	context.stroke();
	context.fill();
	context.closePath();

	context.beginPath();
	context.fillStyle = '#111111';
	context.strokeStyle = '#222222';
	context.arc(canvas.width * 7 / 10, canvas.height * 7.5 / 10,
			clockRadiusX * 0.2, 0, Math.PI * 2, false);
	context.stroke();
	context.fill();
	context.closePath();



	// Weather Start
	// --------------------------------------------------------

	var c = document.getElementById("imgWeatherIcon");

	c.style.visibility = 'visible';

	context.beginPath();
	context.fillStyle = '#FFFFFF';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '20px monospace';
	
	if (temperatureId != null && temperatureId != "") {
		c.src = "icons\\" + temperatureId + ".png";
		
		if (tempUnit === 0) {
			context.fillText(temperatureInCel + "\u2103",
					canvas.width * 3 / 10, canvas.height * 7.5 / 10);
		} else {
			context.fillText(temperatureInFah + "\u2109",
					canvas.width * 3 / 10, canvas.height * 7.5 / 10);
		}
	} else {
		c.src = "icons\\noconnection.png";
		context.fillText("...",
				canvas.width * 3 / 10, canvas.height * 7.5 / 10);
	}
	context.fill();
	context.closePath();
	// Weather End



	document.getElementById('imgHrHist').style.visibility = 'visible';

	context.beginPath();
	context.fillStyle = '#D6D7D6';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '20px monospace';
	context.fillText(heartRate, canvas.width * 7 / 10,
			canvas.height * 7.5 / 10);
	context.fill();
	context.closePath();

	context.beginPath();
	context.font = '14px monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#999999';
	context.fillText("bpm", canvas.width * 7 / 10, canvas.height * 8 / 10);
	context.closePath();

}

function renderDigitalTime(hour, minute, day, dateOfMonth, month, seconds) {
	'use strict';
	try {
		// context.save();

		// Assigns the clock creation location in the middle of the canvas
		context.translate(-canvas.width / 2, -canvas.height / 2);

		if (minute < 10) {
			minute = "0" + minute;
		}

		var ampm = "AM", sDay = "Test", sMonth = "", outerradius, twentyfourhourangle, twentyfourhourradius, twentyfourhour, twentyfourminute, secondsangle;
		secondsangle = (seconds - 15) * (Math.PI * 2) / 60;
		twentyfourhour = hour;
		twentyfourminute = minute;
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

		if (seconds < 10)
			seconds = "0" + seconds;

		if (playId === 0) {
			renderShowDigitalTime(hour, minute, seconds, ampm);

			
			return;
		} else if (playId === 1) {
			renderShowDigitalTime(hour, minute, seconds, ampm);

			renderShowMonth(month, day, dateOfMonth);

			showBrand();

			renderShowAdvanced();
			
			
			return;
		} 
		
	} catch (error) {
		console.log('Error in renderDigitalTime' + error);
	}
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
			.getCurrentDateTime().getMonth(), nextMove = 800;

	// var battery = tizen.systeminfo.
	// Erase the previous time
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	//setBGImage();
	context.save();

	// Assigns the clock creation location in the middle of the canvas
	// context.translate(canvas.width / 2, canvas.height / 2);

	renderBattery(battery);

	renderDots(seconds);

	renderDigitalTime(hours, minutes, day, dateOfMonth, month, seconds);

	 renderSecondNeedle(seconds);
	 renderHourNeedle(hour);
	 renderMinuteNeedle(minute);

	// On midnight reset steps automatically
	

	try {
		// console.log("Get Current Date Time ");
		var now = tizen.time.getCurrentDateTime();

		// console.log("Get Current Date Time: " + now);

		if (lastFetch === 0) {
			lastFetch = tizen.time.getCurrentDateTime().addDuration(
					new tizen.TimeDuration(-1, "MSECS"));
		}

		// console.log("lastFetch :" + lastFetch);
		var timeDiff = now.difference(lastFetch);

		// console.log("fetchAtleastOnce :" + fetchAtleastOnce);
		if (minutes === 0 && seconds < 1) {
			fetchAtleastOnce = 1;
			fetch();
		} else if (fetchAtleastOnce < 1) {
			fetchAtleastOnce = 1;
			fetch();
		} else if (timeDiff.greaterThan(new tizen.TimeDuration(59, "MINS"))) {
			lastFetch = tizen.time.getCurrentDateTime().addDuration(
					new tizen.TimeDuration(-1, "MSECS"));
			fetch();
		}
	} catch (error) {
		console.error('Exception' + error);
	}
	context.restore();

	setTimeout(function() {
		window.requestAnimationFrame(watch);
	}, nextMove);

}

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

function swapTimeFormat() {
	if (timeformat === "0") {
		timeformat = "1"; // 24 hr
	} else if (timeformat === "1") {
		timeformat = "0"; // 12 hr
	}
}

function swapTimeFormat(format) {
	
	timeformat = format; // 12 hr

}

function onchangedCB(hrmInfo) {
	if (hrmInfo.heartRate > 0) {
		heartRate = hrmInfo.heartRate;
	} else {
		heartRate = "...";
	}
}

function calculateHeartRate() {
	try {
		if (bHRON === 0) {
			document.getElementById('imgHr').style.visibility = 'hidden';

			window.webapis.motion.start("HRM", onchangedCB);
			bHRON = 1;

			setTimeout(function() {
				window.requestAnimationFrame(stopHeartRate());
			}, 25000);

			showMenu();
		}
	} catch (err) {
		console.error(err);
	}
}



function stopHeartRate() {
	try {
		console.log("Stopping Heart Rate...");

		window.webapis.motion.stop("HRM");
		bHRON = 0;

		document.getElementById('imgHr').style.visibility = 'hidden';

		clearTimeout(function() {
			window.requestAnimationFrame(stopHeartRate());
		});
	} catch (error) {
		console.log("Stop Heart Rate error " + error);
	}
}

function showMenu() {

	if (document.getElementById('menu').style.visibility == 'visible') {
		document.getElementById('menu').style.visibility = 'hidden';

		if (playId === 0 ) {

			document.getElementById('img4').style.visibility = 'hidden';
			document.getElementById('img5').style.visibility = 'hidden';
			document.getElementById('imgTemp').style.visibility = 'hidden';
			document.getElementById('imgWeatherRefresh').style.visibility = 'hidden';

			document.getElementById('imgWeatherIcon').style.visibility = 'hidden';
			document.getElementById('imgHrHist').style.visibility = 'hidden';
			

		} else {
			document.getElementById('img4').style.visibility = 'hidden';
			document.getElementById('img5').style.visibility = 'hidden';
			document.getElementById('imgTemp').style.visibility = 'hidden';
			document.getElementById('imgWeatherRefresh').style.visibility = 'hidden';

		}

	} else {
		document.getElementById('menu').style.visibility = 'visible';

		if (playId === 0 ) {

			document.getElementById('img4').style.visibility = 'hidden';
			document.getElementById('img5').style.visibility = 'visible';
			document.getElementById('imgTemp').style.visibility = 'hidden';
			document.getElementById('imgWeatherRefresh').style.visibility = 'hidden';

			document.getElementById('imgWeatherIcon').style.visibility = 'hidden';
			document.getElementById('imgHrHist').style.visibility = 'hidden';
			

		} else {
			document.getElementById('img4').style.visibility = 'visible';
			document.getElementById('img5').style.visibility = 'visible';
			document.getElementById('imgTemp').style.visibility = 'visible';
			document.getElementById('imgWeatherRefresh').style.visibility = 'visible';

		}

		setTimeout(function() {
			window.requestAnimationFrame(closeMenu());
		}, 40000);
	}

}

function closeMenu() {
	if (document.getElementById('menu').style.visibility == 'visible') {
		document.getElementById('menu').style.visibility = 'hidden';

		document.getElementById('img4').style.visibility = 'hidden';
		document.getElementById('img5').style.visibility = 'hidden';
		document.getElementById('imgTemp').style.visibility = 'hidden';
		document.getElementById('imgWeatherRefresh').style.visibility = 'hidden';
	}

	clearTimeout(function() {
		window.requestAnimationFrame(closeMenu());
	});
}

// -------------------Database Local Web Storage----------------------------

function saveColorStorage(data) {
	var key = savedColorSelectionKey;
	// var data = data;

	// localStorage setItem
	if ("localStorage" in window) {
		localStorage.setItem(key, data);
		// location.reload();
	} else {
		console.error("no localStorage in window");
	}

	// sessionStorage setItem
	// if ("sessionStorage" in window) {
	// sessionStorage.setItem(key.value, data.value);
	// location.reload();
	// } else {
	// alert("no sessionStorage in window");
	// }
}

function saveBGColorStorage(data) {
    var key = savedBGColorSelectionKey;
    // var data = data;

    // localStorage setItem
    if ("localStorage" in window) {
        localStorage.setItem(key, data);
        // location.reload();
    } else {
        console.error("no localStorage in window");
    }

    // sessionStorage setItem
    // if ("sessionStorage" in window) {
    // sessionStorage.setItem(key.value, data.value);
    // location.reload();
    // } else {
    // alert("no sessionStorage in window");
    // }
}



function removeStorage() {
	var key = document.getElementById('removeKey');

	// localStorage removeItem
	if ("localStorage" in window) {
		if (localStorage.length > 0) {
			localStorage.removeItem(key.value);
			location.reload();
		}
	} else {
		alert("no localStorage in window");
	}

	// sessionStorage removeItem
	// if ("sessionStorage" in window) {
	// if (sessionStorage.length > 0) {
	// sessionStorage.removeItem(key.value);
	// location.reload();
	// }
	// } else {
	// alert("no sessionStorage in window");
	// }
}

function clearStorage() {
	// localStorage clear
	if ("localStorage" in window) {
		if (localStorage.length > 0) {
			localStorage.clear();
			location.reload();
		}
	} else {
		alert("no localStorage in window");
	}

	// sessionStorage clear
	// if ("sessionStorage" in window) {
	// if (sessionStorage.length > 0) {
	// sessionStorage.clear();
	// location.reload();
	// }
	// } else {
	// alert("no sessionStorage in window");
	// }
}

// -----------------------------End-----------------------------------------

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

	timeformat = "0"; // 12Hr

	/*
	 * window.addEventListener('visibilitychange', function(e) { try {
	 * console.log("Visibility changed to " + e); if (pedoFlag === 1) { if
	 * (document.visibilityState === 'visible') { console.log("Visible"); try {
	 * pedometer.start(PEDO_CONTEXT_TYPE, function onSuccess( pedometerInfo) {
	 * handlePedometerInfo(pedometerInfo, 'pedometer.change'); }); } catch
	 * (Exception) { } } else { console.log("Hidden"); stopPedo(); } } } catch
	 * (err) { console.error('Error: ', err.message); } }, true);
	 */

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
            canvas.style.background = '-webkit-radial-gradient(' + colorBGValue + ' 30%, black 70%)';        	
            console.log("Color saved is:" + colorBGValue);
        } else {
            console.log("Color NOT saved");
        }

		
		getBattery();
	} catch (error) {
		console.error("Error while loading: " + error);
	}

	if (bHRON === 0) {
		document.getElementById('imgHrHist').style.visibility = 'hidden';

		window.webapis.motion.start("HRM", onchangedCB);
		bHRON = 1;

		setTimeout(function() {
			window.requestAnimationFrame(stopHeartRate());
		}, 25000);
	}

	

	connect();

	window.requestAnimationFrame(watch);

};
