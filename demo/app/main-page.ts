import { knownFolders, path } from "tns-core-modules/file-system";
import { EventData } from "tns-core-modules/data/observable";
import { View } from "tns-core-modules/ui/core/view";
import { Page } from "tns-core-modules/ui/page";

import {
    SuccessEventData,
    ErrorEventData,
    ProgressEventData,
    Dropbox
} from "nativescript-dropbox";

import { HelloWorldModel } from "./main-view-model";

// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: EventData) {
    // Get the event sender
    let page = <Page>args.object;
    page.bindingContext = new HelloWorldModel();

    // Initiate with your access token
    Dropbox.init("ACCESS_TOKEN");
}

export function onUploadButtonTap(args: EventData) {
    const bindingContext = (<View>args.object).page.bindingContext,
        dropbox = new Dropbox();

    dropbox.addEventListener(Dropbox.successEvent, (event: SuccessEventData) => {
        bindingContext.set("status", `Uploaded`);
    });

    dropbox.addEventListener(Dropbox.errorEvent, (event: ErrorEventData) => {
        bindingContext.set("status", `Error`);
    });

    dropbox.addEventListener(Dropbox.progressEvent, (event: ProgressEventData) => {
        bindingContext.set("status", `Uploading: ${event.totalBytesUploaded} / ${event.totalBytesExpectedToUploaded}`);
    });

    dropbox.uploadData("/logo.png", knownFolders.currentApp().getFile(path.join("images", "logo.png")).readSync());
}

export function onShareButtonTap(args: EventData) {
    const bindingContext = (<View>args.object).page.bindingContext,
        dropbox = new Dropbox();

    dropbox.addEventListener(Dropbox.successEvent, (event: SuccessEventData) => {
        bindingContext.set("status", `URL: ${event.result}`);
        bindingContext.set("url", `${event.result}&raw=1`);
    });

    dropbox.addEventListener(Dropbox.errorEvent, (event: ErrorEventData) => {
        bindingContext.set("status", `Unable to create shared link`);
    });

    dropbox.createSharedLink("/logo.png");
}
