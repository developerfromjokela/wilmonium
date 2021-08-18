/*
 Config and misc tools
 */
const debug = true;

const wilmoniumDebug = (msg) => {
    if (debug)
        console.log("[wilmonium] "+msg);
}

/**
 * Fetch overview to extend session lifetime
 * Big-brain hack :-)
 */
function refreshSession() {
    fetch("/overview").then(response => {
        response.json().then(res => {
            wilmoniumDebug(JSON.stringify(res));
            if (res.LoginResult) {
                // Sh*t, wilma logged itself out ¯\_(ツ)_/¯
                wilmoniumDebug("Wilma logged out, refreshing...");

                window.location.reload();
            } else {
                wilmoniumDebug("Setting AutoLogoutWarning.tMinusLogout to "+window.autoLogoutDelay);
                // Preventing wilma's auto logout warning dialog from showing by resetting its counter to default value
                window.AutoLogoutWarning.tMinusLogout = window.autoLogoutDelay;
            }
        })
    });
}

if (document.getElementById("logout-form")) {
    if (!window.wilmonium)
        window.wilmonium = {intervalId: -1}
    // We're logged in!
    wilmoniumDebug("Detected wilma with logged in session");
    let currentIntervalId = window.wilmonium.intervalId;
    if (currentIntervalId === -1) {
        refreshSession();
        window.wilmonium.intervalId = setInterval(refreshSession, 60*1000);
    }
}