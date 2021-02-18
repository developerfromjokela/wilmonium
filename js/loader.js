const debug = true;

const wilmoniumDebug = (msg) => {
    if (debug)
        console.log("[wilmonium] "+msg);
}

const addStyles = (filename, id) => {
    var link = document.createElement('link');
    link.href = chrome.extension.getURL(filename);
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.media = 'all';
    if (id) link.id = id;
    document.getElementsByTagName('HEAD')[0].appendChild(link);
}

const updateTheme = (darkmode) => {
    wilmoniumDebug('Dark mode ' + darkmode)
    if (!darkmode) {
        document.querySelectorAll('iframe').forEach(iframe => {
            iframe.setAttribute('allowTransparency', 'false');
            console.log(iframe.contentDocument);
            iframe.contentDocument.getElementsByTagName("style")[0].remove();
        });
        document.querySelectorAll('#darkmode-css').forEach(el => {
            el.remove();
        })
    } else {
        addStyles('css/wilmonium-dark.css', 'darkmode-css');
        iframePatch();
    }
};

const iframePatch = () => {
    /* Dark mode for iframes in the message pages */
    document.querySelectorAll('iframe').forEach(iframe => {
        iframe.setAttribute('allowTransparency', 'true')
        var style = document.createElement('style');
        style.innerHTML =
            `html,body {background-color: transparent !important; }
    p,ul,li,b,strong,i,h1,h2,h3,h4,h5,blockquote,body:not(.wilma) {color: #bbb;}
    .m-replybox, form.quickreply {background-color: transparent !important;}
    .m-replybox:after,.m-replybox:before, form.quickreply:before,form.quickreply:after {border-color: transparent !important;}
    a, a:link, a:visited {color: #3eb0ef !important;}`;
        iframe.contentWindow.document.body.appendChild(style);
    });
};

try {
    let navDetect = document.getElementsByClassName("nav-wilma").length > 0;
    let selectionDetect = document.getElementsByClassName("selection-body").length > 0;
    // Inject code to wilma page, if it happens to be logged in
    if ( navDetect || selectionDetect) {
        let script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', chrome.extension.getURL('js/wilmonium.js'));
        wilmoniumDebug("Injecting "+chrome.extension.getURL('js/wilmonium.js'));
        document.body.appendChild(script);

        if (localStorage.getItem("wilmonium") == null) {
            localStorage.setItem("wilmonium", JSON.stringify({darkmode: false}));
        }
        let darkmode = false;
        chrome.storage.sync.get("config", data => {
            console.log(data);
            if (data.config === undefined) {
                chrome.storage.sync.set({config: {darkmode: false}});
            } else {
                darkmode = data.config.darkmode;
            }
            if (darkmode) {
                addStyles('css/wilmonium-dark.css', 'darkmode-css');
                iframePatch();
            }

        })




        chrome.runtime.onMessage.addListener(function(request, sender, callback) {
            if (request.action === "themeChanged") {
                darkmode = chrome.storage.sync.get("config", data => {
                    updateTheme(data.config.darkmode);
                });
            }
        });



        //document.getElementsByTagName("footer")[0].children[0].src = "https://media.discordapp.net/attachments/798799175072219136/798840488819294238/treegif.gif";
    }
} catch (e) {
    wilmoniumDebug(e);
}