package org.nativescript.plugins.dropbox;

import android.os.AsyncTask;

import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.sharing.CreateSharedLinkWithSettingsErrorException;
import com.dropbox.core.v2.sharing.ListSharedLinksResult;
import com.dropbox.core.v2.sharing.SharedLinkMetadata;
import com.dropbox.core.v2.sharing.SharedLinkSettings;

public class ShareFileTask extends AsyncTask<Void, Void, SharedLinkMetadata> {

    private final String mPath;
    private final DbxClientV2 mDbxClient;
    private final DropboxPluginListener mlistener;
    private Exception mException;

    public ShareFileTask(String path, DbxClientV2 dbxClient, DropboxPluginListener callback) {
        super();
        mPath = path;
        mDbxClient = dbxClient;
        mlistener = callback;
    }

    @Override
    protected void onPostExecute(SharedLinkMetadata result) {
        super.onPostExecute(result);
        if (mException != null) {
            if(mException instanceof CreateSharedLinkWithSettingsErrorException &&
                    ((CreateSharedLinkWithSettingsErrorException) mException).errorValue.isSharedLinkAlreadyExists()){
                new ListSharedLinkTask(mPath, mDbxClient, new DropboxPluginListener() {
                    @Override
                    public void success(Object result) {
                        mlistener.success(((ListSharedLinksResult) result).getLinks().get(0));
                    }

                    @Override
                    public void error(Exception error) {
                        mlistener.error(error);
                    }
                }).execute();
            } else {
                mlistener.error(mException);
            }
        } else if (result == null) {
            mlistener.error(null);
        } else {
            mlistener.success(result);
        }
    }

    @Override
    protected SharedLinkMetadata doInBackground(Void... params) {
        try  {
            return mDbxClient.sharing().createSharedLinkWithSettings(mPath, new SharedLinkSettings());
        } catch (Exception e) {
            mException = e;
        }
        return null;
    }
}
