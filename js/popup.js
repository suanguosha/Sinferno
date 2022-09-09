"use strict";
var sgs = angular.module("sgs", []);

// chrome实例
var storage = chrome.storage.local;

sgs.controller("mapListCtrl", function ($scope) {
  //保存订阅到localStorage
  var saveData = function () {
    storage.set({ menuOptions: $scope.menuOptions }, () => {});
  };

  // 规则开关状态
  $scope.menuOptions = {
    enable: true, // 是否开启
    switchText: "已开启", // 开关文案
  };
  storage.get(["menuOptions"], function (data) {
    $scope.initiateMenuOptions(data.menuOptions);
  });
  // 初始化开关
  $scope.initiateMenuOptions = (data) => {
    if (Object.keys(data).length !== 0) {
      $scope.$applyAsync(function () {
        $scope.menuOptions = data;
      });
    }
  };

  // 点击规则开关
  $scope.toggleRules = function () {
    $scope.menuOptions = {
      enable: !$scope.menuOptions.enable,
      switchText: "已" + ($scope.menuOptions.enable ? "关闭" : "开启"),
    };
    saveData($scope.menuOptions);
  };

  // 检查更新
  $scope.updateStatus = {
    show: false,
    link: ""
  }
  var localVersion = chrome.runtime.getManifest().version;
  fetch(
    "https://raw.githubusercontent.com/suanguosha/SCAM/main/release/release.json"
  )
    .then((res) => res.json())
    .then((response) => {
      if (response[0].version > localVersion) {
        console.warn(response[0].version, localVersion);
        $scope.$applyAsync(function () {
          $scope.updateStatus = {
            show: true,
            link: response[0].link,
            version: response[0].version
          }
        });
      }
    });
  $scope.goDownload = function () {
    window.open(
      $scope.updateStatus.link,
      '_blank'
    );
  };
});
