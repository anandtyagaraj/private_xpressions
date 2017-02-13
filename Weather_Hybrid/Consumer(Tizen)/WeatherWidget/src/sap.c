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

#include <glib.h>
#include <stdlib.h>
#include <stdio.h>
#include "sap.h"
#include "log.h"
#include "data.h"

struct priv {
	sap_agent_h agent;
	sap_socket_h socket;
	sap_peer_agent_h peer_agent;
};

static gboolean agent_created = FALSE;
static Widget_Sap_Received_Cb receivedCb = NULL;
static struct priv priv_data = { 0 };

void on_peer_agent_updated(sap_peer_agent_h peer_agent,
			   sap_peer_agent_status_e peer_status,
			   sap_peer_agent_found_result_e result,
			   void *user_data)
{
	switch (result) {
	case SAP_PEER_AGENT_FOUND_RESULT_DEVICE_NOT_CONNECTED:
		LOGI("device is not connected");
		break;

	case SAP_PEER_AGENT_FOUND_RESULT_FOUND:
		if (peer_status == SAP_PEER_AGENT_STATUS_AVAILABLE) {
			priv_data.peer_agent = peer_agent;
			LOGI("Find Peer Success!!");
			sap_request_service_connection();
		} else {
			LOGI("peer agent removed");
			sap_peer_agent_destroy(peer_agent);
		}
		break;

	case SAP_PEER_AGENT_FOUND_RESULT_SERVICE_NOT_FOUND:
		LOGI("service not found");
		break;

	case SAP_PEER_AGENT_FOUND_RESULT_TIMEDOUT:
		LOGI("peer agent find timed out");
		break;

	case SAP_PEER_AGENT_FOUND_RESULT_INTERNAL_ERROR:
		LOGI("peer agent find search failed");
		break;
	}
}


static void on_service_connection_terminated(sap_peer_agent_h peer_agent,
					     sap_socket_h socket,
					     sap_service_connection_terminated_reason_e result,
					     void *user_data)
{
	switch (result) {
	case SAP_CONNECTION_TERMINATED_REASON_PEER_DISCONNECTED:
		LOGI("disconnected because peer lost");
		LOGI("Peer Disconnected");
		break;

	case SAP_CONNECTION_TERMINATED_REASON_DEVICE_DETACHED:
		LOGI("disconnected because device is detached");
		LOGI("Disconnected Device Detached");
		break;

	case SAP_CONNECTION_TERMINATED_REASON_UNKNOWN:
		LOGI("disconnected because of unknown reason");
		LOGI("Disconnected Unknown Reason");
		break;
	}

	sap_socket_destroy(priv_data.socket);
	priv_data.socket = NULL;

	LOGI("status:%d", result);
}


static void on_data_recieved(sap_socket_h socket,
			     unsigned short int channel_id,
			     unsigned int payload_length,
			     void *buffer,
			     void *user_data)
{

	char* receivedData;
	receivedData = (char*) malloc(payload_length + 1);
	strncpy(receivedData, buffer, payload_length);
	receivedData[payload_length] = '\0';
	LOGI("received data: %s, len:%d", receivedData, payload_length);
	LOGI("len:%d", payload_length);
	if(receivedCb != NULL){
		receivedCb(receivedData);
	}
	if(receivedData != NULL){
		free(receivedData);
	}
}

void set_sap_data_receive_callback(Widget_Sap_Received_Cb func)
{
	receivedCb = func;
}

static void on_service_connection_created(sap_peer_agent_h peer_agent,
					  sap_socket_h socket,
					  sap_service_connection_result_e result,
					  void *user_data)
{
	switch (result) {
	case SAP_CONNECTION_SUCCESS:
		LOGI("peer agent connection is successful, pa :%u", peer_agent);
		sap_peer_agent_set_service_connection_terminated_cb(priv_data.peer_agent,
								    on_service_connection_terminated,
								    NULL);

		sap_socket_set_data_received_cb(socket, on_data_recieved, peer_agent);
		priv_data.socket = socket;
		LOGI("Connection Established");
		break;

	case SAP_CONNECTION_ALREADY_EXIST:
		LOGI("connection is already exist");
		priv_data.socket = socket;
		LOGI("Connection already exist");
		break;

	case SAP_CONNECTION_FAILURE_DEVICE_UNREACHABLE:
		LOGI("device is not unreachable");
		LOGI("Device Not Reachable");
		break;

	case SAP_CONNECTION_FAILURE_INVALID_PEERAGENT:
		LOGI("invalid peer agent");
		LOGI("Invalid Peer Agent");
		break;

	case SAP_CONNECTION_FAILURE_NETWORK:
		LOGI("network failure");
		LOGI("Network Failure");
		break;

	case SAP_CONNECTION_FAILURE_PEERAGENT_NO_RESPONSE:
		LOGI("peer agent is no response");
		LOGI("PEERAGENT_NO_RESPONSE");
		break;

	case SAP_CONNECTION_FAILURE_PEERAGENT_REJECTED:
		LOGI("peer agent is rejected");
		LOGI("PEERAGENT_REJECTED");
		break;

	case SAP_CONNECTION_FAILURE_UNKNOWN:
		LOGI("unknown error");
		LOGI("UNKNOWN_ERROR");
		break;
	}
}

static gboolean _create_service_connection(gpointer user_data)
{
	struct priv *priv = NULL;
	sap_result_e result = SAP_RESULT_FAILURE;

	priv = (struct priv *)user_data;
	result = sap_agent_request_service_connection(priv->agent,
						      priv->peer_agent,
						      on_service_connection_created,
						      NULL);

	if (result == SAP_RESULT_SUCCESS) {
		LOGI("req service conn call succeeded");
	} else {
		LOGI("Connection Establishment Failed");
		LOGI("req service conn call is failed (%d)", result);
	}

	return FALSE;
}

gboolean sap_request_service_connection(void)
{
	g_idle_add(_create_service_connection, &priv_data);

	LOGI("sap_request_service_connection call over");
	return TRUE;
}

static gboolean _terminate_service_connection(gpointer user_data)
{
	struct priv *priv = NULL;
	sap_result_e result = SAP_RESULT_FAILURE;

	priv = (struct priv *)user_data;

	if (priv->socket)
		result = sap_peer_agent_terminate_service_connection(priv->peer_agent);
	else {
		LOGI("No service Connection");
		return FALSE;
	}
	LOGI("Result %d", result);

	if (result == SAP_RESULT_SUCCESS) {
		LOGI("Connection Terminated");
		LOGI("req service conn call succeeded");
	} else {
		LOGI("Connection Termination Failed");
		LOGI("req service conn call is failed (%d)", result);
	}

	return FALSE;
}

gboolean terminate_service_connection(void)
{
	g_idle_add(_terminate_service_connection, &priv_data);
	return TRUE;
}

static gboolean _find_peer_agent(gpointer user_data)
{
	struct priv *priv = NULL;
	sap_result_e result = SAP_RESULT_FAILURE;

	priv = (struct priv *)user_data;

	result = sap_agent_find_peer_agent(priv->agent, on_peer_agent_updated, NULL);

	if (result == SAP_RESULT_SUCCESS) {
		LOGI("find peer call succeeded");
	} else {
		LOGI("findsap_peer_agent_s is failed (%d)", result);
	}

	LOGE("find peer call is over");

	return FALSE;
}

gboolean find_peers()
{
	g_idle_add(_find_peer_agent, &priv_data);
	LOGI("find peer called");
	return TRUE;

}

gboolean sap_send_data(char *message)
{
	int result;
	if (priv_data.socket) {
		LOGI("Sending data : %s", message);
		result = sap_socket_send_data(priv_data.socket, CHANNELID, strlen(message), message);
	} else {
		LOGI("No service Connection");
		return FALSE;
	}
	return TRUE;

}

static void on_agent_initialized(sap_agent_h agent,
				 sap_agent_initialized_result_e result,
				 void *user_data)
{
	switch (result) {
	case SAP_AGENT_INITIALIZED_RESULT_SUCCESS:
		LOGI("agent is initialized");

		priv_data.agent = agent;
		agent_created = TRUE;
		break;

	case SAP_AGENT_INITIALIZED_RESULT_DUPLICATED:
		LOGI("duplicate registration");
		break;

	case SAP_AGENT_INITIALIZED_RESULT_INVALID_ARGUMENTS:
		LOGI("invalid arguments");
		break;

	case SAP_AGENT_INITIALIZED_RESULT_INTERNAL_ERROR:
		LOGI("internal sap error");
		break;

	default:
		LOGI("unknown status (%d)", result);
		break;
	}

	LOGI("agent initialized callback is over");

}

static void on_device_status_changed(sap_device_status_e status, sap_transport_type_e transport_type,
				     void *user_data)
{
	switch (transport_type) {
	case SAP_TRANSPORT_TYPE_BT:
		LOGI("connectivity type(%d): bt", transport_type);
		break;

	case SAP_TRANSPORT_TYPE_BLE:
		LOGI("connectivity type(%d): ble", transport_type);
		break;

	case SAP_TRANSPORT_TYPE_TCP:
		LOGI("connectivity type(%d): tcp/ip", transport_type);
		break;

	case SAP_TRANSPORT_TYPE_USB:
		LOGI("connectivity type(%d): usb", transport_type);
		break;

	case SAP_TRANSPORT_TYPE_MOBILE:
		LOGI("connectivity type(%d): mobile", transport_type);
		break;

	default:
		LOGI("unknown connectivity type (%d)", transport_type);
		break;
	}

	switch (status) {
	case SAP_DEVICE_STATUS_DETACHED:

		if (priv_data.peer_agent) {
			sap_socket_destroy(priv_data.socket);
			priv_data.socket = NULL;
			sap_peer_agent_destroy(priv_data.peer_agent);
			priv_data.peer_agent = NULL;
		}
		break;

	case SAP_DEVICE_STATUS_ATTACHED:
		if (agent_created) {
			g_idle_add(_find_peer_agent, &priv_data);
		}
		break;

	default:
		LOGI("unknown status (%d)", status);
		break;
	}

}

gboolean agent_initialize()
{
	int result = 0;

	do {
		result = sap_agent_initialize(priv_data.agent, PROFILE_ID, SAP_AGENT_ROLE_CONSUMER,
					      on_agent_initialized, NULL);
		LOGI("SAP >>> getRegisteredServiceAgent() >>> %d", result);
	} while (result != SAP_RESULT_SUCCESS);

	return TRUE;
}

void initialize_sap()
{
	sap_agent_h agent = NULL;

	sap_agent_create(&agent);

	if (agent == NULL)
		LOGI("ERROR in creating agent");
	else
		LOGE("SUCCESSFULLY create sap agent");

	priv_data.agent = agent;

	sap_set_device_status_changed_cb(on_device_status_changed, NULL);

	agent_initialize();
	find_peers();
}
