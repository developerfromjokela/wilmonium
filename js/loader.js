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

    var link = document.createElement('link');
    link.href = chrome.extension.getURL('css/wilmonium-dark.css');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.media = 'all';
    document.getElementsByTagName('HEAD')[0].appendChild(link);
    //document.getElementsByTagName("footer")[0].children[0].src = "https://media.discordapp.net/attachments/798799175072219136/798840488819294238/treegif.gif";
}

/* Dark mode for iframes in the message pages */
document.querySelectorAll('iframe').forEach(iframe => {
    iframe.setAttribute('allowTransparency', 'true')
    var style = document.createElement('style');
    style.innerHTML =
    `html,body {background-color: transparent !important; }
    p,ul,li,b,strong,i,h1,h2,h3,h4,h5,blockquote {color: #bbb;}
    a, a:link, a:visited {color: #3eb0ef !important;}`;
    iframe.contentWindow.document.body.appendChild(style);
});