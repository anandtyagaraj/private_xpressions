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
 
 package com.anandtyagaraj.xpression.studio;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentSender;
import android.content.ServiceConnection;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.location.Location;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.os.IBinder;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.ListView;
import android.widget.Switch;
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
import com.samsung.android.sdk.healthdata.HealthConnectionErrorResult;
import com.samsung.android.sdk.healthdata.HealthConstants;
import com.samsung.android.sdk.healthdata.HealthDataService;
import com.samsung.android.sdk.healthdata.HealthDataStore;
import com.samsung.android.sdk.healthdata.HealthPermissionManager;
import com.samsung.android.sdk.healthdata.HealthResultHolder;
import com.samsung.android.sdk.internal.database.BulkCursorToCursorAdaptor;
import com.samsung.android.sdk.internal.healthdata.HealthResultReceiver;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static java.lang.Float.parseFloat;

//----------------

public class ProviderActivity extends Activity implements
        ConnectionCallbacks,
        OnConnectionFailedListener,
        LocationListener{
    private final int MENU_ITEM_PERMISSION_SETTING = 1;
    private final int MENU_ITEM_HELP_SETTING = 2;
    //-------------------------------
    //Define a request code to send to Google Play services
    private final static int CONNECTION_FAILURE_RESOLUTION_REQUEST = 9000;
    private GoogleApiClient mGoogleApiClient;
    private LocationRequest mLocationRequest;
    private double currentLatitude;
    private double currentLongitude;






    //--------------------------------
    private static final String TAG = "Xpressions";



    private WeatherProviderForWebApp mConnectionHandler = null;
    private boolean mIsBound = false;

    private static ProviderActivity mInstance = null;
    private HealthDataStore mStore;
    private HealthConnectionErrorResult mConnError;
    private Set<HealthPermissionManager.PermissionKey> mKeySet;
    private StepCountReporter mReporter;

    private ServiceConnection mConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName className, IBinder service) {
            mConnectionHandler = ((WeatherProviderForWebApp.LocalBinder) service).getService();

            SendCommand(7);

            SendCommand(9);
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
        try {
            setContentView(R.layout.activity_main);

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


            mInstance = this;
            mKeySet = new HashSet<HealthPermissionManager.PermissionKey>();
            mKeySet.add(new HealthPermissionManager.PermissionKey(HealthConstants.StepCount.HEALTH_DATA_TYPE, HealthPermissionManager.PermissionType.READ));
            HealthDataService healthDataService = new HealthDataService();
            try {
                healthDataService.initialize(this);
            } catch (Exception e) {
                e.printStackTrace();
            }

            // Create a HealthDataStore instance and set its listener
            mStore = new HealthDataStore(this, mConnectionListener);
            // Request the connection to the health data store
            mStore.connectService();


            Button btnSync = (Button) findViewById(R.id.btnSyncNow);
            btnSync.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    SyncNow(view);
                }
            });

            Button btnForeColor = (Button) findViewById(R.id.btnforecolor);
            btnForeColor.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    SendCommand(0);
                }
            });

            Button btnBackColor = (Button) findViewById(R.id.btnbackcolor);
            btnBackColor.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    SendCommand(1);
                }
            });

            Button btnFaceChanger = (Button) findViewById(R.id.btnfacechanger);
            btnFaceChanger.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    SendCommand(4);
                }
            });

            //Get Temperature unit
            final Switch s1 = (Switch) findViewById(R.id.switchtemp);
            s1.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                    SendCommand(b ? 6 : 7);
                    Global.Temp = b;

                    int rid = getResources().getIdentifier("i" + Global.TempId, "mipmap", getPackageName());
                    Button btnWeather = (Button) findViewById(R.id.btnweather);
                    btnWeather.setCompoundDrawablesWithIntrinsicBounds(0, rid, 0, 0);
                    if (Global.Temp == null || Global.Temp == false) {
                        btnWeather.setText(Global.TempCel + "\u2103");
                    } else {
                        btnWeather.setText(Global.TempFah + "\u2109");
                    }


                }
            });

          //Get Hour Format
            final Switch s2 = (Switch) findViewById(R.id.switchhour);
            s2.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                    SendCommand(b ? 8 : 9);
                    Global.Hour = b;
                }
            });


        }
        catch(Exception e){
            Toast.makeText(getApplicationContext(),"Make sure GPS, internet is ON.", Toast.LENGTH_LONG).show();
        }
    }

    protected void SyncNow(View v){

        //Get Weather
        InvokeWeatherRequest();

        //Get Steps
        SendSteps();
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

    //HEALTH -- START
    private final HealthDataStore.ConnectionListener mConnectionListener = new HealthDataStore.ConnectionListener() {

        @Override
        public void onConnected() {
            Log.d(TAG, "Health data service is connected.");
            HealthPermissionManager pmsManager = new HealthPermissionManager(mStore);
            mReporter = new StepCountReporter(mStore);

            try {
                // Check whether the permissions that this application needs are acquired
                Map<HealthPermissionManager.PermissionKey, Boolean> resultMap = pmsManager.isPermissionAcquired(mKeySet);

                if (resultMap.containsValue(Boolean.FALSE)) {
                    // Request the permission for reading step counts if it is not acquired
                    pmsManager.requestPermissions(mKeySet, ProviderActivity.this).setResultListener(mPermissionListener);
                } else {
                    // Get the current step count and display it
                    mReporter.start();
                }
            } catch (Exception e) {
                Log.e(TAG, e.getClass().getName() + " - " + e.getMessage());
                Log.e(TAG, "Permission setting fails.");
            }
        }

        @Override
        public void onConnectionFailed(HealthConnectionErrorResult error) {
            Log.d(TAG, "Health data service is not available.");
            showConnectionFailureDialog(error);
        }

        @Override
        public void onDisconnected() {
            Log.d(TAG, "Health data service is disconnected.");
        }
    };

    private final HealthResultHolder.ResultListener<HealthPermissionManager.PermissionResult> mPermissionListener =
            new HealthResultHolder.ResultListener<HealthPermissionManager.PermissionResult>() {

                @Override
                public void onResult(HealthPermissionManager.PermissionResult result) {
                    Log.d(TAG, "Permission callback is received.");
                    Map<HealthPermissionManager.PermissionKey, Boolean> resultMap = result.getResultMap();

                    if (resultMap.containsValue(Boolean.FALSE)) {
                        drawStepCount(0,0);
                        showPermissionAlarmDialog();
                    } else {
                        // Get the current step count and display it
                        mReporter.start();
                    }
                }
            };

    public void drawStepCount(int count, int calorie){

        Global.Steps = count;
        Global.Calorie = calorie;

        String str = count < 1? "...": String.valueOf(count) + " Steps";
        str +=  "\n" + calorie + " Cal";

        Button btnsteps = (Button)findViewById(R.id.btnsteps);
        btnsteps.setText(str);
    }

    public static ProviderActivity getInstance() {
        return mInstance;
    }

    private void showPermissionAlarmDialog() {
        if (isFinishing()) {
            return;
        }

        AlertDialog.Builder alert = new AlertDialog.Builder(ProviderActivity.this);
        alert.setTitle("Notice");
        alert.setMessage("All permissions should be acquired");
        alert.setPositiveButton("OK", null);
        alert.show();
    }

    private void showConnectionFailureDialog(HealthConnectionErrorResult error) {

        AlertDialog.Builder alert = new AlertDialog.Builder(this);
        mConnError = error;
        String message = "Connection with S Health is not available";

        if (mConnError.hasResolution()) {
            switch(error.getErrorCode()) {
                case HealthConnectionErrorResult.PLATFORM_NOT_INSTALLED:
                    message = "Please install S Health";
                    break;
                case HealthConnectionErrorResult.OLD_VERSION_PLATFORM:
                    message = "Please upgrade S Health";
                    break;
                case HealthConnectionErrorResult.PLATFORM_DISABLED:
                    message = "Please enable S Health";
                    break;
                case HealthConnectionErrorResult.USER_AGREEMENT_NEEDED:
                    message = "Please agree with S Health policy";
                    break;
                default:
                    message = "Please make S Health available";
                    break;
            }
        }

        alert.setMessage(message);

        alert.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int id) {
                if (mConnError.hasResolution()) {
                    mConnError.resolve(mInstance);
                }
            }
        });

        if (error.hasResolution()) {
            alert.setNegativeButton("Cancel", null);
        }

        alert.show();
    }

    //HEALTH -- END

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

            //Toast.makeText(this, currentLatitude + " WORKS " + currentLongitude + "", Toast.LENGTH_LONG).show();

            InvokeWeatherRequest();

            SendSteps();
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
        //Toast.makeText(this, currentLatitude + " WORKS " + currentLongitude + "", Toast.LENGTH_LONG).show();
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
        //MenuInflater inflater = getMenuInflater();
        //inflater.inflate(R.menu.menu_main2, menu);
        //return true;

        super.onCreateOptionsMenu(menu);

        menu.add(1, MENU_ITEM_PERMISSION_SETTING, 0, "Connect to S Health");
        menu.add(1, MENU_ITEM_HELP_SETTING, 1, "Help");
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        if(item.getItemId() == (MENU_ITEM_PERMISSION_SETTING)) {
            HealthPermissionManager pmsManager = new HealthPermissionManager(mStore);
            try {
                // Show user permission UI for allowing user to change options
                pmsManager.requestPermissions(mKeySet, ProviderActivity.this).setResultListener(mPermissionListener);
            } catch (Exception e) {
                Log.e(TAG, e.getClass().getName() + " - " + e.getMessage());
                Log.e(TAG, "Permission setting fails.");
            }
        }
        else if(item.getItemId() == (MENU_ITEM_HELP_SETTING)){
            showHelp();
        }

        return true;
    }

    private void showHelp(){
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("Connect to Smartwatch:\n\n");

        stringBuilder.append("+ Enable Bluetooth/Connect using Gear Manager\n\n");
        stringBuilder.append("+ Enable GPS/Location\n\n");
        stringBuilder.append("+ Enable WiFi/Mobile Data\n\n");
        stringBuilder.append("+ Click Smartphone icon from Menu in watchface\n\n");

        stringBuilder.append("\n\n\nSupport: anand.tyagaraj@gmail.com");

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
            if(strWeatherData != null && strWeatherData != "")
            SendData(strWeatherData);
        }
    }

    private void InvokeWeatherRequest(){
        try {
            //Toast.makeText(getBaseContext(), "Lat: "+ Global.Lat + " Lon: " + Global.Long, Toast.LENGTH_SHORT).show();


                String Uri = Global.URL + "lat=" + Global.Lat + "&lon=" + Global.Long + "&appid=" + Global.KEY;
                AsyncTask<String, Integer, String> str = new GetWeatherData().execute(Uri);

//            else{
//                Toast.makeText(getBaseContext(), "Make sure to enable GPS and data...", Toast.LENGTH_SHORT).show();
//            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void SendSteps(){
            mConnectionHandler.SendSteps();
    }

    private void SendData(String strWeatherData) {
        JSONObject obj = null;
        JSONObject jsonData = new JSONObject();
        try {
            obj = new JSONObject(strWeatherData);


            JSONObject weatherObject = new JSONObject(obj.getJSONArray("weather").get(0).toString());
            JSONObject mainObject = new JSONObject(obj.getJSONObject("main").toString());

            String icon = weatherObject.getString("icon");
            String tempCel = String.valueOf(Math.round((parseFloat(mainObject.getString("temp")) - 270.15) * 10) / 10.0d);
            String tempFah = String.valueOf(Math.round(((((parseFloat(mainObject.getString("temp")) - 270.15) * 9) / 5) + 32) * 10) / 10.0d);

            Global.TempCel = tempCel;
            Global.TempFah = tempFah;
            Global.TempId = icon;

            jsonData.put("temperatureId", icon);
            jsonData.put("tempCel", tempCel);
            jsonData.put("tempFah", tempFah);

            int rid = getResources().getIdentifier("i"+icon,"mipmap",getPackageName());

            mConnectionHandler.sendData(jsonData.toString().getBytes());
            //Toast.makeText(getApplicationContext(), "Sent weather update... ", Toast.LENGTH_SHORT).show();

            Button btnWeather = (Button) findViewById(R.id.btnweather);
            btnWeather.setCompoundDrawablesWithIntrinsicBounds(0, rid, 0, 0);
            btnWeather.setText(Global.Temp == false?tempCel + "\u2103": tempFah +"\u2109");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

    public void SendCommand(long val){
        JSONObject jsonData = new JSONObject();
        String key = "";

        String keyName = "";

        if(val == 0)
        {key = "TEXT_COLOR"; keyName = "Text Color";}
        else if(val == 1)
        {key = "BACK_COLOR";keyName = "Background Color";}
        else if(val == 2)
        {key = "12/24";keyName = "12/24 Hour Format toggle";}
        else if(val == 3)
        {key = "C/F";keyName = "Celcius/Fahrenheit toggle";}
        else if(val == 4)
        {key = "Theme";keyName = "Change theme";}
        else if(val == 5)
        {key = "HR";keyName = "Heart Rate";}
        else if(val == 6)
        {key = "F";keyName = "Fahrenheit";}
        else if(val == 7)
        {key = "C";keyName = "Celcius";}
        else if(val == 8)
        {key = "24";keyName = "24 Hour Format toggle";}
        else if(val == 9)
        {key = "12";keyName = "12 Hour Format toggle";}


        try {
            jsonData.put("command", key);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        Toast.makeText(getApplicationContext(),"Command: " + keyName + " invoked...", Toast.LENGTH_SHORT).show();
        mConnectionHandler.sendData(jsonData.toString().getBytes());
    }


}