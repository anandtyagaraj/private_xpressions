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

#include <Elementary.h>
#include <widget_app.h>

typedef struct widget_instance_data {
	Evas_Object *win;
	Evas_Object *bg;
	Evas_Object *content;

	int root_width;
	int root_height;
} widget_instance_data_s;

/**
 * Identifier of callbacks to be set for Widget.
 *
 * @see view_set_event_callback()
  */
typedef enum _widget_event_type
{
   WIDGET_EVENT_PRESSED,   /* Touch Press Event */
   WIDGET_EVENT_RELEASED,  /* Touch Release Event */
   WIDGET_EVENT_CLICKED     /* Touch Click Event */
} widget_event_type;

/* Widget event calllback function signature */
typedef void  (*widget_event_cb)(widget_instance_data_s *wid);

widget_instance_data_s *view_create(widget_context_h context, int w, int h);
void view_set_image(void *user_data, const char *part, const char *file_name);
void view_set_text(void *user_data, const char *part, const char *text);
void view_change_frame(void *user_data, const char *program);
void view_destroy(void *user_data);
void view_resize(void *user_data, int w, int h);
void view_set_event_callback(void *user_data, const char *part_name, widget_event_type type, void *func);
