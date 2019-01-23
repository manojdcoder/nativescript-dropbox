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
| `data` | `NSData or java.lang.Byte[]` | Binary data. |

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
## Known issues on Android

#### Dropbox SDK requires API Level 19 (Kitkat - 4.4) or above
You might have to modify the `minSdkVersion` entry in your `App_Resources/Android/src/main/AndroidManifest.xml` 

```xml
<uses-sdk
	android:minSdkVersion="19"
	...
```

#### The number of method references in a .dex file cannot exceed 64K.

This can be solved by adding `multiDexEnabled true` to your `app/App_Resources/Android/app.gradle`

```
android {  
  defaultConfig {  
    applicationId = "__PACKAGE__"  
    multiDexEnabled true
    generatedDensities = []
  }  
  aaptOptions {  
    additionalParameters "--no-version-vectors"  
  }  
}
```