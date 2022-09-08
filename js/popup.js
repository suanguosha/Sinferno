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
    // TODO 开启关闭功能
    saveData($scope.menuOptions);
  };
});
