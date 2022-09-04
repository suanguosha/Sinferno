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

    // TODO simple test
    /**
     * 图片处理
     * 动态图片 https://web.sanguosha.com/10/pc/res/assets/runtime/general/big/dynamic/XXXXXX/daiji2.png
     * 静态图片 https://web.sanguosha.com/10/pc/res/assets/runtime/general/seat/static/XXXXX.png
     */
    console.warn(url);
    if (url.indexOf("https://web.sanguosha.com/10/pc/res/assets/runtime/general/seat/static") > -1) {
      console.error("更新静态座位图片", url);
      url = "https://avos-cloud-gwibfiplqh86.s3.amazonaws.com/5Go3rpXLS1ygfFGrue9VTKdfBnA4r7f6/dabao.png"
    }
    if (url.indexOf("daiji2.png") > -1) {
      console.error("更新动态座位图片", url);
      url = "https://avos-cloud-gwibfiplqh86.s3.amazonaws.com/XQ0v3b4ElnH1JANxGESM3Hy3zXPOR64c/dabao_daiji.png"
    }
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
  { urls: ["<all_urls>"], types: ["image", "xmlhttprequest"] },
  ["blocking"]
);

getLocalStorage();
window.addEventListener("storage", getLocalStorage, false);
