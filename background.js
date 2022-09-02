'use strict';

var SGSMap = [];
var typeMap = {
  txt: "text/plain",
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  json: "text/json",
  xml: "text/xml",
  jpg: "image/jpeg",
  gif: "image/gif",
  png: "image/png",
  webp: "image/webp",
};

function getLocalStorage() {
  SGSMap = window.localStorage.SGSMap
    ? JSON.parse(window.localStorage.SGSMap)
    : SGSMap;
}

// 0902 先不考虑本地file替换
// function getLocalFileUrl(url) {
//     var arr = url.split('.');
//     var type = arr[arr.length-1];
//     var xhr = new XMLHttpRequest();
//     xhr.open('get', url, false);
//     xhr.send(null);
//     var content = xhr.responseText || xhr.responseXML;
//     if (!content) {
//         return false;
//     }
//     content = encodeURIComponent(
//         type === 'js' ?
//         content.replace(/[\u0080-\uffff]/g, function($0) {
//             var str = $0.charCodeAt(0).toString(16);
//             return "\\u" + '00000'.substr(0, 4 - str.length) + str;
//         }) : content
//     );
//     return ("data:" + (typeMap[type] || typeMap.txt) + ";charset=utf-8," + content);
// }

// This is where all magic happen
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    var url = details.url;
    console.warn(url);
    for (var i = 0, len = SGSMap.length; i < len; i++) {
      var reg = new RegExp(SGSMap[i].req, "gi");
      // FIXME
      reg = new RegExp(
        "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
        "gi"
      );

      // FIXME if CONDITION
      if (
        true ||
        (       SGSMap[i].checked &&
          typeof SGSMap[i].res === "string" &&
          reg.test(url))
      ) {
        if (!/^file:\/\//.test(SGSMap[i].res)) {
            console.error("start replacement", url);
          do {
            url = url.replace(reg, SGSMap[i].res);
            // FIXME
            let res = "https://tradetest2.xqfunds.com/tougu/images/xq-logo.jpg";
            url = url.replace(reg, res);
            console.error("resource replaced!", url);
          } while (reg.test(url));
        } else {
          // 0902 先不考虑本地file替换
          // do {
          //     url = getLocalFileUrl(url.replace(reg, SGSMap[i].res));
          // } while (reg.test(url))
        }
      }
    }
    return url === details.url ? {} : { redirectUrl: url };
  },
  { urls: ["<all_urls>"], types: ["image"] },
  ["blocking"]
);

getLocalStorage();
window.addEventListener("storage", getLocalStorage, false);
