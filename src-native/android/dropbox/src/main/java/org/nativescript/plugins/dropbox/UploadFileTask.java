package org.nativescript.plugins.dropbox;

import android.os.AsyncTask;

import com.dropbox.core.util.IOUtil;
import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.files.FileMetadata;
import com.dropbox.core.v2.files.WriteMode;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

public class UploadFileTask extends AsyncTask<Void, Integer, FileMetadata> {

    private final String mPath;
    private final WriteMode mWriteMode;
    private final boolean mAutoRename;
    private final boolean mMute;
    private final byte[] mData;
    private final DbxClientV2 mDbxClient;
    private final DropboxPluginProgressListener mlistener;
    private Exception mException;

    public UploadFileTask(String path, WriteMode writeMode, boolean autoRename, boolean mute, byte[] data, DbxClientV2 dbxClient, DropboxPluginProgressListener callback) {
        super();
        mPath = path;
        mWriteMode = writeMode;
        mAutoRename = autoRename;
        mMute = mute;
        mData = data;
        mDbxClient = dbxClient;
        mlistener = callback;
    }

    @Override
    protected FileMetadata doInBackground(Void... params) {
        try {
            final int totalBytesExpectedToUploaded = mData.length;
            InputStream inputStream = new ByteArrayInputStream(mData);
            return mDbxClient.files().uploadBuilder(String.valueOf(mPath))
                    .withMode(mWriteMode)
                    .withAutorename(mAutoRename)
                    .withMute(mMute)
                    .uploadAndFinish(inputStream, new IOUtil.ProgressListener() {
                        @Override
                        public void onProgress(long bytesWritten) {
                            publishProgress((int) bytesWritten, totalBytesExpectedToUploaded);
                        }
                    });
        } catch (Exception e) {
            mException = e;
        }
        return null;
    }

    @Override
    protected  void onProgressUpdate(Integer... params) {
        mlistener.progress(params[0], params[1]);
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
}
