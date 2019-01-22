package org.nativescript.plugins.dropbox;

public interface DropboxPluginListener {
    void success(Object result);
    void error(Exception error);
}
