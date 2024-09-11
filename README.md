Fork of the node-red-contrib-google-analytics-ga package with changed auth method and some fixes
[node-red-contrib-google-analytics-ga repository](https://github.com/mdevsmarthome/node-red-contrib-google-analytics-ga.git)

## Features

Run different reports by GA4 and UA Google Analytics API.

## Use cases

1. Automation of running reports and processing them.
2. Create custom dashboards with metrics necessary just for you.

## Installation

@platmac/node-red-google-analytics-ga can be install using the node-red editor's pallete or by running npm in the console:

```
npm i @platmac/node-red-google-analytics-ga
```
*or*

From the Node-red:

 1. Menu / Manage Palette / Install / search modules
 2. Search by name '@platmac/node-red-google-analytics-ga'
 3. Choose and press Install button
 4. Use node in **Node-red** from category **Google**


## Setup Google Analytics API connection
Node must have access to GA API by credentials file (_*.json_). Follow the instructions for get it:
- Select or create a [Cloud Platform project](https://console.cloud.google.com/project)
- Enable the [Google Analytics Data API](https://console.cloud.google.com/flows/enableapi?apiid=analyticsdata.googleapis.com). More [Api libraries](https://console.cloud.google.com/apis/library)
- Add one(both) of those scopes into your project on "Oauth consent screen" page:
    - *```../auth/analytics```*
    - *```../auth/analytics.readonly```*
- Create a [service account](https://console.cloud.google.com/apis/credentials) for your project. Create key in **service account** and save credentials file(_*.json_) on your disk ([See items 1-7 on step 1](https://developers.google.com/analytics/devguides/reporting/core/v3/quickstart/service-php#enable))
- Add service account (see *client_email* in _*.json_) to Google Analytics account by **Access Management**  ([See paragraph](https://developers.google.com/analytics/devguides/reporting/core/v3/quickstart/service-php#add-user))

## Usage

 ### Node has 4 functions for using:

 - Universal Analytics(UA) API v3 ga (by function [ga](https://developers.google.com/analytics/devguides/reporting/core/v3/reference))
 - Universal Analytics(UA) API v3 realtime (by function [Realtime](https://developers.google.com/analytics/devguides/reporting/realtime/v3/reference/data/realtime/get))
 - GA4 API v1 (by function [runReport](https://developers.google.com/analytics/devguides/reporting/data/v1/basics))
 - GA4 API v1 realtime (by function [runRealtimeReport](https://developers.google.com/analytics/devguides/reporting/data/v1/realtime-basics))

 ### Node input properties: 

 All properties have to be inside **msg.payload** object.

* **ids** - id of property to run UA reports for
* **propertyId** - id of property to run GA4 reports for
* **clientEmail** - field from credentials json file
* **privateKey** - field from credentials json file
* **dimensions** - the dimensions requested and displayed
* **metrics** - the metrics requested and displayed.
* **start-date** - start of report date (YYYY-MM-DD) or templated for UA report
* **end-date** - end of report date (YYYY-MM-DD) or templated for UA report
* **filters** - filters for UA report 
* **maxResults** - the number of rows to return for UA report
* **sortResults** - sort field for UA report
* **metricOrderBy** - field to order metric by it
* **dimensionOrderBy** - field to order dimension by it
* **dimensionOrderType** - type of order dimension
* **endMinutesAgo** - end of report date in minutes before report request. Only for realtime reports
* **startMinutesAgo** - start of report date in minutes before report request. Only for realtime reports
* **limit** - the number of rows to return. If unspecified, 10,000 rows are returned. The API returns a maximum of 250,000 rows per request, no matter how many you ask for. limit must be positive.
* **sinceDate** - the date field with templated values and element "custom" that allows to use another way to select date
* **startDate** - start of report date (YYYY-MM-DD)
* **endDate** - end of report date (YYYY-MM-DD)