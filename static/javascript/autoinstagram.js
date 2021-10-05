var AutoInstagram;
(function (AutoInstagram) {
    class Control {
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
    Control.isInitialized = false;
    AutoInstagram.Control = Control;
    class Storage {
    }
    AutoInstagram.Storage = Storage;
    class Constants {
    }
    Constants.QuerySegment = "insta";
    Constants.DefaultTSelText = "Instagram-Auto-Embed";
    Constants.DefaultSelector = `p:contains('{0}')`;
    Constants.PostWidth = 700;
    Constants.HtmlContainer = '<div id="{0}" style="display: block; margin-left: auto; margin-right: auto; width: {1}px;" >{2}</div>';
    Constants.InstagramSelectorBase = 'targetInsta-{0}';
    Constants.InstagramSelectorId = "div[id='{0}']";
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
        static buildRequest(postId) {
            return `${LocalConstants.ReqUrl}${postId}/&access_token=${LocalConstants.AppTok}|${LocalConstants.CliTok}`;
        }
    }
    LocalConstants.ReqUrl = `https://graph.facebook.com/v8.0/instagram_oembed?url=https://www.instagram.com/p/`;
    LocalConstants.AppTok = '';
    LocalConstants.CliTok = '';
})(AutoInstagram || (AutoInstagram = {}));
if (window.AutoInstagram === undefined) {
    window.AutoInstagram = AutoInstagram;
}
