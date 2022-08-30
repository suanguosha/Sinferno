var SGSMap = [];
var typeMap = {
    "txt"   : "text/plain",
    "html"  : "text/html",
    "css"   : "text/css",
    "js"    : "text/javascript",
    "json"  : "text/json",
    "xml"   : "text/xml",
    "jpg"   : "image/jpeg",
    "gif"   : "image/gif",
    "png"   : "image/png",
    "webp"  : "image/webp"
}

function getLocalStorage() {
    SGSMap = window.localStorage.SGSMap ? JSON.parse(window.localStorage.SGSMap) : SGSMap;
}

function getLocalFileUrl(url) {
    var arr = url.split('.');
    var type = arr[arr.length-1];
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, false);
    xhr.send(null);
    var content = xhr.responseText || xhr.responseXML;
    if (!content) {
        return false;
    }
    content = encodeURIComponent(
        type === 'js' ?
        content.replace(/[\u0080-\uffff]/g, function($0) {
            var str = $0.charCodeAt(0).toString(16);
            return "\\u" + '00000'.substr(0, 4 - str.length) + str;
        }) : content
    );
    return ("data:" + (typeMap[type] || typeMap.txt) + ";charset=utf-8," + content);
}

chrome.webRequest.onBeforeRequest.addListener(function (details) {
        var url = details.url;
        for (var i = 0, len = SGSMap.length; i < len; i++) {
            var reg = new RegExp(SGSMap[i].req, 'gi');
            if (SGSMap[i].checked && typeof SGSMap[i].res === 'string' && reg.test(url)) {
                if (!/^file:\/\//.test(SGSMap[i].res)) {
                    do {
                        url = url.replace(reg, SGSMap[i].res);
                    } while (reg.test(url))
                } else {
                    do {
                        url = getLocalFileUrl(url.replace(reg, SGSMap[i].res));
                    } while (reg.test(url))
                }
            }
        }
        return url === details.url ? {} : { redirectUrl: url };
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);

getLocalStorage();
window.addEventListener('storage', getLocalStorage, false);

