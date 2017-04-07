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
//	var c = document.getElementById("imgConnection");
//	c.src = "icons\\disconnected.png";
//	
//	temperatureId = "";
//	console.log("err [" + err + "]");
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
			console.log("Agent:" + agents[0]);

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
				case "TEXT_COLOR":changeColor(); break;
				case "BACK_COLOR":changeBGImage(); break;
				//case "12/24":swapTimeFormat(); break;
				//case "12":swapTimeFormat("0");break;
				//case "24":swapTimeFormat("1");break;
				//case "C/F":changeTempUnit(); break;
				//case "C":changeTempUnit(0); break;
				//case "F":changeTempUnit(1); break;
				case "Theme":changePlay(); break;
				//case "HR":calculateHeartRate(); break;
				
				}
			}
			else if(obj.temperatureId == undefined){
				steps = obj.steps;
				calories = obj.calories;
			}
			else{
				//temperatureId = obj.temperatureId;
//				temperatureInCel = obj.tempCel;
//				temperatureInFah = obj.tempFah;
//				console.log("Celcius: " + temperatureInCel);
//				console.log("Fah: " + temperatureInFah);
//				console.log("TempId: " + temperatureId);
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
