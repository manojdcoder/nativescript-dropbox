import { Common } from "./dropbox.common";

export * from "./dropbox.common";

export declare class Dropbox extends Common {
  static init(accessToken: string): void;
  createSharedLink(path: string): void;
  uploadData(path: string, data: any, overwrite?: boolean, autorename?: boolean, mute?: boolean): void;
}
