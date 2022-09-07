"use strict";

var curSub = []; // 当前订阅规则
var menuOptions = {
  enable: true, // 是否开启
  switchText: "已开启", // 开关文案
}; // APP开关
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

function getStorage() {
  chrome.storage.local.get(null, function (data) {
    if (Object.keys(data).length !== 0) {
      curSub = data.curSub || [];
      menuOptions = data.menuOptions || {
        enable: true, // 是否开启
        switchText: "已开启", // 开关文案
      }
    }
    console.warn(curSub, menuOptions);
  });
}

// This is where all magic happen
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!menuOptions.enable) {
      return;
    }
    var url = details.url;

    // TODO simple test
    /**
     * 图片处理
     * 动态图片 https://web.sanguosha.com/10/pc/res/assets/runtime/general/big/dynamic/XXXXXX/daiji2.png
     * 静态图片 https://web.sanguosha.com/10/pc/res/assets/runtime/general/seat/static/XXXXX.png
     */
    if (
      url.indexOf(
        "https://web.sanguosha.com/10/pc/res/assets/runtime/general/seat/static"
      ) > -1
    ) {
      console.error("更新静态座位图片", url);
      url =
        "https://avos-cloud-gwibfiplqh86.s3.amazonaws.com/5Go3rpXLS1ygfFGrue9VTKdfBnA4r7f6/dabao.png";
    }
    if (url.indexOf("daiji2.png") > -1) {
      console.error("更新动态座位图片", url);
      url =
        "https://avos-cloud-gwibfiplqh86.s3.amazonaws.com/XQ0v3b4ElnH1JANxGESM3Hy3zXPOR64c/dabao_daiji.png";
    }
    for (var i = 0, len = curSub.length; i < len; i++) {
      var reg = new RegExp(curSub[i].req, "gi");
      // FIXME
      reg = new RegExp(
        "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
        "gi"
      );

      // FIXME if CONDITION
      if (
        true ||
        (curSub[i].checked &&
          typeof curSub[i].res === "string" &&
          reg.test(url))
      ) {
        if (!/^file:\/\//.test(curSub[i].res)) {
          console.error("start replacement", url);
          do {
            url = url.replace(reg, curSub[i].res);
            // FIXME
            let res = "https://tradetest2.xqfunds.com/tougu/images/xq-logo.jpg";
            url = url.replace(reg, res);
            console.error("resource replaced!", url);
          } while (reg.test(url));
        } else {
          // 0902 先不考虑本地file替换
          // do {
          //     url = getLocalFileUrl(url.replace(reg, curSub[i].res));
          // } while (reg.test(url))
        }
      }
    }
    return url === details.url ? {} : { redirectUrl: url };
  },
  { urls: ["<all_urls>"], types: ["image", "xmlhttprequest"] },
  ["blocking"]
);

getStorage();
chrome.storage.onChanged.addListener(getStorage);
