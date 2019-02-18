package org.nativescript.plugins.dropbox;

import android.os.AsyncTask;

import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.sharing.ListSharedLinksResult;

public class ListSharedLinkTask extends AsyncTask<Void, Void, ListSharedLinksResult> {

    private final String mPath;
    private final DbxClientV2 mDbxClient;
    private final DropboxPluginListener mlistener;
    private Exception mException;

    public ListSharedLinkTask(String path, DbxClientV2 dbxClient, DropboxPluginListener callback) {
        super();
        mPath = path;
        mDbxClient = dbxClient;
        mlistener = callback;
    }

    @Override
    protected void onPostExecute(ListSharedLinksResult result) {
        super.onPostExecute(result);
        if (mException != null) {
            mlistener.error(mException);
        } else if (result == null) {
            mlistener.error(null);
        } else {
            mlistener.success(result);
        }
    }

    @Override
    protected ListSharedLinksResult doInBackground(Void... params) {
        try  {
            return mDbxClient.sharing().listSharedLinksBuilder().withPath(mPath).withDirectOnly(true).start();
        } catch (Exception e) {
            mException = e;
        }
        return null;
    }
}