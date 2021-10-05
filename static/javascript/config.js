var BrewingCatsCore;
(function (BrewingCatsCore) {
    class Config {
    }
    Config.Version = '0.6';
    Config.TelemetryEnabled = true;
    Config.ClientId = '';
    Config.SessionId = '';
    Config.TelemetryUrl = '';
    Config.StatsUrl = '';
    Config.ThemeColor = '';
    Config.LinkHoverColor = '';
    Config.UseGenericGdpr = false;
    BrewingCatsCore.Config = Config;
})(BrewingCatsCore || (BrewingCatsCore = {}));
if (window.BrewingCatsCore === undefined) {
    window.BrewingCatsCore = BrewingCatsCore;
}
