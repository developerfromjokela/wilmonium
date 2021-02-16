const debug = true;

const wilmoniumDebug = (msg) => {
    if (debug)
        console.log("[wilmonium] "+msg);
}

// Inject code to wilma page, if it happens to be logged in
if (document.getElementById("logout-form")) {
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', chrome.extension.getURL('js/wilmonium.js'));
    wilmoniumDebug("Injecting "+chrome.extension.getURL('js/wilmonium.js'));
    document.body.appendChild(script);
}

