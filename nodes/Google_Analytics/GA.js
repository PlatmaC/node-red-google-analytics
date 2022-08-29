module.exports = (RED) => {
    ("use strict");

    // Imports the Google Analytics Data API client library.
    // for UA
    const { google } = require("googleapis");
    const analytics = google.analytics("v3");

    // for GA4
    const { BetaAnalyticsDataClient } = require("@google-analytics/data");

    const main = function (config) {
        const node = this;
        // console.log("JS:: node:", node);
        console.log("JS:: config:", config);

        RED.nodes.createNode(node, config);

        function TrackerUA_ga(msg, send, done) {
            console.log("TrackerUA_ga:: ");
        }
        
        function toConsole(params, response, time, showParams=true, showResponse=false, showRows=false, showValue=true) {
            if (showParams)
                console.log(`${time}params:`, JSON.stringify(params, null, 2));
            if (showResponse)
                console.log(`${time}response:`, JSON.stringify(response, null, 2));
            if (showRows || showValue)
                console.log(`${time}Report result:`);
            if (showRows)
                response.rows.forEach((row) => {
                    console.log(row.dimensionValues[0], row.metricValues[0]);
                });
            if (showValue)
                console.log(`${time}Value:`, response.rows[0].metricValues[0]);    
        }
        const methods = {
            // ======== UA ga ===========================================================================================
            ga: async (msg, send, done) => {
                try {
                    const ids = config.ids;
                    const credentialsJsonPath = config.jsonpath;
                    const scopes = [
                        "https://www.googleapis.com/auth/analytics",
                        "https://www.googleapis.com/auth/analytics.readonly"
                    ];
                    const metrics = config.metrics;
                    const startDate = config["start-date"];
                    const endDate = config["end-date"];
                    const dimensions = config.dimensions;
                    const filters = config.filters;
                    const maxResults = config.maxResults;
                    const sortResults = config.sortResults;
                    const auth = new google.auth.GoogleAuth({
                        keyFile: credentialsJsonPath,
                        scopes: scopes,
                    });

                    google.options({ auth });

                    let params = {
                        ids: `${ids}`,
                        metrics: `${metrics}`,
                        "start-date": `${startDate}`,
                        "end-date": `${endDate}`,
                    };
                    if (`${dimensions}` != undefined && `${dimensions}` != '')
                        params.dimensions = `${dimensions}`;
                    if (`${filters}` != undefined && `${filters}` != '')
                        params.filters = `${filters}`;
                    if (`${maxResults}` != undefined && `${maxResults}` != '')
                        params["max-results"] = `${maxResults}`;
                    if (`${sortResults}` != undefined && `${sortResults}` != '')
                        params.sort = `${sortResults}`;

                    this.status({ fill: "blue", shape: "dot", text: "Params ready ..." });
                    const response = await analytics.data.ga.get(params);
                    this.status({ fill: "green", shape: "ring", text: "Response..." });

                    let date_ob = new Date();
                    let time = `[${('0' + date_ob.getHours()).slice(-2)}:${('0' + date_ob.getMinutes()).slice(-2)}:${('0' + date_ob.getSeconds()).slice(-2)}] `;
                    toConsole(params, response.data, time, showParams=true, showResponse=true, showRows=false, showValue=false);
                    
                    msg.payload = { totalResults: response.data.totalResults, value: response.data.totalsForAllResults[metrics] };

                    if (done) {
                        node.send([msg, { payload: response.data.rows }, { payload: JSON.stringify(response.data, null, 2) }]);
                        this.status({ fill: "green", shape:"dot", text: time + JSON.stringify(msg.payload) });
                        done();
                    }

                } catch (error) {
                    console.error("ERROR: ", error);
                    msg.payload = error;
                    node.error(error);
                    node.send([
                        { payload: { code: error.code, details: error.details } },
                        { payload: { code: error.code, details: error.details } },
                        { payload: { code: error.code, details: error.details } }
                    ]);
                    this.status({ fill: "red", shape:"dot", text: time + error });
                }
            },
            // ======== UA rt ===========================================================================================
            rt: async (msg, send, done) => {
                try {
                    const ids = config.ids;
                    const credentialsJsonPath = config.jsonpath;
                    const scopes = [
                        "https://www.googleapis.com/auth/analytics",
                        "https://www.googleapis.com/auth/analytics.readonly"
                    ];
                    const metrics = config.metrics;
                    const dimensions = config.dimensions;
                    const filters = config.filters;
                    const maxResults = config.maxResults;
                    const sortResults = config.sortResults;
                    const auth = new google.auth.GoogleAuth({
                        keyFile: credentialsJsonPath,
                        scopes: scopes,
                    });

                    google.options({ auth });

                    let params = {
                        ids: `${ids}`,
                        metrics: `${metrics}`,
                    };
                    if (`${dimensions}` != undefined && `${dimensions}` != '')
                        params.dimensions = `${dimensions}`;
                    if (`${filters}` != undefined && `${filters}` != '')
                        params.filters = `${filters}`;
                    if (`${maxResults}` != undefined && `${maxResults}` != '')
                        params["max-results"] = `${maxResults}`;
                    if (`${sortResults}` != undefined && `${sortResults}` != '')
                        params.sort = `${sortResults}`;

                    this.status({ fill: "blue", shape: "dot", text: "Params ready ..." });
                    const response = await analytics.data.realtime.get(params);
                    this.status({ fill: "green", shape: "ring", text: "Response..." });

                    let date_ob = new Date();
                    let time = `[${('0' + date_ob.getHours()).slice(-2)}:${('0' + date_ob.getMinutes()).slice(-2)}:${('0' + date_ob.getSeconds()).slice(-2)}] `;
                    toConsole(params, response.data, time, showParams=true, showResponse=true, showRows=false, showValue=false);
                    msg.payload = { totalResults: response.data.totalResults, value: response.data.totalsForAllResults[metrics] };

                    if (done) {
                        node.send([msg, { payload: response.data.rows }, { payload: JSON.stringify(response.data, null, 2) }]);
                        this.status({ fill: "green", shape:"dot", text: time + JSON.stringify(msg.payload) });
                        done();
                    }

                } catch (error) {
                    console.error("ERROR: ", error);
                    msg.payload = error;
                    node.error(error);
                    node.send([
                        { payload: { code: error.code, details: error.details } },
                        { payload: { code: error.code, details: error.details } },
                        { payload: { code: error.code, details: error.details } }
                    ]);
                    this.status({ fill: "red", shape:"dot", text: time + error });
                }
            },
            // ======== GA4 runReport ===================================================================================
            runReport: async (msg, send, done) => {
                try {
                    const propertyId = config.propertyId;
                    const credentialsJsonPath = config.jsonpath;
                    const dimensions = config.dimensions;
                    const metrics = config.metrics;
                    // const metricOrderBy = config.metricOrderBy;
                    // const dimensionOrderBy = config.dimensionOrderBy;
                    const metricOrderBy = config.metricOrderBy;
                    const dimensionOrderBy = config.dimensionOrderBy;
                    const dimensionOrderType = config.dimensionOrderType;
                    const desc = config.desc;
                    const startDate = config.startDate;
                    const endDate = config.endDate;
                    const limit = config.limit;
                    const offset = ''; //config.offset;
                    
                    // Explicitly use service account credentials by specifying
                    // the private key file.
                    const analyticsDataClient = new BetaAnalyticsDataClient({
                        keyFilename: `${credentialsJsonPath}`,
                    });
    
                    let params = {
                        property: `properties/${propertyId}`,
                        dateRanges: [
                            {
                                startDate: `${startDate}`,
                                endDate: `${endDate}`,
                            }, 
                        ],
                    };
                    if (`${metrics}` != undefined && `${metrics}` != '')
                        params.metrics = [{ name: `${metrics}` }];
                    if (`${dimensions}` != undefined && `${dimensions}` != '')
                        params.dimensions = [{ name: `${dimensions}` }];

                    if ((`${metricOrderBy}` != undefined && `${metricOrderBy}` != '') || (`${dimensionOrderBy}` != undefined && `${dimensionOrderBy}` != ''))
                        params.orderBys = [{ desc: (`${desc}`== 'DESC') ? true : false }];
                    if (`${metricOrderBy}` != undefined && `${metricOrderBy}` != '')
                        params.orderBys[0].metric = { "metricName": `${metricOrderBy}` };
                    if (`${dimensionOrderBy}` != undefined && `${dimensionOrderBy}` != '')
                        params.orderBys[0].dimension = {
                            "dimensionName": `${dimensionOrderBy}`, "orderType": `${dimensionOrderType}`
                        };
                    if (`${offset}` != undefined && `${offset}` != '')
                        params["offset"] = `${limit}`;
                    if (`${limit}` != undefined && `${limit}` != '')
                        params["limit"] = `${limit}`;

                    this.status({ fill: "blue", shape: "dot", text: "Params ready ..." });
                    const [response] = await analyticsDataClient.runReport(params);
                    this.status({ fill: "green", shape: "ring", text: "Response..." });

                    let date_ob = new Date();
                    let time = `[${('0' + date_ob.getHours()).slice(-2)}:${('0' + date_ob.getMinutes()).slice(-2)}:${('0' + date_ob.getSeconds()).slice(-2)}] `;
                    toConsole(params, response, time, showParams=true, showResponse=false, showRows=false, showValue=true);
                    msg.payload = response.rows[0].metricValues[0].value;

                    if (done) {
                        node.send([msg, { payload: response.rows }, { payload: JSON.stringify(response, null, 2) }]);
                        this.status({ fill: "green", shape:"dot", text: time + JSON.stringify(msg.payload) });
                        done();
                    }

                } catch (error) {
                    console.error("ERROR: ", error);
                    msg.payload = error;
                    node.error(error);
                    node.send([
                        { payload: { code: error.code, details: error.details } },
                        { payload: { code: error.code, details: error.details } },
                        { payload: { code: error.code, details: error.details } }
                    ]);
                    this.status({ fill: "red", shape:"dot", text: time + error });
                }
            },
            // ======== GA4 runRealtimeReport ===========================================================================
            runRealtimeReport: async (msg, send, done) => {
                try {
                    const propertyId = config.propertyId;
                    const credentialsJsonPath = config.jsonpath;
                    const dimensions = config.dimensions;
                    const metrics = config.metrics;
                    // const metricOrderBy = config.metricOrderBy;
                    // const dimensionOrderBy = config.dimensionOrderBy;
                    const metricOrderBy = config.metricOrderBy;
                    const dimensionOrderBy = config.dimensionOrderBy;
                    const dimensionOrderByOrderType = config.dimensionOrderByOrderType;
                    const endMinutesAgo = (config.endMinutesAgo == undefined || config.endMinutesAgo == '' || config.endMinutesAgo < 0) ? 0 : config.endMinutesAgo; // 29 
                    const startMinutesAgo = (config.startMinutesAgo == undefined || config.startMinutesAgo == '' || config.startMinutesAgo > 29) ? 29 : config.startMinutesAgo; // 29 
                    const limit = config.limit;

                    // Explicitly use service account credentials by specifying
                    // the private key file.
                    const analyticsDataClient = new BetaAnalyticsDataClient({
                        keyFilename: credentialsJsonPath,
                    });

                    let params = {
                        property: `properties/${propertyId}`,
                    };
                    if (`${metrics}` != undefined && `${metrics}` != '')
                        params.metrics = [{ name: `${metrics}` }];
                    if (`${dimensions}` != undefined && `${dimensions}` != '')
                        params.dimensions = [{ name: `${dimensions}` }];

                    if ((`${metricOrderBy}` != undefined && `${metricOrderBy}` != '') || (`${dimensionOrderBy}` != undefined && `${dimensionOrderBy}` != ''))
                        params.orderBys = [{}];
                    if (`${metricOrderBy}` != undefined && `${metricOrderBy}` != '')
                        params.orderBys[0].metric = { "metricName": `${metricOrderBy}` };
                    if (`${dimensionOrderBy}` != undefined && `${dimensionOrderBy}` != '')
                        params.orderBys[0].dimension = {
                            "dimensionName": `${dimensionOrderBy}`, "orderType": `${dimensionOrderByOrderType}`
                        };
                    if (`${limit}` != undefined && `${limit}` != '')
                        params["limit"] = `${limit}`;
                    params.minuteRanges = [ // https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runRealtimeReport#MinuteRange
                        {
                            "name": "minRanges",
                            "endMinutesAgo": `${endMinutesAgo}`,
                            "startMinutesAgo": `${startMinutesAgo}`,
                        },
                    ];

                    this.status({ fill: "blue", shape: "dot", text: "Params ready ..." });
                    const [response] = await analyticsDataClient.runRealtimeReport(params);
                    this.status({ fill: "green", shape: "ring", text: "Response..." });

                    let date_ob = new Date();
                    let time = `[${('0' + date_ob.getHours()).slice(-2)}:${('0' + date_ob.getMinutes()).slice(-2)}:${('0' + date_ob.getSeconds()).slice(-2)}] `;
                    toConsole(params, response, time, showParams=true, showResponse=false, showRows=false, showValue=true);
                     msg.payload = response.rows[0].metricValues[0].value;
    
                    if (done) {
                        node.send([msg, { payload: response.rows }, { payload: JSON.stringify(response, null, 2) }]);
                        this.status({ fill: "green", shape:"dot", text: time + JSON.stringify(msg.payload) });
                        done();
                    }
                } catch (error) {
                    console.error("ERROR: ", error);
                    msg.payload = error;
                    node.error(error);
                    node.send([
                        { payload: { code: error.code, details: error.details } },
                        { payload: { code: error.code, details: error.details } },
                        { payload: { code: error.code, details: error.details } }
                    ]);
                    this.status({ fill: "red", shape:"dot", text: time + error });
                }
            },
        };


        console.log("config tracker&functions:", config.tracker, config.functions);
        this.status({ fill: "blue", shape: "ring", text: "Ready..." });
        node.on("input", methods[config.functions]);
    };

    RED.nodes.registerType("Google Analytics", main, {
        credentials: {
            // Credentials: {type:"password"},
            // AccessToken: {type:"password"},
        },
    });
};



                    // if (error) {
                    //     node.log("node.log err=",error);
                    //     if (done) {
                    //         // Node-RED 1.0 compatible
                    //         done(error);
                    //     } else {
                    //         // Node-RED 0.x compatible
                    //         node.error(error, msg);
                    //     }
                    // }