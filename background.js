"use strict";

var curSub = []; // 当前订阅规则
var menuOptions = {
  enable: true, // 是否开启
  switchText: "已开启", // 开关文案
}; // APP开关
var characterMap = {}; // 武将key, value表
var banPool = []; // 禁将池
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

// 获取最新图片规则
function fetchCharacterMap() {
  console.log("fetchCharacterMap");
  fetch("./characterMap.json")
    .then((res) => res.json())
    .then((response) => {
      characterMap = response;
      getStorage(); // 第一次初始化storage
    });
};
fetchCharacterMap();

function getStorage() {
  chrome.storage.local.get(null, function (data) {
    if (Object.keys(data).length !== 0) {
      curSub = data.curSub || [];
      menuOptions = data.menuOptions || {
        enable: true, // 是否开启
        switchText: "已开启", // 开关文案
      }
      // 更新禁将池
      updateBanPool();
    }
  });
}

function updateBanPool() {
  if (Object.keys(characterMap).length == 0) return;
  let ruleSet = curSub.ruleSet || [];
  // 获取武将key列表
  let charKeys = [];
  ruleSet.forEach(group => {
    group.rows.forEach((char) => {
      if (char.checked) charKeys.push(char.key);
    });
  });
  // 根据武将key匹配图片规则
  banPool = charKeys.map((key) => {
    return characterMap[key].charNo;
  })
}
// This is where all magic happen
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!menuOptions.enable) return;  // 如果没开启 直接return;
    var url = details.url;
    /**
     * 图片处理
     * 动态图片 https://web.sanguosha.com/10/pc/res/assets/runtime/general/big/dynamic/XXXXXX/daiji2.png
     * 静态图片 https://web.sanguosha.com/10/pc/res/assets/runtime/general/seat/static/XXXXX.png
     */
    if (
      url.indexOf(
        "web.sanguosha.com/10/pc/res/assets/runtime/general/seat/static"
      ) > -1
    ) {
      // 获取当前武将的id
      let staticRegex = /https*?:\/\/web\.sanguosha\.com\/10\/pc\/res\/assets\/runtime\/general\/seat\/static\/(\w+)/;
      let character = url.match(staticRegex)[1]
      character = character.substring(1, character.length -1)
      console.error("静态座位图片 ", url, character);
      // 如果匹配 则更新
      if (banPool.indexOf(character) != -1) {
        url = "https://avos-cloud-gwibfiplqh86.s3.amazonaws.com/5Go3rpXLS1ygfFGrue9VTKdfBnA4r7f6/dabao.png";
        console.error("match! 进行替换 ", character);
      }  
    }
    if (url.indexOf("web.sanguosha.com/10/pc/res/assets/runtime/general/big/dynamic") > -1) {
      // 获取当前武将的id
      let staticRegex = /https*?:\/\/web\.sanguosha\.com\/10\/pc\/res\/assets\/runtime\/general\/big\/dynamic\/(\w+)/;
      let character = url.match(staticRegex)[1]
      character = character.substring(1, character.length -1)
      console.error("动态座位图片 ", url, character);
      // 如果匹配 则更新
      if (banPool.indexOf(character) != -1) {
        url = "https://avos-cloud-gwibfiplqh86.s3.amazonaws.com/XQ0v3b4ElnH1JANxGESM3Hy3zXPOR64c/dabao_daiji.png";
        console.error("match! 进行替换 ", character);
      }  
    }
    return url === details.url ? {} : { redirectUrl: url };
  },
  { urls: ["<all_urls>"], types: ["image", "xmlhttprequest"] },
  ["blocking"]
);

chrome.storage.onChanged.addListener(getStorage);
