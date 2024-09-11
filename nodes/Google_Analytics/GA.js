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
        // console.log("JS:: config:", config);

        RED.nodes.createNode(node, config);
        
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
                    const ids =  msg.payload.ids || config.ids;
                    const scopes = [
                        "https://www.googleapis.com/auth/analytics",
                        "https://www.googleapis.com/auth/analytics.readonly"
                    ];
                    const metrics = msg.payload.metrics || config.metrics;
                    const startDate = msg.payload["start-date"] || config["start-date"];
                    const endDate = msg.payload["end-date"] || config["end-date"];
                    const dimensions = msg.payload.dimensions || config.dimensions;
                    const filters = msg.payload.filters || config.filters;
                    const maxResults = msg.payload.maxResults || config.maxResults;
                    const sortResults = msg.payload.sortResults || config.sortResults;

                    const clientEmail = msg.payload.clientEmail || config.clientEmail;
                    const privateKey = (msg.payload.privateKey || config.privateKey).replace(new RegExp("\\\\n", "\g"), "\n");

                    const auth = new google.auth.GoogleAuth({
                        credentials: {
                            client_email: clientEmail,
                            private_key: privateKey,
                          },
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
                    
                    msg.payload = JSON.stringify(response.data, null, 2);

                    if (done) {
                        node.send(msg);
                        this.status({ fill: "green", shape:"dot", text: time + JSON.stringify(msg.payload) });
                        done();
                    }

                } catch (error) {
                    let date_ob = new Date();
                    let time = `[${('0' + date_ob.getHours()).slice(-2)}:${('0' + date_ob.getMinutes()).slice(-2)}:${('0' + date_ob.getSeconds()).slice(-2)}] `;
                    console.error("ERROR: ", error);
                    msg.payload = error;
                    node.error(error);
                    node.send(
                       msg
                    );
                    this.status({ fill: "red", shape:"dot", text: time + error });
                }
            },
            // ======== UA rt ===========================================================================================
            rt: async (msg, send, done) => {
                try {
                    const ids = msg.payload.ids || config.ids;
                    const scopes = [
                        "https://www.googleapis.com/auth/analytics",
                        "https://www.googleapis.com/auth/analytics.readonly"
                    ];

                    const metrics = msg.payload.metrics || config.metrics;
                    const dimensions = msg.payload.dimensions || config.dimensions;
                    const filters = msg.payload.filters || config.filters;
                    const maxResults = msg.payload.maxResults || config.maxResults;
                    const sortResults = msg.payload.sortResults || config.sortResults;

                    const clientEmail = msg.payload.clientEmail || config.clientEmail;
                    const privateKey = (msg.payload.privateKey || config.privateKey).replace(new RegExp("\\\\n", "\g"), "\n");
                    
                    const auth = new google.auth.GoogleAuth({
                        credentials: {
                            client_email: clientEmail,
                            private_key: privateKey,
                          },
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
                    msg.payload = JSON.stringify(response.data, null, 2);

                    if (done) {
                        node.send(msg);
                        this.status({ fill: "green", shape:"dot", text: time + JSON.stringify(msg.payload) });
                        done();
                    }

                } catch (error) {
                    let date_ob = new Date();
                    let time = `[${('0' + date_ob.getHours()).slice(-2)}:${('0' + date_ob.getMinutes()).slice(-2)}:${('0' + date_ob.getSeconds()).slice(-2)}] `;
                    console.error("ERROR: ", error);
                    msg.payload = error;
                    node.error(error);
                    node.send(
                       msg
                    );
                    this.status({ fill: "red", shape:"dot", text: time + error });
                }
            },
            // ======== GA4 runReport ===================================================================================
            runReport: async (msg, send, done) => {
                try {
                    const propertyId = msg.payload.propertyId || config.propertyId;
                    const dimensions = msg.payload.dimensions || config.dimensions;
                    const metrics = msg.payload.metrics || config.metrics;
                    // const metricOrderBy = config.metricOrderBy;
                    // const dimensionOrderBy = config.dimensionOrderBy;
                    const metricOrderBy = msg.payload.metricOrderBy || config.metricOrderBy;
                    const dimensionOrderBy = msg.payload.dimensionOrderBy || config.dimensionOrderBy;
                    const dimensionOrderType = msg.payload.dimensionOrderType || config.dimensionOrderType;
                    const desc = msg.payload.desc || config.desc;
                    const sinceDate = msg.payload.sinceDate || config.sinceDate;
                    let startDate = msg.payload.startDate || config.startDate;
                    let endDate = msg.payload.endDate || config.endDate;

                    if (sinceDate!=="custom") {
                        startDate = sinceDate;
                        endDate = new Date().toISOString().split("T")[0];
                    } else{
                        const regexpr = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/i;
                    if (!startDate.match(regexpr) || !endDate.match(regexpr)){
                        msg.payload.error = "Wrong date!"
                         node.error(msg.payload.error, msg);
                                       node.status({ fill: 'red', shape: 'ring', text: 'failed' });
                                       return;
                    } else {
                        if (new Date(endDate).valueOf()< new Date(startDate).valueOf()){
                                                    msg.payload.error = "Wrong date!"
                                                    node.error(msg.payload.error, msg);
                                                                  node.status({ fill: 'red', shape: 'ring', text: 'failed' });
                                                                  return;                    
                                                }
                    }
                }

                    const limit = msg.payload.limit || config.limit;
                    const offset = ''; //config.offset;
                    
                    // Explicitly use service account credentials by specifying
                    // the private key file.
                    const clientEmail = msg.payload.clientEmail || config.clientEmail;
                    const privateKey = (msg.payload.privateKey || config.privateKey).replace(new RegExp("\\\\n", "\g"), "\n");
                    const analyticsDataClient = new BetaAnalyticsDataClient({
                        credentials: {
                            client_email: clientEmail,
                            private_key: privateKey,
                          },
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
                    let response;
                    try{
                    const [resp] = await analyticsDataClient.runReport(params);
                    response = resp;
                    } catch (error) {
                        throw new Error("Wrong  parameters or no results found")
                    }
                    this.status({ fill: "green", shape: "ring", text: "Response..." });
                    let date_ob = new Date();
                    let time = `[${('0' + date_ob.getHours()).slice(-2)}:${('0' + date_ob.getMinutes()).slice(-2)}:${('0' + date_ob.getSeconds()).slice(-2)}] `;
                    toConsole(params, response, time, showParams=true, showResponse=false, showRows=false, showValue=true);
                    msg.payload = JSON.stringify(response, null, 2);
                    if (done) {
                        node.send(msg);
                        this.status({ fill: "green", shape:"dot", text: time + "Success!" });
                        done();
                    }

                } catch (error) {
                    let date_ob = new Date();
                    let time = `[${('0' + date_ob.getHours()).slice(-2)}:${('0' + date_ob.getMinutes()).slice(-2)}:${('0' + date_ob.getSeconds()).slice(-2)}] `;
                    console.error("ERROR: ", error);
                    msg.payload = error;
                    node.error(error);
                    node.send(msg);
                    this.status({ fill: "red", shape:"dot", text: time + error });
                }
            },
            // ======== GA4 runRealtimeReport ===========================================================================
            runRealtimeReport: async (msg, send, done) => {
                try {
                    const propertyId = msg.payload.propertyId || config.propertyId;
                    const dimensions = msg.payload.dimensions || config.dimensions;
                    const metrics = msg.payload.metrics || config.metrics;
                    // const metricOrderBy = config.metricOrderBy;
                    // const dimensionOrderBy = config.dimensionOrderBy;
                    const metricOrderBy = msg.payload.metricOrderBy || config.metricOrderBy;
                    const dimensionOrderBy = msg.payload.dimensionOrderBy || config.dimensionOrderBy;
                    const endMinutesAgoTemp = msg.payload.endMinutesAgo || config.endMinutesAgo;
                    const startMinutesAgoTemp = msg.payload.startMinutesAgo || config.startMinutesAgo;
                    const endMinutesAgo = (endMinutesAgoTemp == undefined || endMinutesAgoTemp == '' || endMinutesAgoTemp < 0) ? 0 : endMinutesAgoTemp; // 29 
                    const startMinutesAgo = (startMinutesAgoTemp == undefined || startMinutesAgoTemp == '' || startMinutesAgoTemp > 29) ? 29 : startMinutesAgoTemp; // 29 
                    const limit = msg.payload.limit || config.limit;
                    const offset = ''; //config.offset;
                    
                    // Explicitly use service account credentials by specifying
                    // the private key file.
                    const clientEmail = msg.payload.clientEmail || config.clientEmail;
                    const privateKey = (msg.payload.privateKey || config.privateKey).replace(new RegExp("\\\\n", "\g"), "\n");

                    
                    const analyticsDataClient = new BetaAnalyticsDataClient({
                        credentials: {
                            client_email: clientEmail,
                            private_key: privateKey,
                          },
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
                    let response;
                    try{
                    const [resp] = await analyticsDataClient.runReport(params);
                    response = resp;
                    } catch (error) {
                        throw new Error("Wrong  parameters or no results found");
                    }
                    this.status({ fill: "green", shape: "ring", text: "Response..." });

                    let date_ob = new Date();
                    let time = `[${('0' + date_ob.getHours()).slice(-2)}:${('0' + date_ob.getMinutes()).slice(-2)}:${('0' + date_ob.getSeconds()).slice(-2)}] `;
                    toConsole(params, response, time, showParams=true, showResponse=false, showRows=false, showValue=true);
                    msg.payload = JSON.stringify(response, null, 2);
                    
                    if (done) {
                        node.send(msg);
                        this.status({ fill: "green", shape:"dot", text: time + "Success!" });
                        done();
                    }
                } catch (error) {
                    let date_ob = new Date();
                    let time = `[${('0' + date_ob.getHours()).slice(-2)}:${('0' + date_ob.getMinutes()).slice(-2)}:${('0' + date_ob.getSeconds()).slice(-2)}] `;
                    console.error("ERROR: ", error);
                    msg.payload = error;
                    node.error(error);
                    node.send(msg);
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
