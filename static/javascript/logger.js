var BrewingCatsCore;
(function (BrewingCatsCore) {
    let LogCategory;
    (function (LogCategory) {
        LogCategory["Bootstrap"] = "Bootstrap";
        LogCategory["GDPR"] = "GDPR";
        LogCategory["ComponentSetup"] = "ComponentSetup";
        LogCategory["Configuration"] = "Configuration";
        LogCategory["ComponentInteraction"] = "ComponentInteraction";
    })(LogCategory = BrewingCatsCore.LogCategory || (BrewingCatsCore.LogCategory = {}));
    let LogType;
    (function (LogType) {
        LogType["Debug"] = "Debug";
        LogType["Info"] = "Info";
        LogType["Warning"] = "Warning";
        LogType["Error"] = "Error";
    })(LogType = BrewingCatsCore.LogType || (BrewingCatsCore.LogType = {}));
    class Logger {
        static customTrace(client, message, logType, caller, tagId, category, metrics) {
            if (!BrewingCatsCore.Config.TelemetryEnabled) {
                console.log("Telemetry is disabled on this client");
                return;
            }
            if (metrics === undefined) {
                metrics = {};
            }
            metrics['SessionId'] = BrewingCatsCore.Config.SessionId;
            metrics['ClientId'] = BrewingCatsCore.Config.ClientId;
            let timestamp = new Date();
            let idx = `${timestamp.toISOString().split('-')[0]}${timestamp.toISOString().split('-')[1]}`;
            let log = {
                timestamp: timestamp.getTime(),
                client: client,
                caller: caller,
                category: category,
                type: logType,
                tagId: tagId,
                message: message,
                metrics: metrics,
                indexId: idx
            };
            switch (logType) {
                case LogType.Debug: {
                    console.debug(log);
                    break;
                }
                case LogType.Warning: {
                    console.warn(log);
                    break;
                }
                case LogType.Error: {
                    console.error(log);
                    break;
                }
                default:
                    console.log(log);
            }
            if (!window.location.origin.includes('localhost')) {
                let request = {
                    body: JSON.stringify(log),
                    method: 'POST',
                    mode: 'cors',
                    redirect: 'follow',
                    referrerPolicy: 'no-referrer',
                    headers: {
                        'Accept': '*/*',
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        'Origin': window.location.origin
                    }
                };
                let p = fetch(BrewingCatsCore.Config.TelemetryUrl, request).then((response) => {
                    response.json().then((v) => { console.log(v); });
                });
            }
            else {
                console.log('Skipped Telemetry');
            }
        }
        static trace(log) {
            Logger.customTrace(log.client, log.message, log.type, log.caller, log.tagId, log.category, log.metrics);
        }
        static traceLog(message, logType, caller, tagId, category, metrics) {
            Logger.customTrace('BrewingCatsCore', message, logType, caller, tagId, category, metrics);
        }
        static traceInfo(message, caller, tagId, category, metrics) {
            Logger.traceLog(message, LogType.Info, caller, tagId, category, metrics);
        }
        static traceDebug(message, caller, tagId, category, metrics) {
            Logger.traceLog(message, LogType.Debug, caller, tagId, category, metrics);
        }
        static traceWarn(message, caller, tagId, category, metrics) {
            Logger.traceLog(message, LogType.Warning, caller, tagId, category, metrics);
        }
        static traceError(message, caller, tagId, category, metrics) {
            Logger.traceLog(message, LogType.Error, caller, tagId, category, metrics);
        }
    }
    BrewingCatsCore.Logger = Logger;
    class TraceLog {
    }
    BrewingCatsCore.TraceLog = TraceLog;
})(BrewingCatsCore || (BrewingCatsCore = {}));
if (window.BrewingCatsCore === undefined) {
    window.BrewingCatsCore = BrewingCatsCore;
}
