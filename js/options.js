"use strict";
var sgs = angular.module("sgs", []);

// 初始化规则
var initiateRules = function (rules) {
  if (rules) return angular.fromJson(rules);
  return [
    {
      url: "https://raw.githubusercontent.com/LDY681/LDY681.github.io/master/sgsRules.json", // 规则地址
      title: "酸果杀群内规则", // 规则标题
      comment: "每晚7-10点开整, 群号557948691", // 规则备注
      checked: true,
    },
  ];
};

// chrome实例
var bg = chrome.extension.getBackgroundPage();

var defaultRule = {
  url: "https://raw.githubusercontent.com/LDY681/LDY681.github.io/master/sgsRules.json", // 规则地址
  title: "酸果杀群内规则", // 规则标题
  comment: "每晚7-10点开整, 群号557948691" // 规则备注
}

sgs.controller("mapListCtrl", function ($scope) {

  //保存规则数据到localStorage
  var saveData = function () {
    bg.localStorage.SGSRules = angular.toJson($scope.rules);
  };

  /**
   * 订阅规则
  */
  // 订阅规则合集
  $scope.rules = initiateRules(bg.localStorage.SGSRules);
  //当前订阅规则
  $scope.curRule = {
    ...defaultRule,
    checked: true,
  };

  /**
   * 导航菜单
   */
  // 添加订阅
  $scope.importRules = function (curRule) {
    $scope.inputError = ""; // 清空错误信息
    if ($scope.editDisplay === "none") {
      if (!curRule) {
        $scope.curRule = defaultRule;
      }
      $scope.editMode = "添加";
      $scope.editDisplay = "block";
    } else {
      $scope.editMode === "添加" && ($scope.editDisplay = "none");
    }
  };
  // 生成规则
  $scope.openCreator = function() {
    if ($scope.createDisplay === "none") {
      $scope.createDisplay = "block";
    } else {
      $scope.createDisplay = "none";
    }
  };
  // 分享规则
  $scope.exportRules = function() {
    // 获取当前选中订阅规则
    let curRuleIndex = -1;
    for (var i = 0, len = $scope.rules.length; i < len; i++) {
      if ($scope.rules[i].checked) {
        curRuleIndex = i;
      }
    }
    if (curRuleIndex == -1) {
      alert("请选中需要分享的订阅规则！");
      return;
    }
    navigator.clipboard.writeText($scope.rules[curRuleIndex].url).then(
      () => {
        alert("已将订阅规则复制到剪贴板！");
      }
    );
  };

  /**
   * 订阅表单
   */
  $scope.editDisplay = "none"; //订阅编辑框显示状态
  $scope.editMode = "添加"; //订阅编辑框保存按钮文本 添加/编辑 添加则新增规则 编辑则修改规则
  $scope.inputError = ""; //输入错误时候的警告
  //　关闭编辑框
  $scope.hideEditBox = function () {
    $scope.editDisplay = "none";
  };
  // 切换订阅
  $scope.changeRules = function (rule) {
    for (var i = 0, len = $scope.rules.length; i < len; i++) {
      if ($scope.rules[i] !== rule) {
        $scope.rules[i].checked = false;
      }
    }
  };
  // 编辑订阅
  $scope.edit = function (rule) {
    $scope.curRule = rule;
    $scope.editMode = "编辑";
    $scope.editDisplay = "block";
  };
  // 保存订阅
  $scope.saveRule = function () {
    var verify = function () {
      if (!$scope.curRule.url) {
        $scope.inputError = "请输入订阅规则！";
        return false;
      }
      $scope.inputError = "";
      return true;
    };
    if (verify()) {
      if ($scope.editMode === "添加") {
        $scope.rules.push($scope.curRule);
      } else {
      }
      saveData();
      $scope.editDisplay = "none";
    }
  };
  // 删除订阅
  $scope.removeRules = function (rule) {
    console.log($scope.rules);
    for (var i = 0, len = $scope.rules.length; i < len; i++) {
      if ($scope.rules[i] === rule) {
        $scope.rules.splice(i, 1);
      }
    }
    saveData();
  };

  /**
   * 规则表单
   */
  $scope.createDisplay = "none"; //订阅编辑框显示状态
  //　关闭规则表单
  $scope.hideCreateBox = function () {
    $scope.createDisplay = "none";
  };
  // 生成规则
  $scope.createRules = function () {
    $scope.inputError = "新规则已生成" + JSON.stringify($scope.ruleSet) + "请保存订阅规则";
    $scope.curRule = {
      url: "https://raw.githubusercontent.com/LDY681/LDY681.github.io/master/sgsRules.json?timestamp=" + new Date().getTime(),
    };
    $scope.importRules($scope.curRule);
  };
  // 规则集合
  $scope.fetchRuleSet = function () {
    fetch("../ruleSet.json").then(res => res.json()).then(response => {
      $scope.$applyAsync(function () {
        $scope.ruleSet = response;
      });
    })
  };
  $scope.fetchRuleSet();


  // TODO 本地导出WIP
  $scope.export = function () {
    function saveAs(blob, filename) {
      var type = blob.type;
      var force_saveable_type = "application/octet-stream";
      if (type && type != force_saveable_type) {
        // 强制下载，而非在浏览器中打开
        var slice = blob.slice || blob.webkitSlice;
        blob = slice.call(blob, 0, blob.size, force_saveable_type);
      }

      var url = URL.createObjectURL(blob);
      var save_link = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "a"
      );
      save_link.href = url;
      save_link.download = filename;

      var event = document.createEvent("MouseEvents");
      event.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      save_link.dispatchEvent(event);
      URL.revokeObjectURL(url);
    }

    var URL = URL || webkitURL || window;
    var bb = new Blob([JSON.stringify($scope.rules, null, "\t")], {
      type: "text/json",
    });
    saveAs(bb, "sgsRules.json");
  };

  // TODO 本地导入WIP
  // document.getElementById('jsonFile').onchange = function () {
  //     var resultFile = this.files[0];
  //     if (resultFile) {
  //         var reader = new FileReader();
  //         reader.readAsText(resultFile);
  //         reader.onload = function (e) {
  //             try {
  //                 var data = JSON.parse(this.result);
  //                 $scope.rules.length = 0;
  //                 for (var i = 0, len = data.length; i < len; i++) {
  //                     $scope.rules.push(data[i]);
  //                 }
  //                 saveData();
  //                 location.reload();
  //             } catch (e) {
  //                 alert("导入失败，请检查文件格式是否正确");
  //             }
  //         };
  //     }
  // }
});
