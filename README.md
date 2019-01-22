# NativeScript Dropbox

## Prerequisites / Requirements
Dropbox User Access token

## Installation
From the command prompt go to your app's root folder and execute:

```javascript
tns plugin add nativescript-dropbox
```

## Demo app
If you want a quickstart, clone the repo, `cd src`, and `npm run demo.ios` or `npm run demo.android`.

## API

### init
Initiates the dropbox client with given token.

| Parameters | Type | Description |
| ---  | --- | --- |
| `accessToken` | `String` | User Access Token. |

```js
var Dropbox = require('nativescript-dropbox');
Dropbox.init("ACCESS_TOKEN");
```

### uploadData
Uploads the data at the given path.

| Parameters | Type | Description |
| ---  | --- | --- |
| `path` | `String` | Dropbox File Path. |
| `data` | `NSData | java.lang.Byte[]` | Binary data. |

```js
var dropbox = new Dropbox();

dropbox.addEventListener(Dropbox.successEvent, (event: SuccessEventData) => { ... });

dropbox.addEventListener(Dropbox.errorEvent, (event: ErrorEventData) => { ... });

dropbox.addEventListener(Dropbox.progressEvent, (event: ProgressEventData) => { ... });

dropbox.uploadData("/logo.png", knownFolders.currentApp().getFile(path.join("images", "logo.png")).readSync());
```

### createSharedLink
Creates a shared link for the given path.

| Parameters | Type | Description |
| ---  | --- | --- |
| `path` | `String` | Dropbox File Path. |

```js
var dropbox = new Dropbox();

dropbox.addEventListener(Dropbox.successEvent, (event: SuccessEventData) => { 
    var url = event.result;
});

dropbox.addEventListener(Dropbox.errorEvent, (event: ErrorEventData) => { ... });

dropbox.createSharedLink("/logo.png");
```