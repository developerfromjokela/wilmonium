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
                // Fuck, wilma logged itself out ¯\_(ツ)_/¯
                wilmoniumDebug("Wilma logged out, refreshing...");
                window.location.reload();
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