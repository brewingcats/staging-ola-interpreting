var BrewingCatsCore;
(function (BrewingCatsCore) {
    class Gdpr {
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
    Gdpr.gdprPrefix = 'GDPR-Check';
    Gdpr.timeDelta = 86400000;
    BrewingCatsCore.Gdpr = Gdpr;
})(BrewingCatsCore || (BrewingCatsCore = {}));
if (window.BrewingCatsCore === undefined) {
    window.BrewingCatsCore = BrewingCatsCore;
}
