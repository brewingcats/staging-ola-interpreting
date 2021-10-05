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
