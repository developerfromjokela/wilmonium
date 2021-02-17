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
const addHtml = (html) => {
    document.body.insertAdjacentHTML('beforeend', html);
}

const loadJS = (url) => {
    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    document.body.appendChild(scriptTag);
};

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

// Inject code to wilma page, if it happens to be logged in
if (document.getElementById("logout-form")) {
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', chrome.extension.getURL('js/wilmonium.js'));
    wilmoniumDebug("Injecting "+chrome.extension.getURL('js/wilmonium.js'));
    document.body.appendChild(script);

    let darkmode = JSON.parse(localStorage.getItem('wilmonium')).darkmode;

    if (darkmode) addStyles('css/wilmonium-dark.css', 'darkmode-css');

    
    /* Toggle switch */
    addStyles('css/wilmonium.css');
    loadJS('https://code.iconify.design/1/1.0.4/iconify.min.js');
    addHtml(`
    <label>
    <input class='toggle-checkbox' type='checkbox' ${darkmode ? 'checked' : ''} />
    <div class='toggle-slot'>
        <div class='sun-icon-wrapper'>
        <div class="iconify sun-icon" data-icon="feather-sun" data-inline="false"></div>
        </div>
        <div class='toggle-button'></div>
        <div class='moon-icon-wrapper'>
        <div class="iconify moon-icon" data-icon="feather-moon" data-inline="false"></div>
        </div>
    </div>
    </label>
    `);
    document.querySelector('.toggle-checkbox').onchange = (evt) => {
        let darkmode = evt.target.checked;
        wilmoniumDebug('Dark mode ' + darkmode)
        if (!darkmode) {
            document.querySelectorAll('#darkmode-css').forEach(el => {
                el.remove();
            })
            
        } else {
            addStyles('css/wilmonium-dark.css', 'darkmode-css');
        }
        localStorage.setItem('wilmonium', JSON.stringify({darkmode: darkmode}));
    }
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
