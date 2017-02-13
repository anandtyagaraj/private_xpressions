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

#include <tizen.h>
#include <sap.h>
#include <json-glib/json-glib.h>
#include <app.h>
#include <stdio.h>
#include <stdlib.h>
#include "data.h"
#include "log.h"

data_s *data_e;
char file_path[256] = {0,};
Data_changed_cb _widget_changed_cb;
void* data_cb_user_data = NULL;

static const char* _get_string_from_json_obj(JsonObject* obj, const char* name)
{
        char *value = NULL;
        if (json_object_has_member(obj, name))
                value = (char *)json_object_get_string_member(obj,name);
        return value;
}

JsonObject* _get_json_obj(char *buffer)
{
	JsonParser* parser = json_parser_new();
	json_parser_load_from_data(parser, buffer, strlen(buffer), NULL);
	JsonNode *rootnode = json_parser_get_root(parser);
	JsonObject* objnode = json_node_get_object(rootnode);

	return objnode;
}

void sap_data_received(char *buffer)
{
	FILE *fp = NULL;
	JsonObject* objnode = _get_json_obj(buffer);
	const char* delete_city = _get_string_from_json_obj(objnode, "delete_city");

	if(data_e->delete_city != NULL){
		free(data_e->delete_city);
		data_e->delete_city = NULL;
	}
	if(delete_city != NULL){
		data_e->delete_city = strdup(delete_city);
	}

	if(delete_city != NULL && strcmp(delete_city, "delete_city") == 0) {
		if(!data_e->delete_city)
			data_e->delete_city = strdup(delete_city);
		if(data_e->city_text)
			free(data_e->city_text);
		data_e->city_text = NULL;
	}else{
		if(data_e->delete_city) {
			free(data_e->delete_city);
			data_e->delete_city = NULL;
		}

		const char* time_text = _get_string_from_json_obj(objnode, "time_text");
		const char* city_text = _get_string_from_json_obj(objnode, "city_text");
		const char* current_temperature = _get_string_from_json_obj(objnode, "current_temperature");
		const char* day_temperature = _get_string_from_json_obj(objnode, "day_temperature");

		if(data_e->time_text)
			free(data_e->time_text);
		data_e->time_text = strdup(time_text);

		if(data_e->city_text)
			free(data_e->city_text);
		data_e->city_text = strdup(city_text);

		if(data_e->current_temperature)
			free(data_e->current_temperature);
		data_e->current_temperature = strdup(current_temperature);

		if(data_e->day_temperature)
			free(data_e->day_temperature);
		data_e->day_temperature = strdup(day_temperature);
	}

	LOGI("filePath : %s", file_path);
	fp = fopen(file_path,"w");
	if(fp) {
		LOGI("buffer : %s", buffer);
		fwrite(buffer,1,strlen(buffer),fp);
		fclose(fp);
	}
	if(_widget_changed_cb)
		_widget_changed_cb(data_cb_user_data);

	g_object_unref(objnode);
}

void data_initialize()
{
	/*
	 * If you need to initialize managing data,
	 * please use this function.
	 */

	char *data_path = NULL;
	FILE *fp = NULL;
	char buf[1024] = {0,};

	data_e = (data_s*) malloc(sizeof(data_s));

	data_e->city_text = NULL;
	data_e->current_temperature = NULL;
	data_e->day_temperature = NULL;
	data_e->delete_city = NULL;
	data_e->time_text = NULL;

	initialize_sap();
	data_path = app_get_data_path();
	sprintf(file_path,"%s%s",data_path,"data.txt");

	fp = fopen(file_path,"r");
	if(!fp) {
		LOGI("file_path : %s", file_path);
	}else{
		fread(buf, sizeof(buf), 1, fp);
		fclose(fp);
		if(strlen(buf)!=0)
			sap_data_received(buf);
	}
	set_sap_data_receive_callback(sap_data_received);
}

void data_finalize()
{
	/*
	 * If you need to finalize managing data,
	 * please use this function.
	 */
}

void data_set_change_cb(Data_changed_cb func, void* user_data)
{
	_widget_changed_cb = func;
	data_cb_user_data = user_data;
}

const char *data_get_delete_city(void)
{
	/*
	 * You can use this function to retrieve data.
	 */
	return data_e->delete_city;
}

const char *data_get_time_text(void)
{
	/*
	 * You can use this function to retrieve data.
	 */
	return data_e->time_text;
}

const char *data_get_city_text(void)
{
	/*
	 * You can use this function to retrieve data.
	 */
	return data_e->city_text;
}

const char *data_get_current_temperature(void)
{
	/*
	 * You can use this function to retrieve data.
	 */
	return data_e->current_temperature;
}

const char *data_get_day_temperature(void)
{
	/*
	 * You can use this function to retrieve data.
	 */
	return data_e->day_temperature;
}





