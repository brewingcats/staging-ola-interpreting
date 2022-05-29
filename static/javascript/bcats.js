var AutoInstagram;
(function (AutoInstagram) {
    class Control {
        static isInitialized = false;
        static Initialize(appId, clientToken) {
            LocalConstants.AppTok = appId;
            LocalConstants.CliTok = clientToken;
            Control.isInitialized = true;
        }
        static LoadFromParam() {
            let url = new URL(location.toString());
            let instaId = url.searchParams.get(Constants.QuerySegment);
            let instagramId = '';
            if (instaId === null) {
                BrewingCatsCore.Logger.traceWarn(`Instagram entry not found on query params`, 'autoinstagram', 'tagId_3', BrewingCatsCore.LogCategory.ComponentSetup, {});
            }
            else {
                instagramId = instaId;
            }
            return instagramId;
        }
        static InsertInstagramPost(apiResponse, target) {
            let selection = $(AutoInstagram.Util.Format(AutoInstagram.Constants.DefaultSelector, [target]));
            let selectorId = AutoInstagram.Util.Format(AutoInstagram.Constants.InstagramSelectorBase, [target]);
            let setHtml = false;
            if (selection.length === 0) {
                selectorId = AutoInstagram.Util.Format(AutoInstagram.Constants.InstagramSelectorId, [selectorId]);
                selection = $(selectorId);
                if (selection.length === 0) {
                    BrewingCatsCore.Logger.traceError(`Instagram entry not found on query params`, 'autoinstagram', 'tagId_4', BrewingCatsCore.LogCategory.ComponentSetup, {});
                    setHtml = false;
                }
                else {
                    setHtml = true;
                }
            }
            else {
                setHtml = true;
            }
            if (setHtml) {
                let postHtml = AutoInstagram.Util.Format(AutoInstagram.Constants.HtmlContainer, [
                    selectorId,
                    AutoInstagram.Constants.PostWidth.toString(),
                    apiResponse.html
                ]);
                selection.html(postHtml);
                window.instgrm.Embeds.process();
            }
        }
        static QueryAndAddInstagramPost(postId, targetSelector) {
            if (!Control.isInitialized) {
                console.warn('AutoInstagram has not been initialized!');
                return;
            }
            let apiRequestUrl = LocalConstants.buildRequest(postId);
            let oReq = new XMLHttpRequest();
            oReq.responseType = "json";
            oReq.onreadystatechange = () => {
                if (oReq.readyState === XMLHttpRequest.DONE) {
                    AutoInstagram.Control.InsertInstagramPost(oReq.response, targetSelector);
                    BrewingCatsCore.Logger.traceInfo(`Instagram request id ${postId}`, 'autoinstagram', 'tagId_6', BrewingCatsCore.LogCategory.ComponentSetup, {
                        id: postId
                    });
                }
            };
            oReq.onerror = () => {
                BrewingCatsCore.Logger.traceError(`Instagram request error`, 'autoinstagram', 'tagId_5', BrewingCatsCore.LogCategory.ComponentSetup, {
                    response: oReq.responseText,
                    status: oReq.statusText
                });
            };
            oReq.open('GET', apiRequestUrl);
            oReq.send();
        }
    }
    AutoInstagram.Control = Control;
    class Storage {
        static InstagramAPIReq;
    }
    AutoInstagram.Storage = Storage;
    class Constants {
        static QuerySegment = "insta";
        static DefaultTSelText = "Instagram-Auto-Embed";
        static DefaultSelector = `p:contains('{0}')`;
        static PostWidth = 700;
        static HtmlContainer = '<div id="{0}" style="display: block; margin-left: auto; margin-right: auto; width: {1}px;" >{2}</div>';
        static InstagramSelectorBase = 'targetInsta-{0}';
        static InstagramSelectorId = "div[id='{0}']";
    }
    AutoInstagram.Constants = Constants;
    class Util {
        static Remove(base, matcher) {
            return base.replace(matcher, '');
        }
        static Contains(base, matcher) {
            if (base.indexOf(matcher) !== -1) {
                return true;
            }
            return false;
        }
        static Format(base, formatters) {
            let index = 0;
            formatters.forEach(formatter => {
                let replaceToken = `{${index}}`;
                base = base.replace(replaceToken, formatter);
                index++;
            });
            return base;
        }
        static CurateId(raw) {
            return raw.replace(' ', '');
        }
    }
    AutoInstagram.Util = Util;
    class LocalConstants {
        static ReqUrl = `https://graph.facebook.com/v8.0/instagram_oembed?url=https://www.instagram.com/p/`;
        static AppTok = '';
        static CliTok = '';
        static buildRequest(postId) {
            return `${LocalConstants.ReqUrl}${postId}/&access_token=${LocalConstants.AppTok}|${LocalConstants.CliTok}`;
        }
    }
})(AutoInstagram || (AutoInstagram = {}));
if (window.AutoInstagram === undefined) {
    window.AutoInstagram = AutoInstagram;
}
var BrewingCatsCore;
(function (BrewingCatsCore) {
    class Config {
        static Version = '3.30';
        static SiteVersion = '';
        static ProjectId = '';
        static TelemetryEnabled = true;
        static ClientId = '';
        static SessionId = '';
        static TelemetryUrl = '';
        static StatsUrl = '';
        static ThemeColor = '';
        static LinkHoverColor = '';
        static UseGenericGdpr = false;
        static WarnLocalhost = false;
        static StatsMode = 'Classic';
        static RedirectHttps = true;
    }
    BrewingCatsCore.Config = Config;
})(BrewingCatsCore || (BrewingCatsCore = {}));
if (window.BrewingCatsCore === undefined) {
    window.BrewingCatsCore = BrewingCatsCore;
}
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
                    'userAgent': window.navigator.userAgent,
                    'BrewingCatsCoreVersion': BrewingCatsCore.Config.Version
                });
            }
            window.addEventListener('beforeunload', (event) => {
                BrewingCatsCore.Logger.traceInfo(`Navigating away from: ${window.location.href}`, 'BrewingCatsCore.Control', 'tagId_16', BrewingCatsCore.LogCategory.Unload, {
                    'src': window.location.href
                });
            });
            if (true === BrewingCatsCore.Config.RedirectHttps &&
                false === window.location.origin.includes('localhost') &&
                'https:' !== window.location.protocol) {
                let secureLocation = window.location.toString().replace(window.location.protocol, 'https:');
                BrewingCatsCore.Logger.traceInfo(`Redirecting to: ${secureLocation}`, 'BrewingCatsCore.Control', 'tagId_14', BrewingCatsCore.LogCategory.Bootstrap, {
                    'url': window.location.toString(),
                    'BrewingCatsCoreVersion': BrewingCatsCore.Config.Version
                });
                window.location.assign(secureLocation);
            }
            $(() => {
                BrewingCatsCore.Gdpr.UpdateGdpr();
            });
            const stylesLeft = [
                'color: cyan',
                'background: gray',
                'font-weight: bold',
                'font-size: 30px',
                'border-left: 5px solid red',
                'border-top: 5px solid red',
                'border-bottom: 5px solid red',
                'text-shadow: 2px 2px black',
                'padding-top: 10px',
                'padding-bottom: 10px',
                'padding-left: 10px',
            ].join(';');
            const stylesRight = [
                'color: green',
                'background: gray',
                'font-weight: bold',
                'font-size: 30px',
                'border-right: 5px solid red',
                'border-top: 5px solid red',
                'border-bottom: 5px solid red',
                'text-shadow: 2px 2px black',
                'padding-top: 10px',
                'padding-bottom: 10px',
                'padding-right: 10px',
            ].join(';');
            console.log(`%cBrewing Cats Core v%c${BrewingCatsCore.Config.Version}`, stylesLeft, stylesRight);
            console.table([
                { 'name': 'Brewing Cats Core', 'value': `${BrewingCatsCore.Config.Version}` },
                { 'name': 'Website Version', 'value': `${BrewingCatsCore.Config.SiteVersion}` },
                { 'name': 'User Session', 'value': `${BrewingCatsCore.Config.SessionId}` },
                { 'name': 'User Id', 'value': `${BrewingCatsCore.Config.ClientId}` },
            ]);
        }
        static UpdateStats(callback) {
            let statsData = {
                mode: BrewingCatsCore.Config.StatsMode,
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
            let startTimer = new Date();
            fetch(BrewingCatsCore.Config.StatsUrl, request).then((response) => {
                response.json().then((r) => {
                    let endTimer = new Date();
                    let serverResponse = r;
                    let statsData = {
                        UserPageViews: 1,
                        UserSiteViews: 1,
                        SiteViews: serverResponse.SiteViews,
                        PageViews: serverResponse.PageViews,
                        ApiVersion: serverResponse.Version,
                        ResponseTimeMs: (endTimer.getTime() - startTimer.getTime())
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
var BrewingCatsCore;
(function (BrewingCatsCore) {
    class Gdpr {
        static gdprPrefix = 'GDPR-Check';
        static timeDelta = 86400000;
        static UpdateGdpr() {
            if (BrewingCatsCore.Util.isIframe()) {
                return;
            }
            let now = new Date().getTime();
            let minCheck = now - Gdpr.timeDelta;
            let lastAgreedStored = window.localStorage.getItem(Gdpr.gdprPrefix);
            let lastAgreed = 0;
            if (lastAgreedStored !== null) {
                lastAgreed = Number.parseInt(lastAgreedStored);
                if (Number.isNaN(lastAgreed)) {
                    lastAgreed = 0;
                }
            }
            if (minCheck >= lastAgreed) {
                Gdpr.DisplayToast();
            }
        }
        static DisplayToast() {
            let msg = `By using this website you agree to comply with the terms of use outlined in our 
      <a href="/posts/site/policy/">policy</a> 
      includes the use of cookies and other data`;
            if (BrewingCatsCore.Config.UseGenericGdpr === true) {
                msg = `By using this website you agree to comply with the terms of use. This includes the use of cookies and other data`;
            }
            $('#toastArea').html(`
      <div class="z-9999" aria-live="polite" aria-atomic="true" style="position: absolute; top: 0; right: 0; min-height: 200px; z-index: 9999;">
        <div id="gdprToast" class="toast">
          <div class="toast-header">
            <img src="/images/gdpr_icon.jpg" class="rounded-circle mr-2" alt="Terms of Use" style="width: 32px; height: 32px;">
            <strong class="mr-auto">Cookies</strong>
            <small>Terms of use</small>
            <button id="toastDismissBtn" type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">${msg}</div>
        </div>
      </div>`);
            $('#toastDismissBtn').on('click', () => {
                $('#toastArea').html('');
                BrewingCatsCore.Logger.traceInfo('User accepted TOS', 'gdpr.toast', 'tagId_2', BrewingCatsCore.LogCategory.GDPR, {});
                window.localStorage.setItem(Gdpr.gdprPrefix, `${new Date().getTime()}`);
            });
            $('#gdprToast').toast({
                autohide: false
            });
            $('#gdprToast').toast('show');
        }
    }
    BrewingCatsCore.Gdpr = Gdpr;
})(BrewingCatsCore || (BrewingCatsCore = {}));
if (window.BrewingCatsCore === undefined) {
    window.BrewingCatsCore = BrewingCatsCore;
}
var HeadParser;
(function (HeadParser) {
    class Control {
        static headerIds = new Array();
        static updateHeaders() {
            let headers = $('main').find($(":header"));
            for (let idx = 0; idx < headers.length; idx++) {
                let header = headers[idx];
                if (header.innerHTML !== undefined
                    && header.innerHTML !== null
                    && header.innerHTML !== ''
                    && header.innerHTML !== 'Table of Contents'
                    && header.innerHTML !== 'Tabla de Contenidos') {
                    let id = Control.HashIt(header.innerHTML).replace('==', '').replace('=', '').replace('-', '');
                    id = Control.CompressId(id);
                    if (!header.hasAttribute("id")) {
                        header.setAttribute("id", id);
                        Control.headerIds.push(id);
                    }
                    else {
                        Control.headerIds.push(header.getAttribute('id'));
                    }
                }
            }
        }
        static CreateHeaderList() {
            let list = document.createElement('ul');
            for (let idx = 0; idx < Control.headerIds.length; idx++) {
                let h = $(`#${HeadParser.Control.headerIds[idx]}`);
                let li = document.createElement('li');
                let lnk = document.createElement('a');
                lnk.setAttribute('href', `#${HeadParser.Control.headerIds[idx]}`);
                let digits = Number(h.prop("tagName").toLowerCase().replace('h', '')) - 1;
                let deepCode = '';
                for (let i = 0; i < digits; i++) {
                    deepCode = `${deepCode}⚪`;
                }
                lnk.innerHTML = `<code>${deepCode}</code>${h.text()}`;
                li.appendChild(lnk);
                list.appendChild(li);
            }
            return list;
        }
        static CompressId(val) {
            console.log(val);
            if (val === undefined || val === null || val === '') {
                return new Date().getTime().toString();
            }
            let sLength = 1;
            let testId = val.substring(0, sLength);
            while (Control.headerIds.indexOf(testId) !== -1 || $(`#${testId}`).length > 0) {
                if (sLength < val.length) {
                    sLength++;
                    testId = val.substring(0, sLength);
                }
                else {
                    sLength++;
                    let tim = new Date().getTime().toString().substring(0, sLength - val.length);
                    testId = `${val}${tim}`;
                }
            }
            return testId;
        }
        static HashIt(val) {
            let hash = 0;
            let i;
            let chr;
            for (i = 0; i < val.length; i++) {
                chr = val.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0;
            }
            return hash.toString();
        }
    }
    HeadParser.Control = Control;
})(HeadParser || (HeadParser = {}));
if (window.HeadParser === undefined) {
    window.HeadParser = HeadParser;
}
if (window.BrewingCatsCore === undefined) {
    window.BrewingCatsCore = BrewingCatsCore;
}
var BrewingCatsCore;
(function (BrewingCatsCore) {
    let LogCategory;
    (function (LogCategory) {
        LogCategory["Bootstrap"] = "Bootstrap";
        LogCategory["GDPR"] = "GDPR";
        LogCategory["ComponentSetup"] = "ComponentSetup";
        LogCategory["Configuration"] = "Configuration";
        LogCategory["ComponentInteraction"] = "ComponentInteraction";
        LogCategory["Unload"] = "Unload";
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
            const cleanStyle = [
                'text-shadow: 1px 1px black',
            ].join(';');
            const consoleFormat = [
                'text-shadow: 1px 1px gray',
                'border-radius: 2px',
                'color: black',
                'background: cyan'
            ].join(';');
            const warnFormat = [
                'text-shadow: 1px 1px gray',
                'border-radius: 2px',
                'color: black',
                'background: yellow'
            ].join(';');
            const errFormat = [
                'text-shadow: 1px 1px gray',
                'border-radius: 2px',
                'color: black',
                'background: red'
            ].join(';');
            const accent = [
                'color: cyan'
            ].join(';');
            let timestamp = new Date();
            let consoleTimestamp = `%c[%c${timestamp.getFullYear()}${timestamp.getMonth()}${timestamp.getDay()}%c.` +
                `%c${timestamp.getHours()}${timestamp.getMinutes()}${timestamp.getSeconds()}]`;
            let prefix = `${consoleTimestamp}%c BrewingCats %c`;
            if (!BrewingCatsCore.Config.TelemetryEnabled) {
                console.log(`${prefix}Telemetry is disabled on this client`, accent, cleanStyle, accent, cleanStyle, warnFormat, cleanStyle);
                return;
            }
            if (metrics === undefined) {
                metrics = {};
            }
            metrics['SessionId'] = BrewingCatsCore.Config.SessionId;
            metrics['ClientId'] = BrewingCatsCore.Config.ClientId;
            metrics['ProjectId'] = BrewingCatsCore.Config.ProjectId;
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
                    console.log(`${prefix}${log.message}`, accent, cleanStyle, accent, cleanStyle, consoleFormat, cleanStyle);
                    console.trace(log);
                    break;
                }
                case LogType.Warning: {
                    console.log(`${prefix}${log.message}`, accent, cleanStyle, accent, cleanStyle, warnFormat, cleanStyle);
                    console.warn(log);
                    break;
                }
                case LogType.Error: {
                    console.log(`${prefix}${log.message}`, accent, cleanStyle, accent, cleanStyle, errFormat, cleanStyle);
                    console.error(log);
                    break;
                }
                default:
                    console.log(`${prefix}${log.message}`, accent, cleanStyle, accent, cleanStyle, consoleFormat, cleanStyle);
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
                if (false == BrewingCatsCore.Config.WarnLocalhost) {
                    BrewingCatsCore.Config.WarnLocalhost = true;
                    console.log(`${prefix}Skipped Telemetry service on localhost`, accent, cleanStyle, accent, cleanStyle, warnFormat, cleanStyle);
                }
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
        timestamp;
        client;
        caller;
        category;
        type;
        tagId;
        message;
        metrics;
        indexId;
    }
    BrewingCatsCore.TraceLog = TraceLog;
})(BrewingCatsCore || (BrewingCatsCore = {}));
if (window.BrewingCatsCore === undefined) {
    window.BrewingCatsCore = BrewingCatsCore;
}
var BrewingCatsCore;
(function (BrewingCatsCore) {
    class Util {
        static fromBase64(payload) {
            return JSON.parse(atob(payload));
        }
        static toBase64(payload) {
            return btoa(JSON.stringify(payload));
        }
        static getTicks() {
            return (new Date()).getTime();
        }
        static isIframe() {
            try {
                return window.self !== window.top;
            }
            catch (e) {
                return true;
            }
        }
        static scrollToTop() {
            window.scrollTo(0, 0);
        }
    }
    BrewingCatsCore.Util = Util;
    class GUID {
        static New() {
            return `${GUID.Segment(2)}-${GUID.Segment()}-${GUID.Segment()}-${GUID.Segment(2)}-${GUID.Segment(3)}`;
        }
        static Segment(length = 1) {
            if (length < 1) {
                return '';
            }
            let segment = '';
            for (let i = 0; i < length; i++) {
                segment += GUID.s4();
            }
            return segment;
        }
        static s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
    }
    BrewingCatsCore.GUID = GUID;
    class LinkActions {
        static mouseover(target) {
            target.style.boxShadow = `${BrewingCatsCore.Config.LinkHoverColor} 0px -4px 0px inset`;
        }
        static mouseout(target) {
            target.style.boxShadow = `rgb(${BrewingCatsCore.Config.ThemeColor}) 0px -4px 0px inset`;
        }
        static openLink(src, label) {
            BrewingCatsCore.Logger.traceInfo(`Link Component`, 'component.link', 'tagId_n', BrewingCatsCore.LogCategory.ComponentSetup, {
                'component': 'Link',
                'src': `${src}`,
                'label': `${label}`
            });
        }
    }
    BrewingCatsCore.LinkActions = LinkActions;
})(BrewingCatsCore || (BrewingCatsCore = {}));
if (window.BrewingCatsCore === undefined) {
    window.BrewingCatsCore = BrewingCatsCore;
}
