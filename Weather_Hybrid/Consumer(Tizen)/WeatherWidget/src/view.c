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

#include <widget_app_efl.h>
#include "view.h"
#include "log.h"

#define FILE_CONTENT "edje/layout.edj"
#define GROUP_NAME "main_layout"

static Evas_Object *_create_win(widget_context_h context, int w, int h);
static Evas_Object *_create_content(Evas_Object *win);
static void _get_resource(const char *file_in, char *path_out, int path_max);
static void _widget_pressed_cb(void *data, Evas *evas, Evas_Object *obj, void *event_info);
static void _widget_released_cb(void *data, Evas *evas, Evas_Object *obj, void *event_info);
static void _widget_click_cb(void* data, Evas_Object* obj, const char* emission, const char* source);

widget_instance_data_s *view_create(widget_context_h context, int w, int h)
{

	widget_instance_data_s *wid = malloc(sizeof(widget_instance_data_s));

	wid->win = _create_win(context, w, h);
	if (wid->win == NULL) {
		dlog_print(DLOG_ERROR, LOG_TAG, "failed to create a window.");
		free(wid);
		return NULL;
	}

	wid->content = _create_content(wid->win);
	if (wid->content == NULL) {
		dlog_print(DLOG_ERROR, LOG_TAG, "failed to create a content.");
		evas_object_del(wid->win);
		free(wid);
		return NULL;
	}
	//elm_object_content_set(wid->win, wid->content);

	wid->root_width = w;
	wid->root_height = h;

	return wid;
}

void view_set_image(void *user_data, const char *part, const char *file_name)
{
	widget_instance_data_s *wid = NULL;
	Evas_Object *img = NULL;

	wid = user_data;
	if (wid == NULL) {
		dlog_print(DLOG_ERROR, LOG_TAG, "failed to widget data.");
		return;
	}

	char full_path[PATH_MAX] = { 0, };

	img = elm_image_add(wid->win);
	if (img == NULL) {
		dlog_print(DLOG_ERROR, LOG_TAG, "failed to add a image.");
		return;
	}

	_get_resource(file_name, full_path, sizeof(full_path));
	elm_image_file_set(img, full_path, NULL);
	evas_object_size_hint_weight_set(img, EVAS_HINT_EXPAND, EVAS_HINT_EXPAND);
	elm_win_resize_object_add(wid->win, img);
	evas_object_show(img);

	elm_object_part_content_set(wid->content, part, img);
}

void view_set_text(void *user_data, const char *part, const char *text)
{
	widget_instance_data_s *wid = NULL;

	wid = user_data;
	if (wid == NULL) {
		dlog_print(DLOG_ERROR, LOG_TAG, "failed to get widget data.");
		return;
	}

	elm_object_part_text_set(wid->content, part, text);
}

void view_change_frame(void *user_data, const char *program)
{
	widget_instance_data_s *wid = NULL;

	wid = user_data;
	elm_object_signal_emit(wid->content, program, "widget");

}

void view_destroy(void *user_data)
{
	widget_instance_data_s *wid = NULL;

	wid = user_data;
	if (wid == NULL) {
		dlog_print(DLOG_ERROR, LOG_TAG, "failed to destroy data.");
		return;
	}

	evas_object_del(wid->win);

	free(wid);
}

void view_resize(void *user_data, int w, int h)
{
	widget_instance_data_s *wid = NULL;

	wid = user_data;
	if (wid == NULL) {
		dlog_print(DLOG_ERROR, LOG_TAG, "failed to widget data.");
		return;
	}

	evas_object_resize(wid->win, w, h);
}

void view_set_event_callback(void *user_data, const char *part_name, widget_event_type type, void *func)
{
	widget_instance_data_s *wid = NULL;
	Evas_Object *obj = NULL;

	wid = user_data;
	if (wid == NULL) {
		dlog_print(DLOG_ERROR, LOG_TAG, "failed to widget data.");
		return;
	}

	obj = elm_object_part_content_get(wid->content, part_name);

	if (!obj) {
		obj = (Evas_Object*) edje_object_part_object_get(elm_layout_edje_get(wid->content), part_name);
	}

	evas_object_data_set(obj, "callback_func_addr", (void*) func);
	evas_object_data_set(obj, "widget_event_type", (void*) type);

	if (type == WIDGET_EVENT_PRESSED) {
		evas_object_event_callback_add(obj, EVAS_CALLBACK_MOUSE_DOWN, _widget_pressed_cb, wid);
	} else if (type == WIDGET_EVENT_RELEASED) {
		evas_object_event_callback_add(obj, EVAS_CALLBACK_MOUSE_UP, _widget_released_cb, wid);
	} else if (type == WIDGET_EVENT_CLICKED) {
		elm_layout_signal_callback_add(wid->content, "mouse,clicked,1", part_name, _widget_click_cb, wid);
	}
}

static void _widget_click_cb(void* data, Evas_Object* obj, const char* emission, const char* source)
{
	widget_instance_data_s *wid = data;
	Evas_Object* partObject = NULL;

	if (!wid) {
		return;
	}

	partObject = elm_object_part_content_get(obj, source);

	if (!partObject) {
		partObject = (Evas_Object*) edje_object_part_object_get(elm_layout_edje_get(obj), source);
	}

	widget_event_cb func = evas_object_data_get(partObject, "callback_func_addr");

	if(func != NULL){
		func(wid);
	}
}

static void _widget_pressed_cb(void *data, Evas *evas, Evas_Object *obj, void *event_info)
{
	widget_instance_data_s *wid = data;
	if (!wid) {
		return;
	}

	widget_event_cb func = evas_object_data_get(obj, "callback_func_addr");

	func(wid);
}

static void _widget_released_cb(void *data, Evas *evas, Evas_Object *obj, void *event_info)
{
	widget_instance_data_s *wid = data;
	Evas_Event_Mouse_Up *ev = event_info;
	Evas_Coord x, y, w, h;

	if (!wid) {
		return;
	}

	widget_event_cb func = (widget_event_cb) evas_object_data_get(obj, "callback_func_addr");
	widget_event_type type = (widget_event_type) evas_object_data_get(obj, "widget_event_type");

	if (type == WIDGET_EVENT_RELEASED) {
		if (func) {
			func(wid);
		}
	} else if (type == WIDGET_EVENT_CLICKED) {
		evas_object_geometry_get(obj, &x, &y, &w, &h);

		if (!ELM_RECTS_POINT_OUT(x, y, w, h, ev->canvas.x, ev->canvas.y)) {
			if (func) {
				func(wid);
			}
		}
	}
}

static void _get_resource(const char *file_in, char *path_out, int path_max)
{
	char *res_path = app_get_resource_path();
	if (res_path) {
		snprintf(path_out, path_max, "%s/%s", res_path, file_in);
		free(res_path);
	}
}

static Evas_Object *_create_win(widget_context_h context, int w, int h)
{
	Evas_Object *win = NULL;
	int ret;

	if (context == NULL) {
		dlog_print(DLOG_ERROR, LOG_TAG, "failed to get context.");
		return NULL;
	}

	ret = widget_app_get_elm_win(context, &win);
	if (ret != WIDGET_ERROR_NONE) {
		dlog_print(DLOG_ERROR, LOG_TAG, "failed to get window. err = %d", ret);
		return NULL;
	}
	evas_object_resize(win, w, h);
	evas_object_show(win);

	return win;
}

/*
 * This is an empty layout.
 * You need to append detailed contents to content.edc and view.c.
 * If you need more views, please feel free to add new layouts.
 */
static Evas_Object *_create_content(Evas_Object *win)
{
	Evas_Object *content = NULL;
	char full_path[PATH_MAX] = { 0, };

	content = elm_layout_add(win);
	if (content == NULL) {
		dlog_print(DLOG_ERROR, LOG_TAG, "failed to add a content.");
		return NULL;
	}

	_get_resource(FILE_CONTENT, full_path, sizeof(full_path));
	elm_layout_file_set(content, full_path, GROUP_NAME);
	evas_object_size_hint_weight_set(content, EVAS_HINT_EXPAND, EVAS_HINT_EXPAND);
	elm_win_resize_object_add(win, content);
	evas_object_show(content);

	return content;
}
