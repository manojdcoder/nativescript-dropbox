import { SuccessEventData, ErrorEventData, ProgressEventData, Common } from "./dropbox.common";

export class Dropbox extends Common {

    private static _client: DBUserClient;

    public static init(accessToken: string) {
        if (!Dropbox._client) {
            Dropbox._client = DBUserClient.alloc().initWithAccessToken(accessToken);
        }
    }

    createSharedLink(path: string) {
        Dropbox._client.sharingRoutes.createSharedLink(path)
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
                            error: routeError || networkError
                        };
                        this.notify(eventData);
                    }
                }
            });
    }

    uploadData(path: string, data: NSData) {
        Dropbox._client.filesRoutes
            .uploadDataInputData(path, data)
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
