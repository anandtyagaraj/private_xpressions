/* * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.  * Redistribution and use in source and binary forms, with or without modification, are permitted provided that  * the following conditions are met: *  *     * Redistributions of source code must retain the above copyright notice,  *       this list of conditions and the following disclaimer.  *     * Redistributions in binary form must reproduce the above copyright notice,  *       this list of conditions and the following disclaimer in the documentation and/or  *       other materials provided with the distribution.  *     * Neither the name of Samsung Electronics Co., Ltd. nor the names of its contributors may be used to endorse *       or promote products derived from this software without specific prior written permission. *  * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE * POSSIBILITY OF SUCH DAMAGE. */package com.anandtyagaraj.android.sdk.accessory.example.weather.provider;import java.io.IOException;import android.annotation.SuppressLint;import android.content.Intent;import android.os.AsyncTask;import android.os.Binder;import android.os.Handler;import android.os.IBinder;import android.widget.Toast;import android.util.Log;import com.samsung.android.sdk.SsdkUnsupportedException;import com.samsung.android.sdk.accessory.*;import org.json.JSONException;import org.json.JSONObject;import org.springframework.web.client.RestTemplate;import static java.lang.Float.parseFloat;@SuppressLint("LongLogTag")public class WeatherProviderForWebApp extends SAAgent {    private static final String TAG = "WeatherProviderForWebApp";    private static final Class<ServiceConnection> SASOCKET_CLASS = ServiceConnection.class;    private static int numInt = 0;    private final IBinder mBinder = new LocalBinder();    private ServiceConnection mConnectionHandler = null;    Handler mHandler = new Handler();    public WeatherProviderForWebApp() {        super(TAG, SASOCKET_CLASS);    }    @Override    public void onCreate() {        super.onCreate();        Toast.makeText(getBaseContext(), "Connect to WebApp", Toast.LENGTH_SHORT).show();        SA mAccessory = new SA();        try {            mAccessory.initialize(this);        } catch (SsdkUnsupportedException e) {            // try to handle SsdkUnsupportedException            if (processUnsupportedException(e) == true) {                return;            }        } catch (Exception e1) {            e1.printStackTrace();            /*             * Your application can not use Samsung Accessory SDK. Your application should work smoothly             * without using this SDK, or you may want to notify user and close your application gracefully             * (release resources, stop Service threads, close UI thread, etc.)             */            stopSelf();        }    }    @Override    public IBinder onBind(Intent intent) {        return mBinder;    }    @Override    protected void onFindPeerAgentsResponse(SAPeerAgent[] peerAgents, int result) {        Log.d(TAG, "onFindPeerAgentResponse : result =" + result);    }    @Override    protected void onServiceConnectionRequested(SAPeerAgent peerAgent) {        if (peerAgent != null) {            Toast.makeText(getBaseContext(), R.string.ConnectionAcceptedMsg2, Toast.LENGTH_SHORT).show();            acceptServiceConnectionRequest(peerAgent);        }    }    @Override    protected void onServiceConnectionResponse(SAPeerAgent peerAgent, SASocket socket, int result) {        if (result == SAAgent.CONNECTION_SUCCESS) {            if (socket != null) {                mConnectionHandler = (ServiceConnection) socket;            }        } else if (result == SAAgent.CONNECTION_ALREADY_EXIST) {            Log.e(TAG, "onServiceConnectionResponse, CONNECTION_ALREADY_EXIST");        }    }    @Override    protected void onAuthenticationResponse(SAPeerAgent peerAgent, SAAuthenticationToken authToken, int error) {        /*         * The authenticatePeerAgent(peerAgent) API may not be working properly depending on the firmware         * version of accessory device. Please refer to another sample application for Security.         */    }    @Override    protected void onError(SAPeerAgent peerAgent, String errorMessage, int errorCode) {        super.onError(peerAgent, errorMessage, errorCode);    }    private boolean processUnsupportedException(SsdkUnsupportedException e) {        e.printStackTrace();        int errType = e.getType();        if (errType == SsdkUnsupportedException.VENDOR_NOT_SUPPORTED                || errType == SsdkUnsupportedException.DEVICE_NOT_SUPPORTED) {            /*             * Your application can not use Samsung Accessory SDK. You application should work smoothly             * without using this SDK, or you may want to notify user and close your app gracefully (release             * resources, stop Service threads, close UI thread, etc.)             */            stopSelf();        } else if (errType == SsdkUnsupportedException.LIBRARY_NOT_INSTALLED) {            Log.e(TAG, "You need to install Samsung Accessory SDK to use this application.");        } else if (errType == SsdkUnsupportedException.LIBRARY_UPDATE_IS_REQUIRED) {            Log.e(TAG, "You need to update Samsung Accessory SDK to use this application.");        } else if (errType == SsdkUnsupportedException.LIBRARY_UPDATE_IS_RECOMMENDED) {            Log.e(TAG, "We recommend that you update your Samsung Accessory SDK before using this application.");            return false;        }        return true;    }    public class GetWeatherData extends AsyncTask<String,Integer, String>{        @Override        protected String doInBackground(String... strings) {            try {                RestTemplate restTemplate = new RestTemplate();                String str = restTemplate.getForObject(strings[0], String.class, "Android");                return str;            }            catch(Exception e){            }            return null;        }        @Override        protected void onPostExecute(String strWeatherData) {            super.onPostExecute(strWeatherData);            SendData(strWeatherData);        }    }    private void SendData(String strWeatherData){        JSONObject obj = null;        JSONObject jsonData = new JSONObject();        try {            obj = new JSONObject(strWeatherData);            JSONObject weatherObject = new JSONObject(obj.getJSONArray("weather").get(0).toString());            JSONObject mainObject = new JSONObject(obj.getJSONObject("main").toString());            String icon = weatherObject.getString("icon");            String tempCel = String.valueOf(Math.round((parseFloat(mainObject.getString("temp")) - 273.15) * 10) / 10.0d);            String tempFah = String.valueOf(Math.round(((((parseFloat(mainObject.getString("temp")) - 273.15) * 9) / 5) + 32) * 10) / 10.0d);            jsonData.put("temperatureId", icon);            jsonData.put("tempCel", tempCel);            jsonData.put("tempFah", tempFah);            sendData(jsonData.toString().getBytes());            Toast.makeText(getApplicationContext(), "Sent weather update... ", Toast.LENGTH_SHORT).show();        } catch (JSONException e) {            e.printStackTrace();        }    }    public void sendData(final byte[] data) {        if(mConnectionHandler == null) {            Log.e(TAG, "Lost connection !!");            return;        }        new Thread(new Runnable() {            public void run() {                try {                    mConnectionHandler.send(getServiceChannelId(0), data);                } catch (IOException e) {                    e.printStackTrace();                }            }        }).start();    }    public class LocalBinder extends Binder {        public WeatherProviderForWebApp getService() {            return WeatherProviderForWebApp.this;        }    }    public class ServiceConnection extends SASocket {        public ServiceConnection() {            super(ServiceConnection.class.getName());        }        @Override        public void onError(int channelId, String errorMessage, int errorCode) {        }        @Override        public void onReceive(int channelId, byte[] data) {            String req_message = new String(data);            Toast.makeText(getBaseContext(), "Received Request...", Toast.LENGTH_SHORT).show();            if (req_message.equals(new String("request"))) {                numInt++;                numInt %= 8;                try {                    if(Global.Lat > 0) {                        String Uri = Global.URL + "lat=" + Global.Lat + "&lon=" + Global.Long + "&appid=" + Global.KEY;                        AsyncTask<String, Integer, String> str = new GetWeatherData().execute(Uri);                    }                } catch (Exception e) {                    e.printStackTrace();                }            }        }        @Override        protected void onServiceConnectionLost(int reason) {            mConnectionHandler = null;            mHandler.post(new Runnable() {                @Override                public void run() {                    Toast.makeText(getBaseContext(), R.string.ConnectionTerminateddMsg2, Toast.LENGTH_SHORT).show();                }            });        }    }}