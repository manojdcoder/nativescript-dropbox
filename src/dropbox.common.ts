import { Observable, EventData } from "tns-core-modules/data/observable";

export interface DropboxEventData extends EventData {
    ios?: any;
    android?: any;
}

export interface SuccessEventData extends DropboxEventData {
    result?: any;
}

export interface ErrorEventData extends DropboxEventData {
    error?: any;
}

export interface ProgressEventData extends DropboxEventData {
    totalBytesUploaded: number;
    totalBytesExpectedToUploaded: number;
}

export class Common extends Observable {
    public static successEvent = "success";
    public static progressEvent = "progress";
    public static errorEvent = "error";
}
