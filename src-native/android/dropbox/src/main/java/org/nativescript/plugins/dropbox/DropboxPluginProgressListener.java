package org.nativescript.plugins.dropbox;

public interface DropboxPluginProgressListener extends DropboxPluginListener {
    void progress(long totalBytesUploaded, long totalBytesExpectedToUploaded);
}
