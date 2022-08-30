# node-red-contrib-google-analytics-ga

A Google Analytics node for Node-red:
 - by API for Universal Analytics (UA) v3
 - by API for GA4 v1

## Installation

```
cd ~/.node-red
npm i node-red-contrib-google-analytics-ga
```
*or*

From the Node-red:

 1. Menu / Manage Palette / Install / search modules
 2. Search by name 'node-red-contrib-google-analytics-ga'
 3. Choose and press Install button
 4. Use node in **Node-red** from category **Google**
 5. *Enjoy*

## Before you begin
Node must have access to GA API by credentials file (_*.json_). Follow the instructions for get it:
- Select or create a [Cloud Platform project](https://console.cloud.google.com/project)
- Enable the [Google Analytics Data API](https://console.cloud.google.com/flows/enableapi?apiid=analyticsdata.googleapis.com). More [Api libraries](https://console.cloud.google.com/apis/library)
- Add one(both) of those scopes into your project:
    - *```../auth/analytics```*
    - *```../auth/analytics.readonly```*
- Create a [service account](https://console.cloud.google.com/apis/credentials) for your project. Create key in **service account** and save credentials file(_*.json_) on your disk ([See step 1 (items 1-7)](https://developers.google.com/analytics/devguides/reporting/core/v3/quickstart/service-php#enable))
- Add service account (see *client_email* in _*.json_) to Google Analytics account by **Access Management**  ([See paragraph](https://developers.google.com/analytics/devguides/reporting/core/v3/quickstart/service-php#add-user))

## Usage

### All nodes have 3 outputs:
 1. formatted response (```object```)
 2. response.data (```array```)
 3. response (pretty```json```)

> ![](https://github.com/mdevsmarthome/screenshots/blob/main/screenshots/GA/GA_node.PNG?raw=true)

 ### Node has 4 functions for using:

 - Universal Analytics(UA) API v3 ga (by function [ga](https://developers.google.com/analytics/devguides/reporting/core/v3/reference))
 - Universal Analytics(UA) API v3 realtime (by function [Realtime](https://developers.google.com/analytics/devguides/reporting/realtime/v3/reference/data/realtime/get))
 - GA4 API v1 (by function [runReport](https://developers.google.com/analytics/devguides/reporting/data/v1/basics))
 - GA4 API v1 realtime (by function [runRealtimeReport](https://developers.google.com/analytics/devguides/reporting/data/v1/realtime-basics))

> ![](https://github.com/mdevsmarthome/screenshots/blob/main/screenshots/GA/GA_dialog.PNG?raw=true)


Edit node:
- input some ID of Google Analytics account
- input path to credentials file(_*.json_). Please keep this file in a location that is not publicly accessible.
- fill in the rest of the fields depending on your needs.

## Release

- 2022/08/29: Alpha release v1.0.0

## License

Licensed under the [Apache License, Version 2.0](LICENSE)
