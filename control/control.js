document.querySelector('.toggle-checkbox').onchange = (evt) => {
    let darkmode = evt.target.checked;
    chrome.storage.sync.set({config: {darkmode: darkmode}}, () => {
        console.log("set");
        chrome.tabs.query({currentWindow: true}, function(tabs) {
            tabs.forEach(function (tab) {
                console.log(tab.id);
                chrome.tabs.sendMessage(tab.id, {action: 'themeChanged'});
            });
        });
    });
}

window.onload = () => {
    chrome.storage.sync.get(["config"], data => {
        if (data.config === undefined) {
            chrome.storage.sync.set({config: {darkmode: false}});
        } else {
            if (data.config.darkmode) {
                document.getElementById("toggle").setAttribute("checked", "");
            } else {
                document.getElementById("toggle").removeAttribute("checked");
            }
        }

    })

}