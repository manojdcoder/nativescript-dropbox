package org.nativescript.plugins.dropbox;

import android.os.AsyncTask;

import com.dropbox.core.util.IOUtil;
import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.files.FileMetadata;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

public class UploadFileTask extends AsyncTask<Void, Integer, FileMetadata> {

    private final String mPath;
    private final byte[] mData;
    private final DbxClientV2 mDbxClient;
    private final DropboxPluginProgressListener mlistener;
    private Exception mException;

    public UploadFileTask(String path, byte[] data, DbxClientV2 dbxClient, DropboxPluginProgressListener callback) {
        super();
        mPath = path;
        mData = data;
        mDbxClient = dbxClient;
        mlistener = callback;
    }

    @Override
    protected void onPostExecute(FileMetadata result) {
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
    protected FileMetadata doInBackground(Void... params) {
        try  {
            InputStream inputStream = new ByteArrayInputStream(mData);
            return mDbxClient.files().uploadBuilder(String.valueOf(mPath))
                    .uploadAndFinish(inputStream, new IOUtil.ProgressListener() {
                        @Override
                        public void onProgress(long bytesWritten) {
                            publishProgress(Integer.valueOf((int) bytesWritten));
                        }
                    });
        } catch (Exception e) {
            mException = e;
        }
        return null;
    }
}
