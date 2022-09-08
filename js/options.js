"use strict";
var sgs = angular.module("sgs", []);

// chrome实例
var storage = chrome.storage.local;

var defaultSubscription = {
  url: "", // 规则地址
  title: "", // 规则标题
  comment: "", // 规则备注
  sha: "", // sha
  ruleSet: [] // ruleSet
};

// controller开始
sgs.controller("mapListCtrl", function ($scope) {
  //保存订阅到localStorage
  var saveData = function (key, data) {
    storage.set({[key]: data}, () => {});
  };

  /**
   * loading状态
   */
  $scope.loadingStatus = false; // loading状态
  $scope.toggleLoading = (status) => {
    $scope.loadingStatus = status;
  }; // 修改loading状态
  $scope.updateError = (message) => {
    $scope.inputError = message;
  }; // 修改网络请求报错

  /**
   * 导航菜单
   */
  /**
   * 添加订阅
   */
  $scope.importSubscription = function (curSubscription) {
    $scope.inputError = ""; // 清空错误信息
    $scope.createDisplay = "none"; // 关闭生成规则
    if ($scope.saveDisplay === "none" || $scope.saveMode === "生成") {
      if (!curSubscription) {
        $scope.curSubscription = defaultSubscription;
      }
      $scope.saveMode = "添加";
      $scope.saveDisplay = "block";
    } else {
      $scope.saveMode === "添加" && ($scope.saveDisplay = "none");
    }
  };
  // 生成规则
  $scope.openCreator = function () {
    $scope.inputError = ""; // 清空错误信息
    $scope.saveDisplay = "none"; // 关闭添加规则
    if ($scope.createDisplay === "none") {
      $scope.createDisplay = "block";
    } else {
      $scope.createDisplay = "none";
    }
  };
  // 分享规则
  $scope.exportRules = function () {
    // 获取当前选中订阅规则
    let curRuleIndex = -1;
    for (var i = 0, len = $scope.subscriptions.length; i < len; i++) {
      if ($scope.subscriptions[i].checked) {
        curRuleIndex = i;
      }
    }
    if (curRuleIndex == -1) {
      alert("请选中需要分享的订阅规则！");
      return;
    }
    let text = "【" + $scope.subscriptions[curRuleIndex].title + "】" + $scope.subscriptions[curRuleIndex].url;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("已将订阅规则复制到剪贴板！");
      });
  };

  /**
   * 订阅表单
   */
  // 订阅合集
  $scope.subscriptions = [];
  storage.get(["SGSSubs"], function (data) {
    $scope.initiateSubscription(data.SGSSubs);
  });
  // 初始化订阅
  $scope.initiateSubscription = (data) => {
    if (Object.keys(data).length !== 0) {
      $scope.subscriptions = data;
    }
  };
  // 当前订阅
  $scope.curSubscription = {
    ...defaultSubscription
  };
  $scope.saveDisplay = "none"; //订阅编辑框显示状态
  $scope.saveMode = "添加"; //订阅编辑框保存按钮文本 添加/编辑 添加则新增规则 编辑则修改规则
  $scope.inputError = ""; //输入错误时候的警告
  // 关闭订阅表单
  $scope.hideEditBox = function () {
    $scope.saveDisplay = "none";
    $scope.inputError = "";
  };
  // 切换订阅
  $scope.changeSubscription = function (sub) {
    // 取消其他订阅规则的勾选展示
    for (var i = 0, len = $scope.subscriptions.length; i < len; i++) {
      if ($scope.subscriptions[i] !== sub) {
        $scope.subscriptions[i].checked = false;
      }
    }
    // 更新当前规则
    saveData("SGSSubs", $scope.subscriptions);
    saveData("curSub", sub);
  };
  // 编辑订阅
  $scope.editSubscription = function (sub) {
    $scope.curSubscription = sub;
    $scope.saveMode = "编辑";
    $scope.saveDisplay = "block";
    $scope.inputError = ""; // 清空错误信息
    $scope.createDisplay = "none"; // 关闭生成规则
  };
  // 保存订阅
  $scope.saveSubscription = function () {
    var verify = function () {
      if (!$scope.curSubscription.url) {
        $scope.inputError = "请输入订阅规则！";
        return false;
      }
      $scope.inputError = "";
      return true;
    };
    // 生成
    if ($scope.saveMode == "生成") {
      $scope.uploadRule();
      return;
    }
    // 添加 编辑
    if (verify()) {
      $scope.fetchSubscription($scope.curSubscription.url).then((res) => {
        $scope.$applyAsync(function () {
          if ($scope.saveMode === "添加") {
            // 从订阅地址中取规则, 和标题&备注(如果没写)
            $scope.curSubscription.title = $scope.curSubscription.title || res.title;
            $scope.curSubscription.comment = $scope.curSubscription.comment || res.comment;
            $scope.curSubscription.ruleSet = res.ruleSet;

            // deep copy
            let subscription = angular.copy($scope.curSubscription);
            $scope.subscriptions.push(subscription);
          }
          saveData("SGSSubs", $scope.subscriptions);
          $scope.saveDisplay = "none";
          $scope.createDisplay = "none";
        });
      });
    }
  };
  // 删除订阅
  $scope.removeSubscription = function (sub) {
    for (var i = 0, len = $scope.subscriptions.length; i < len; i++) {
      if ($scope.subscriptions[i] === sub) {
        $scope.subscriptions.splice(i, 1);
      }
    }
    saveData("SGSSubs", $scope.subscriptions);
  };

  /**
   * 规则表单
   */
  $scope.createDisplay = "none"; // 订阅编辑框显示状态
  // 生成规则
  $scope.createRule = function () {
    $scope.saveMode = "生成";
    $scope.saveDisplay = "block";
  };
  // 上传规则
  $scope.uploadRule = () => {
    $scope.toggleLoading(true);
    let token = "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";
    let sgsRules = {
      title: $scope.curSubscription.title,
      comment: $scope.curSubscription.comment,
      ruleSet: $scope.ruleSet,
    };
    let fileName = `${$scope.curSubscription.title}.json`;
    let body = {
      message: "上传规则: " + `${$scope.curSubscription.title}`,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(sgsRules)))),
    };
    if ($scope.curSubscription.sha) {
      body.sha = $scope.curSubscription.sha;
    }
    fetch("https://api.github.com/repos/ME70N/sgsRules/contents/" + fileName, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        $scope.toggleLoading(false);
        return res.json();
      })
      .then((data) => {
        if (data.content) {
          // 生成成功!
          let subscription_link =
            "https://raw.githubusercontent.com/ME70N/sgsRules/main/" + fileName;
          let sha = data.content.sha;
          $scope.$applyAsync(function () {
            $scope.updateError(
              "生成成功!\n 您的订阅地址为: " +
                subscription_link +
                "\n 您的密匙为(更新规则需要, 请自行保管): " +
                sha
            );
          });
        } else {
          // 生成失败
          $scope.$applyAsync(function () {
            $scope.updateError(data.message);
          });
        }
      });
  };

  // 获取最新规则集合
  $scope.fetchRuleSet = function () {
    fetch("../ruleSet.json")
      .then((res) => res.json())
      .then((response) => {
        $scope.$applyAsync(function () {
          $scope.ruleSet = response;
        });
      });
  };
  $scope.fetchRuleSet();
  // 勾选某分类的武将
  $scope.toggleRuleGroup = function (group, index) {
    for (var i = 0, len = $scope.ruleSet[index].rows.length; i < len; i++) {
      $scope.ruleSet[index].rows[i].checked = group.checked;
    }
  };
  
  // 获取订阅规则详情
  // 更新规则状态
  $scope.updateStatus = {
    loading :false
  }
  $scope.fetchSubscription = function (url) {
    $scope.updateStatus.loading = true;
    return new Promise((resolve) => {
      fetch(url + "?timestamp=" + Math.random()).then((res) => {
        // scope $apply 防止angular不更新view
        $scope.$applyAsync(function () {
          $scope.updateStatus.loading = false;
          if (res.ok) {
            res.json().then((res) => {
              resolve(res);
            });
          } else {
            $scope.inputError = "获取规则失败, 请检查订阅地址!";
          }
        })
      });
    }); 
  };
});
