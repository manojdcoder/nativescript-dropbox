import { SuccessEventData, ErrorEventData, ProgressEventData, Common } from "./dropbox.common";

export class Dropbox extends Common {

    public static client: DBUserClient;

    public static init(accessToken: string) {
        if (!Dropbox.client) {
            Dropbox.client = DBUserClient.alloc().initWithAccessToken(accessToken);
        }
    }

    public static dispose() {
        if (Dropbox.client) {
            Dropbox.client = null;
        }
    }

    createSharedLink(path: string) {
        Dropbox.client.sharingRoutes.createSharedLink(path)
            .setResponseBlock((result: DBSHARINGPathLinkMetadata, routeError: DBSHARINGCreateSharedLinkError, networkError: DBRequestError) => {
                if (result) {
                    if (this.hasListeners(Dropbox.successEvent)) {
                        const eventData: SuccessEventData = {
                            eventName: Dropbox.successEvent,
                            object: this,
                            result: result.url,
                            ios: result
                        };
                        this.notify(eventData);
                    }
                } else {
                    if (this.hasListeners(Dropbox.errorEvent)) {
                        const eventData: ErrorEventData = {
                            eventName: Dropbox.errorEvent,
                            object: this,
                            ios: routeError || networkError
                        };
                        this.notify(eventData);
                    }
                }
            });
    }

    uploadData(path: string, data: NSData, overwrite: boolean = true, autorename: boolean = false, mute: boolean = false) {
        let writeMode = DBFILESWriteMode.alloc();
        if (overwrite) {
            writeMode = writeMode.initWithOverwrite();
        } else {
            writeMode = writeMode.initWithAdd();
        }
        Dropbox.client.filesRoutes
            .uploadDataModeAutorenameClientModifiedMutePropertyGroupsStrictConflictInputData(path, writeMode, <any>autorename,
                null, <any>mute, null, <any>false, data)
            .setResponseBlock((result: DBFILESFileMetadata, routeError: DBFILESUploadError, networkError: DBRequestError) => {
                if (result) {
                    if (this.hasListeners(Dropbox.successEvent)) {
                        const eventData: SuccessEventData = {
                            eventName: Dropbox.successEvent,
                            object: this,
                            ios: result
                        };
                        this.notify(eventData);
                    }
                } else {
                    if (this.hasListeners(Dropbox.errorEvent)) {
                        const eventData: ErrorEventData = {
                            eventName: Dropbox.errorEvent,
                            object: this,
                            ios: routeError || networkError
                        };
                        this.notify(eventData);
                    }
                }
            })
            .setProgressBlock((bytesUploaded, totalBytesUploaded, totalBytesExpectedToUploaded) => {
                if (this.hasListeners(Dropbox.progressEvent)) {
                    const eventData: ProgressEventData = {
                        eventName: Dropbox.progressEvent,
                        object: this,
                        totalBytesUploaded: totalBytesUploaded,
                        totalBytesExpectedToUploaded: totalBytesExpectedToUploaded
                    };
                    this.notify(eventData);
                }
            });
    }
}
