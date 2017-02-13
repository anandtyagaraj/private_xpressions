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
#include "log.h"
#include "data.h"
#include "view.h"

static Eina_List* widget_instance = NULL;

void widget_view_create(void* wid)
{
	LOGI("widget_view_create");
	if(wid == NULL){
		LOGE("wid is NULL");
	}
	const char* delete_city = data_get_delete_city();

	if(delete_city != NULL && strcmp(delete_city, "delete_city") == 0) {
		view_change_frame(wid, "sub_frame");
	}else{
		const char* time_text = data_get_time_text();
		const char* city_text = data_get_city_text();
		const char* current_temperature = data_get_current_temperature();
		const char* day_temperature = data_get_day_temperature();
		view_set_text(wid, "widget.main.top_text", time_text);
		view_set_text(wid, "widget.main.title", city_text);
		view_set_text(wid, "widget.main.main_text", current_temperature);
		view_set_text(wid, "widget.main.bottom_text", day_temperature);

		view_change_frame(wid, "main_view");
	}
}

void widget_data_changed_cb(void* user_data)
{
	Eina_List *l;
	void *data;

	EINA_LIST_FOREACH(widget_instance, l, data) {
		widget_view_create(data);
	}
}

static void clicked_cb(void *user_data)
{
	/**
	 * @note
	 * In this function, you launch the application.
	 */
	LOGI("Clicked");
	const char *cityText = data_get_city_text();
	if(cityText == NULL){
		sap_send_data("Add city");
	}else{
		app_control_h control;
		app_control_create(&control);
		app_control_set_app_id(control, "VbsgE6bms2.WeatherWebApp");
		app_control_add_extra_data(control, "city", cityText);
		app_control_send_launch_request(control,NULL,NULL);
		app_control_destroy(control);
	}
}

static int
widget_instance_create(widget_context_h context, bundle *content, int w, int h, void *user_data)
{
	void* wid = NULL;
	wid = (widget_instance_data_s*) malloc(sizeof(widget_instance_data_s));

	if (content != NULL) {
		/* Recover the previous status with the bundle object. */
	}

	wid = view_create(context, w, h);
	if (wid == NULL) {
		dlog_print(DLOG_ERROR, LOG_TAG, "failed to create a view.");
		return WIDGET_ERROR_FAULT;
	}
	view_set_image(wid, "widget.main.icon", "image/weather_icon.png");
	view_set_image(wid, "widget.sub_frame.main_icon", "image/widget_weather_no_city_icon.png");
	view_set_text(wid, "widget.sub_frame.main_text", "Add city");
	widget_view_create(wid);
	view_change_frame(wid, "sub_frame");

	/* Show window after base gui is set up */
	widget_app_context_set_tag(context, wid);
	data_set_change_cb(widget_data_changed_cb, wid);
	view_set_event_callback(wid, "widget.event", WIDGET_EVENT_CLICKED, (void *) clicked_cb);

	widget_instance = eina_list_append(widget_instance, wid);

	return WIDGET_ERROR_NONE;
}

static int
widget_instance_destroy(widget_context_h context, widget_app_destroy_type_e reason, bundle *content, void *user_data)
{
	if (reason == WIDGET_APP_DESTROY_TYPE_PERMANENT) {// User deleted this widget from the viewer
		sap_send_data("delete_widget");
	}

	void *wid = NULL;
	widget_app_context_get_tag(context, (void**) &wid);


	widget_instance = eina_list_remove(widget_instance, wid);
	view_destroy(wid);

	return WIDGET_ERROR_NONE;
}

static int
widget_instance_pause(widget_context_h context, void *user_data)
{
	/* Take necessary actions when widget instance becomes invisible. */
	return WIDGET_ERROR_NONE;

}

static int
widget_instance_resume(widget_context_h context, void *user_data)
{
	if(data_get_city_text() == NULL){
		sap_send_data("Add city");
	}else{
		sap_send_data("request");
	}
	return WIDGET_ERROR_NONE;
}

static int
widget_instance_update(widget_context_h context, bundle *content,
                             int force, void *user_data)
{
	/* Take necessary actions when widget instance should be updated. */
	return WIDGET_ERROR_NONE;
}

static int
widget_instance_resize(widget_context_h context, int w, int h, void *user_data)
{
	/* Take necessary actions when the size of widget instance was changed. */
	void *wid = NULL;

	widget_app_context_get_tag(context, (void**) &wid);
	view_resize(wid, w, h);

	return WIDGET_ERROR_NONE;
}

static void
widget_app_lang_changed(app_event_info_h event_info, void *user_data)
{
	/* APP_EVENT_LANGUAGE_CHANGED */
	char *locale = NULL;
	app_event_get_language(event_info, &locale);
	elm_language_set(locale);
	free(locale);
}

static void
widget_app_region_changed(app_event_info_h event_info, void *user_data)
{
	/* APP_EVENT_REGION_FORMAT_CHANGED */
}

static widget_class_h
widget_app_create(void *user_data)
{
	/* Hook to take necessary actions before main event loop starts.
	   Initialize UI resources.
	   Make a class for widget instance.
	*/
	app_event_handler_h handlers[5] = {NULL, };

	widget_app_add_event_handler(&handlers[APP_EVENT_LANGUAGE_CHANGED],
		APP_EVENT_LANGUAGE_CHANGED, widget_app_lang_changed, user_data);
	widget_app_add_event_handler(&handlers[APP_EVENT_REGION_FORMAT_CHANGED],
		APP_EVENT_REGION_FORMAT_CHANGED, widget_app_region_changed, user_data);

	widget_instance_lifecycle_callback_s ops = {
		.create = widget_instance_create,
		.destroy = widget_instance_destroy,
		.pause = widget_instance_pause,
		.resume = widget_instance_resume,
		.update = widget_instance_update,
		.resize = widget_instance_resize,
	};

	data_initialize();
	data_set_change_cb(widget_data_changed_cb, NULL);

	return widget_app_class_create(ops, user_data);
}

static void
widget_app_terminate(void *user_data)
{
	/* Release all resources. */
}

int
main(int argc, char *argv[])
{
	widget_app_lifecycle_callback_s ops = {0,};
	int ret;

	ops.create = widget_app_create;
	ops.terminate = widget_app_terminate;

	ret = widget_app_main(argc, argv, &ops, NULL);
	if (ret != WIDGET_ERROR_NONE) {
		dlog_print(DLOG_ERROR, LOG_TAG, "widget_app_main() is failed. err = %d", ret);
	}

	return ret;
}


