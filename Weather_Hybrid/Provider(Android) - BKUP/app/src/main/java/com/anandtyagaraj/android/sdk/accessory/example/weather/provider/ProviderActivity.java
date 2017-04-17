/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved. 
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that 
 * the following conditions are met:
 * 
 *     * Redistributions of source code must retain the above copyright notice, 
 *       this list of conditions and the following disclaimer. 
 *     * Redistributions in binary form must reproduce the above copyright notice, 
 *       this list of conditions and the following disclaimer in the documentation and/or 
 *       other materials provided with the distribution. 
 *     * Neither the name of Samsung Electronics Co., Ltd. nor the names of its contributors may be used to endorse
 *       or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
 
 package com.anandtyagaraj.android.sdk.accessory.example.weather.provider;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentSender;
import android.content.ServiceConnection;
import android.location.Location;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.client.RestTemplate;

//---------------
import com.google.android.gms.appindexing.Action;
import com.google.android.gms.appindexing.AppIndex;
import com.google.android.gms.appindexing.Thing;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.GoogleApiClient.ConnectionCallbacks;
import com.google.android.gms.common.api.GoogleApiClient.OnConnectionFailedListener;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;

import static java.lang.Float.parseFloat;

//----------------

public class ProviderActivity extends Activity implements
        ConnectionCallbacks,
        OnConnectionFailedListener,
        LocationListener{

    //-------------------------------
    //Define a request code to send to Google Play services
    private final static int CONNECTION_FAILURE_RESOLUTION_REQUEST = 9000;
    private GoogleApiClient mGoogleApiClient;
    private LocationRequest mLocationRequest;
    private double currentLatitude;
    private double currentLongitude;






    //--------------------------------
    private static final String TAG = "Xpressions";

    static String[] commandArray = {"Text Color", "Background Color", "12/24 Hour Format", "Centigrade/Fahrenheit", "Theme", "Heart Rate", "Weather Refresh"};

    private WeatherProviderForWebApp mConnectionHandler = null;
    private boolean mIsBound = false;

    private ServiceConnection mConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName className, IBinder service) {
            mConnectionHandler = ((WeatherProviderForWebApp.LocalBinder) service).getService();
        }

        @Override
        public void onServiceDisconnected(ComponentName className) {
            mConnectionHandler = null;
            mIsBound = false;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ListView cityListView = (ListView) findViewById(R.id.listView);



        ArrayAdapter arrayAdapter = new ArrayAdapter(this, android.R.layout.simple_list_item_single_choice, commandArray);

        cityListView.setAdapter(arrayAdapter);
        cityListView.setChoiceMode(ListView.CHOICE_MODE_SINGLE);
        cityListView.setOnItemClickListener(itemClickListenerOfCityList);

        mIsBound = bindService(new Intent(ProviderActivity.this, WeatherProviderForWebApp.class), mConnection, Context.BIND_AUTO_CREATE);

        //-------------------------
        // ATTENTION: This "addApi(AppIndex.API)"was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        mGoogleApiClient = new GoogleApiClient.Builder(this)
                // The next two lines tell the new client that “this” current class will handle connection stuff
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                //fourth line adds the LocationServices API endpoint from GooglePlayServices
                .addApi(LocationServices.API)
                .addApi(AppIndex.API).build();

        // Create the LocationRequest object
        mLocationRequest = LocationRequest.create()
                .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
                .setInterval(10 * 1000)        // 10 seconds, in milliseconds
                .setFastestInterval(1 * 1000); // 1 second, in milliseconds


        //()findViewById(R.id.action_settings);
        //--------------------------
    }

    @Override
    protected void onResume() {
        super.onResume();
        //Now lets connect to the API
        mGoogleApiClient.connect();
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.v(this.getClass().getSimpleName(), "onPause()");

        //Disconnect from API onPause()
        if (mGoogleApiClient.isConnected()) {
            LocationServices.FusedLocationApi.removeLocationUpdates(mGoogleApiClient, this);
            mGoogleApiClient.disconnect();
        }



    }

    /**
     * If connected get lat and long
     *
     */
    @Override
    public void onConnected(Bundle bundle) {
        Location location = LocationServices.FusedLocationApi.getLastLocation(mGoogleApiClient);

        if (location == null) {
            LocationServices.FusedLocationApi.requestLocationUpdates(mGoogleApiClient, mLocationRequest, this);

        } else {
            //If everything went fine lets get latitude and longitude
            currentLatitude = location.getLatitude();
            currentLongitude = location.getLongitude();

            Global.Lat = currentLatitude;
            Global.Long = currentLongitude;

            Toast.makeText(this, currentLatitude + " WORKS " + currentLongitude + "", Toast.LENGTH_LONG).show();
        }
    }

    @Override
    public void onConnectionSuspended(int i) {}

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {
            /*
             * Google Play services can resolve some errors it detects.
             * If the error has a resolution, try sending an Intent to
             * start a Google Play services activity that can resolve
             * error.
             */
        if (connectionResult.hasResolution()) {
            try {
                // Start an Activity that tries to resolve the error
                connectionResult.startResolutionForResult(this, CONNECTION_FAILURE_RESOLUTION_REQUEST);
                    /*
                     * Thrown if Google Play services canceled the original
                     * PendingIntent
                     */
            } catch (IntentSender.SendIntentException e) {
                // Log the error
                e.printStackTrace();
            }
        } else {
                /*
                 * If no resolution is available, display a dialog to the
                 * user with the error.
                 */
            Log.e("Error", "Location services connection failed with code " + connectionResult.getErrorCode());
        }
    }

    /**
     * If locationChanges change lat and long
     *
     *
     * @param location
     */
    @Override
    public void onLocationChanged(Location location) {
        currentLatitude = location.getLatitude();
        currentLongitude = location.getLongitude();

        Global.Lat = currentLatitude;
        Global.Long = currentLongitude;
        Toast.makeText(this, currentLatitude + " WORKS " + currentLongitude + "", Toast.LENGTH_LONG).show();
    }

    /**
     * ATTENTION: This was auto-generated to implement the App Indexing API.
     * See https://g.co/AppIndexing/AndroidStudio for more information.
     */
    public Action getIndexApiAction() {
        Thing object = new Thing.Builder()
                .setName("Provider Page") // TODO: Define a title for the content shown.
                // TODO: Make sure this auto-generated URL is correct.
                .setUrl(Uri.parse("http://[ENTER-YOUR-URL-HERE]"))
                .build();
        return new Action.Builder(Action.TYPE_VIEW)
                .setObject(object)
                .setActionStatus(Action.STATUS_TYPE_COMPLETED)
                .build();
    }

    @Override
    public void onStart() {
        super.onStart();

        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        mGoogleApiClient.connect();
        AppIndex.AppIndexApi.start(mGoogleApiClient, getIndexApiAction());
    }

    @Override
    public void onStop() {
        super.onStop();

        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        AppIndex.AppIndexApi.end(mGoogleApiClient, getIndexApiAction());
        mGoogleApiClient.disconnect();
    }

    //------------------------

    @Override
    public boolean onCreateOptionsMenu(Menu menu){
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu_main2, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle item selection
        switch (item.getItemId()) {
            case R.id.action_settings:
                showHelp();
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    private void showHelp(){
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("Connect to Smartwatch:\n\n");

        stringBuilder.append("+ Enable Bluetooth/Connect using Gear Manager\n");
        stringBuilder.append("+ Enable GPS/Location\n");
        stringBuilder.append("+ Enable WiFi/Mobile Data\n");
        stringBuilder.append("+ Click Smartphone icon from Menu in watchface\n");

        builder.setMessage(stringBuilder.toString());


        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                // User clicked OK button
                dialog.dismiss();
            }
        });

        AlertDialog dialog = builder.create();

        dialog.show();
    }


    public class GetWeatherData extends AsyncTask<String,Integer, String>{


        @Override
        protected String doInBackground(String... strings) {
            try {
                RestTemplate restTemplate = new RestTemplate();
                String str = restTemplate.getForObject(strings[0], String.class, "Android");

                return str;
            }
            catch(Exception e){

            }
            return null;
        }

        @Override
        protected void onPostExecute(String strWeatherData) {
            super.onPostExecute(strWeatherData);
            SendData(strWeatherData);
        }
    }

    private void SendData(String strWeatherData){
        JSONObject obj = null;
        JSONObject jsonData = new JSONObject();
        try {
            obj = new JSONObject(strWeatherData);


        JSONObject weatherObject = new JSONObject(obj.getJSONArray("weather").get(0).toString());
        JSONObject mainObject = new JSONObject(obj.getJSONObject("main").toString());

        String icon = weatherObject.getString("icon");
        String tempCel = String.valueOf(Math.round((parseFloat(mainObject.getString("temp")) - 273.15) * 10) / 10.0d);
        String tempFah = String.valueOf(Math.round(((((parseFloat(mainObject.getString("temp")) - 273.15) * 9) / 5) + 32) * 10) / 10.0d);


        jsonData.put("temperatureId", icon);
        jsonData.put("tempCel", tempCel);
        jsonData.put("tempFah", tempFah);


            mConnectionHandler.sendData(jsonData.toString().getBytes());
        Toast.makeText(getApplicationContext(), "Sent weather update... ", Toast.LENGTH_SHORT).show();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public void SendCommand(long val){
        JSONObject jsonData = new JSONObject();
        String key = "";
        if(val == 0)
            key = "TEXT_COLOR";
        else if(val == 1)
            key = "BACK_COLOR";
        else if(val == 2)
            key = "12/24";
        else if(val == 3)
            key = "C/F";
        else if(val == 4)
            key = "Theme";
        else if(val == 5)
            key = "HR";


        try {
            jsonData.put("command", key);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        mConnectionHandler.sendData(jsonData.toString().getBytes());
    }

    public OnItemClickListener itemClickListenerOfCityList = new OnItemClickListener()
    {
        public void onItemClick(AdapterView<?> parentView, View clickedView, int position, long id) {

        String selected = ((TextView) clickedView).getText().toString();
        Log.d(TAG, "Select: " + selected + "[" + id + "]");
            //{"Text Color",
            // "Background Color",
            // "12/24 Hour Format",
            // "Centigrade/Fahrenheit",
            // "Theme",
            // "Heart Rate",
            // "Weather Refresh"};
        if (id < 6) {
            SendCommand(id);
        } else {
            try {

                if(Global.Lat > 0) {


                    String Uri = Global.URL + "lat=" + Global.Lat + "&lon=" + Global.Long + "&appid=" + Global.KEY;
                    AsyncTask<String, Integer, String> str = new GetWeatherData().execute(Uri);

                }
                else{
                    Toast.makeText(getBaseContext(), "Make sure to enable GPS and data...", Toast.LENGTH_SHORT).show();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        }
    };
}