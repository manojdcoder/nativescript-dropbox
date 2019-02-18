import { SuccessEventData, ErrorEventData, ProgressEventData, Common } from "./dropbox.common";

export class Dropbox extends Common {

    public static client: com.dropbox.core.v2.DbxClientV2;

    public static init(accessToken: string) {
        if (!Dropbox.client) {
            const requestConfig = com.dropbox.core.DbxRequestConfig.newBuilder("nativescript-dropbox").build();
            Dropbox.client = new com.dropbox.core.v2.DbxClientV2(requestConfig, accessToken);
        }
    }

    public static dispose() {
        if (Dropbox.client) {
            Dropbox.client = null;
        }
    }

    createSharedLink(path: string) {
        const instance = this;
        new org.nativescript.plugins.dropbox.ShareFileTask(path, Dropbox.client,
            new org.nativescript.plugins.dropbox.DropboxPluginListener({
                success(result: com.dropbox.core.v2.sharing.SharedLinkMetadata) {
                    if (instance.hasListeners(Dropbox.successEvent)) {
                        const eventData: SuccessEventData = {
                            eventName: Dropbox.successEvent,
                            object: instance,
                            result: result.url,
                            android: result
                        };
                        instance.notify(eventData);
                    }
                },
                error(error: java.lang.Exception) {
                    if (instance.hasListeners(Dropbox.errorEvent)) {
                        const eventData: ErrorEventData = {
                            eventName: Dropbox.errorEvent,
                            object: instance,
                            android: error
                        };
                        instance.notify(eventData);
                    }
                }
            })).execute(null);
    }

    uploadData(path: string, data: java.lang.Byte[], overwrite: boolean = true, autorename: boolean = false, mute: boolean = false) {
        const instance = this,
            overwriteMode = overwrite ? com.dropbox.core.v2.files.WriteMode.OVERWRITE : com.dropbox.core.v2.files.WriteMode.ADD;
        new org.nativescript.plugins.dropbox.UploadFileTask(path, overwriteMode, autorename, mute, <any>data, Dropbox.client,
            new org.nativescript.plugins.dropbox.DropboxPluginProgressListener({
                success(result: com.dropbox.core.v2.files.FileMetadata) {
                    if (instance.hasListeners(Dropbox.successEvent)) {
                        const eventData: SuccessEventData = {
                            eventName: Dropbox.successEvent,
                            object: instance,
                            android: result
                        };
                        instance.notify(eventData);
                    }
                },
                error(error: java.lang.Exception) {
                    if (instance.hasListeners(Dropbox.errorEvent)) {
                        const eventData: ErrorEventData = {
                            eventName: Dropbox.errorEvent,
                            object: instance,
                            android: error
                        };
                        instance.notify(eventData);
                    }
                },
                progress(totalBytesUploaded: number, totalBytesExpectedToUploaded: number) {
                    if (instance.hasListeners(Dropbox.progressEvent)) {
                        const eventData: ProgressEventData = {
                            eventName: Dropbox.progressEvent,
                            object: instance,
                            totalBytesUploaded: totalBytesUploaded,
                            totalBytesExpectedToUploaded: totalBytesExpectedToUploaded
                        };
                        instance.notify(eventData);
                    }
                }
            })).execute(null);
    }
}
