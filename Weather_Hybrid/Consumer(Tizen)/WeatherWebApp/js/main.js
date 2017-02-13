/*
 * Copyright (c) 2014 Samsung Electronics Co., Ltd.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 *        notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 *       copyright notice, this list of conditions and the following disclaimer
 *       in the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Samsung Electronics Co., Ltd. nor the names of its
 *       contributors may be used to endorse or promote products derived from
 *       this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var SAAgent = 0;
var SASocket = 0;
var CHANNELID = 2000;
var providerAppName = "WeatherProvider";
var widgetAppName = "VbsgE6bms2.weatherwidget";
var fileName = "data.txt";

function showdata(str) {
	var obj = JSON.parse(str),
		html = [],
		displaySection = document.getElementById("content");
	html.push("<li class=\"list-group-item\">", obj.time_text, "</li>",
			"<li class=\"list-group-item\">", obj.city_text, "</li>",
			"<li class=\"list-group-item\">", obj.current_temperature, "</li>",
			"<li class=\"list-group-item\">", obj.day_temperature , "</li>");

	displaySection.innerHTML = "<ul class=\"list-group\">" + html.join("") + "</ul>";
}

function readfile(city) {
	var file;
	tizen.filesystem.resolve(
		'wgt-private', 
		function(dir){
			try {
				file = dir.resolve(fileName);
				file.readAsText(
					function(str){
						console.log("Read file >> " + str);
						// Show data
						var obj = JSON.parse(str),
							html = [],
							displaySection = document.getElementById("content");
						html.push("<li class=\"list-group-item\">", obj.time_text, "</li>",
								"<li class=\"list-group-item\">", city, "</li>",	// from widget
								"<li class=\"list-group-item\">", obj.current_temperature, "</li>",
								"<li class=\"list-group-item\">", obj.day_temperature , "</li>");
						displaySection.innerHTML = "<ul class=\"list-group\">" + html.join("") + "</ul>";						
					}, function(e){
						console.log("Error " + e.message);
					}, "UTF-8"
				);
			} catch(err) {
				console.log("Error" + err.message);
			}
		},
		function(e){ console.log("Error" + e.message);},
		"rw" 
	);
}

function onerror(err) {
	console.log("err [" + err + "]");
}

var agentCallback = {
		onconnect : function(socket) {
			SASocket = socket;
			SASocket.setSocketStatusListener(function(reason){
				console.log("Service connection lost, Reason : [" + reason + "]");
				disconnect();
			});
			SASocket.setDataReceiveListener(onreceive);
			console.log("Sending request .......");
			SASocket.sendData(CHANNELID, "request");	// request the provider to get weather info
		},
		onerror : onerror
};

var peerAgentFindCallback = {
		onpeeragentfound : function(peerAgent) {
			try {
				if (peerAgent.appName == providerAppName) {
					SAAgent.setServiceConnectionListener(agentCallback);
					SAAgent.requestServiceConnection(peerAgent);
				} else {
					console.log("Not expected app!! : " + peerAgent.appName);
				}
			} catch(err) {
				console.log("exception [" + err.name + "] msg[" + err.message + "]");
			}
		},
		onerror : onerror
};

function onsuccess(agents) {
	try {
		console.log("Connect successfully");
		if (agents.length > 0) {
			SAAgent = agents[0];

			SAAgent.setPeerAgentFindListener(peerAgentFindCallback);
			SAAgent.findPeerAgents();
		} else {
			console.log("Not found SAAgent!!");
		}
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function connect() {
	if (SASocket) {
		console.log("Already connected!");
		return false;
	}
	try {
		webapis.sa.requestSAAgent(onsuccess, function (err) {
			console.log("err [" + err.name + "] msg[" + err.message + "]");
		});
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function disconnect() {
	try {
		if (SASocket != null) {
			SASocket.close();
			SASocket = null;
			console.log("closeConnection");
		}
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function onreceive(channelId, data) {
	console.log("received data: " + data);
	// Show latest data
	showdata(data);
	// Write data to the file
	var file;
	tizen.filesystem.resolve(
		'wgt-private', 
		function(dir) { 
			file = dir.resolve(fileName);
			file.openStream(
				"w",
				function(fs) {
					console.log("Write received data to the file");
					fs.write(data);
					fs.close();
				}, function(err) {
					console.log("Error " + err.message);
				}, "UTF-8"
			);
		},
		function(e){ console.log("Error" + e.message);},
	"rw");
}

window.onload = function () {
	// Get caller AppID
	var reqAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();
	if (reqAppControl && reqAppControl.callerAppId && reqAppControl.callerAppId == widgetAppName) {
		console.log("Launched by the widget.");
		if (reqAppControl.appControl.data[0].key == "city") {
			console.log("city from widget: " + reqAppControl.appControl.data[0].value);
			readfile(reqAppControl.appControl.data[0].value);	// Show latest data with received city
		}
	} else {
		// Create a file
		var file;
		tizen.filesystem.resolve('wgt-private',
			function(dir){
				try {
					file = dir.resolve(fileName);
				} catch(err) {
					file = dir.createFile(fileName);
				}
			},
			function(e){ console.log("Error" + e.message);}, "rw" 
		);
		// Request weather data to the provider
		try {
			console.log("Try to get data from provider app");
			connect();
		} catch(err) {
			console.log("exception [" + err.name + "] msg[" + err.message + "]");
		}
	}

	// Add eventListener for tizenhwkey
	document.addEventListener('tizenhwkey', function(e) {
		if(e.keyName == "back") {
			tizen.application.getCurrentApplication().exit();
		}
	});
};