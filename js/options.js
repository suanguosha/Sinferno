"use strict";
var sgs = angular.module("sgs", []);

// 初始化订阅
var initiateSubscription = function (subscriptions) {
  if (subscriptions) return angular.fromJson(subscriptions);
  return [];
};

// chrome实例
var bg = chrome.extension.getBackgroundPage();

var defaultSubscription = {
  url: "", // 规则地址
  title: "", // 规则标题
  comment: "", // 规则备注
};

// controller开始
sgs.controller("mapListCtrl", function ($scope) {
  //保存订阅到localStorage
  var saveData = function () {
    bg.localStorage.SGSSubs = angular.toJson($scope.subscriptions);
  };

  /**
   * loading状态
   */
  $scope.loadingStatus = false // loading状态
  $scope.toggleLoading = (status) => {
    $scope.loadingStatus = status;
  } // 修改loading状态
  $scope.updateError = (message) => {
    $scope.inputError = message;
  } // 修改网络请求报错

  /**
   * 导航菜单
   */
  /**
   * 添加订阅
   */
  $scope.importSubscription = function (curSubscription) {
    $scope.inputError = ""; // 清空错误信息
    $scope.createDisplay = "none"; // 关闭生成规则
    if ($scope.editDisplay === "none" || $scope.editMode === '生成') {
      if (!curSubscription) {
        $scope.curSubscription = defaultSubscription;
      }
      $scope.editMode = "添加";
      $scope.editDisplay = "block";
    } else {
      $scope.editMode === "添加" && ($scope.editDisplay = "none");
    }
  };
  // 生成规则
  $scope.openCreator = function () {
    $scope.inputError = ""; // 清空错误信息
    $scope.editDisplay = "none"; // 关闭添加规则
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
    navigator.clipboard
      .writeText($scope.subscriptions[curRuleIndex].url)
      .then(() => {
        alert("已将订阅规则复制到剪贴板！");
      });
  };

  /**
   * 订阅表单
   */
  // 订阅合集
  $scope.subscriptions = initiateSubscription(bg.localStorage.SGSSubs);
  // 当前订阅
  $scope.curSubscription = {
    ...defaultSubscription,
    sha: "",
    checked: true,
  };
  $scope.editDisplay = "none"; //订阅编辑框显示状态
  $scope.editMode = "添加"; //订阅编辑框保存按钮文本 添加/编辑 添加则新增规则 编辑则修改规则
  $scope.inputError = ""; //输入错误时候的警告
  // 关闭订阅表单
  $scope.hideEditBox = function () {
    $scope.editDisplay = "none";
  };
  // 切换订阅
  $scope.changeSubscription = function (sub) {
    for (var i = 0, len = $scope.subscriptions.length; i < len; i++) {
      if ($scope.subscriptions[i] !== sub) {
        $scope.subscriptions[i].checked = false;
      }
    }
  };
  // 编辑订阅
  $scope.editSubscription = function (sub) {
    $scope.curSubscription = sub;
    $scope.editMode = "编辑";
    $scope.editDisplay = "block";
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
    if ($scope.editMode == "生成") {
      $scope.uploadRule();
      return;
    }
    // 添加 编辑
    if (verify()) {
      if ($scope.editMode === "添加") {
        // deep copy
        let subscription = angular.copy($scope.curSubscription);
        console.warn(subscription);
        $scope.subscriptions.push(subscription);
      }
      saveData();
      $scope.editDisplay = "none";
      $scope.createDisplay = "none";
    }
  };
  // 删除订阅
  $scope.removeSubscription = function (sub) {
    for (var i = 0, len = $scope.subscriptions.length; i < len; i++) {
      if ($scope.subscriptions[i] === sub) {
        $scope.subscriptions.splice(i, 1);
      }
    }
    saveData();
  };

  /**
   * 规则表单
   */
  $scope.createDisplay = "none"; // 订阅编辑框显示状态
  // 生成规则
  $scope.createRule = function () {
    $scope.editMode = "生成";
    $scope.editDisplay = "block";
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
      "message": "上传规则: " + `${$scope.curSubscription.title}`,
      "content": btoa(unescape(encodeURIComponent(JSON.stringify(sgsRules))))
    }
    if ($scope.curSubscription.sha) {
      body.sha = $scope.curSubscription.sha;
    }
    fetch('https://api.github.com/repos/ME70N/sgsRules/contents/' + fileName, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body)
    })
    .then((res) => {
      $scope.toggleLoading(false);
      return res.json()
    })
    .then((data) => {
      if (data.content) {
        // 生成成功!
        let subscription_link = "https://raw.githubusercontent.com/ME70N/sgsRules/main/" + fileName;
        let sha = data.content.sha;
        $scope.$applyAsync(function () {
          $scope.updateError("生成成功!\n 您的订阅地址为: " + subscription_link + "\n 您的密匙为(更新规则需要, 请自行保管): " + sha);
        });
      } else {
        // 生成失败
        console.warn("生成失败");
        $scope.$applyAsync(function () {
          $scope.updateError(data.message);
        });
      }
    })

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
});
