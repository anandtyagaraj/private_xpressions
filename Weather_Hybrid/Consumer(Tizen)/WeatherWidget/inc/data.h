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

#ifndef DATA_H_
#define DATA_H_

#include <glib.h>

#define PROFILE_ID "/sample/weatherwidget"
#define CHANNELID 1000

typedef struct data{
	char* delete_city;
	char* time_text;
	char* city_text;
	char* current_temperature;
	char* day_temperature;
} data_s;

typedef void         (*Data_changed_cb)          (void* user_data);
typedef void         (*Widget_Sap_Received_Cb)          (char *message);

void data_initialize();
void data_finalize();
void data_set_change_cb(Data_changed_cb func, void* user_data);
const char *data_get_delete_city(void);
const char *data_get_time_text(void);
const char *data_get_city_text(void);
const char *data_get_current_temperature(void);
const char *data_get_day_temperature(void);

void initialize_sap();
gboolean sap_send_data(char *message);
gboolean sap_request_service_connection(void);
void set_sap_data_receive_callback(Widget_Sap_Received_Cb func);

#endif /* DATA_H_ */
