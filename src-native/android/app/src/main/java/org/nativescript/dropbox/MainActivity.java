package org.nativescript.dropbox;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import com.dropbox.core.DbxRequestConfig;
import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.files.FileMetadata;
import com.dropbox.core.v2.files.WriteMode;

import org.nativescript.plugins.dropbox.DropboxPluginListener;
import org.nativescript.plugins.dropbox.DropboxPluginProgressListener;
import org.nativescript.plugins.dropbox.ShareFileTask;
import  org.nativescript.plugins.dropbox.UploadFileTask;

import java.io.ByteArrayOutputStream;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Test
        DbxRequestConfig requestConfig = DbxRequestConfig.newBuilder("nativescript-dropbox").build();
        final DbxClientV2 client = new DbxClientV2(requestConfig, "ACCESS_TOKEN");

        Button btnUplaod = (Button) findViewById(R.id.btn_upload);
        btnUplaod.setOnClickListener(new Button.OnClickListener() {
            public void onClick(View v) {

                Bitmap bmp = BitmapFactory.decodeResource(getResources(), R.drawable.logo);
                ByteArrayOutputStream stream = new ByteArrayOutputStream();
                bmp.compress(Bitmap.CompressFormat.PNG, 100, stream);
                byte[] data = stream.toByteArray();

                new UploadFileTask("/logo.png", WriteMode.OVERWRITE, false,false, data,client, new DropboxPluginProgressListener(){
                    public void success(Object result) {
                        Log.i("Success", result.toString());
                    }
                    public void error(Exception error){
                        Log.e("Error", error.toString());
                    }
                    public  void progress(long totalBytesUploaded, long totalBytesExpectedToUploaded){
                        Log.i("Progress", totalBytesUploaded + "/" + totalBytesExpectedToUploaded);
                    }
                }).execute();
            }
        });

        Button btnShare = (Button) findViewById(R.id.btn_share);
        btnShare.setOnClickListener(new Button.OnClickListener() {
            public void onClick(View v) {
                new ShareFileTask("/logo.png", client, new DropboxPluginListener(){
                    public void success(Object result) {
                        Log.i("Success", result.toString());
                    }
                    public void error(Exception error){
                        Log.e("Error", error.toString());
                    }
                }).execute();
            }
        });
    }
}
