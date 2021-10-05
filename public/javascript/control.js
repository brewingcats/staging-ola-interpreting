var BrewingCatsCore;
(function (BrewingCatsCore) {
    class Control {
        static Init() {
            let nSession = false;
            let session = window.sessionStorage.getItem('SessionId');
            if (session === null) {
                session = BrewingCatsCore.GUID.New();
                window.sessionStorage.setItem('SessionId', session);
                nSession = true;
            }
            BrewingCatsCore.Config.SessionId = session;
            let client = window.localStorage.getItem('ClientId');
            if (client === null) {
                client = BrewingCatsCore.GUID.New();
                window.localStorage.setItem('ClientId', client);
            }
            BrewingCatsCore.Config.ClientId = client;
            let disabledTelemetry = window.localStorage.getItem('DisabledTelemetry');
            if ('true' === disabledTelemetry) {
                nSession = false;
                BrewingCatsCore.Config.TelemetryEnabled = false;
            }
            if (nSession) {
                BrewingCatsCore.Logger.traceInfo('New user session', 'BrewingCatsCore.Control', 'tagId_7', BrewingCatsCore.LogCategory.Bootstrap, {
                    'userAgent': window.navigator.userAgent
                });
            }
            $(() => {
                BrewingCatsCore.Gdpr.UpdateGdpr();
            });
        }
        static UpdateStats(callback) {
            let statsData = {
                host: window.location.origin,
                url: `${window.location.origin}${window.location.pathname}`
            };
            let request = {
                body: JSON.stringify(statsData),
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
            fetch(BrewingCatsCore.Config.StatsUrl, request).then((response) => {
                response.json().then((r) => {
                    let serverResponse = r;
                    let statsData = {
                        UserPageViews: 1,
                        UserSiteViews: 1,
                        SiteViews: serverResponse.SiteViews,
                        PageViews: serverResponse.PageViews
                    };
                    if (window.localStorage.getItem('UserSiteViews') !== null) {
                        statsData.UserSiteViews = Number.parseInt(window.localStorage.getItem('UserSiteViews')) + 1;
                        window.localStorage.setItem('UserSiteViews', `${statsData.UserSiteViews}`);
                    }
                    else {
                        window.localStorage.setItem('UserSiteViews', '1');
                    }
                    let pageUrl = BrewingCatsCore.Util.toBase64(`${window.location.origin}${window.location.pathname}`);
                    if (window.localStorage.getItem(pageUrl) !== null) {
                        statsData.UserPageViews = Number.parseInt(window.localStorage.getItem(pageUrl)) + 1;
                        window.localStorage.setItem(pageUrl, `${statsData.UserPageViews}`);
                    }
                    else {
                        window.localStorage.setItem(pageUrl, '1');
                    }
                    callback(statsData);
                });
            });
        }
    }
    BrewingCatsCore.Control = Control;
})(BrewingCatsCore || (BrewingCatsCore = {}));
if (window.BrewingCatsCore === undefined) {
    window.BrewingCatsCore = BrewingCatsCore;
}
