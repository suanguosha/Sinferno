'use strict';
var sgs = angular.module('sgs', []);

// 初始化菜单
var initiateMenu = function (menuOptions) {
    if (menuOptions) return angular.fromJson(menuOptions);
    return {
        enable: true, // 是否开启
        switchText : "已开启" // 开关文案
    }
};

// chrome实例
var bg = chrome.extension.getBackgroundPage();

sgs.controller('mapListCtrl', function ($scope) {
    //保存订阅到localStorage
    var saveData = function () {
        bg.localStorage.menuOptions = angular.toJson($scope.menuOptions);
    };

    // 规则开关状态
    $scope.menuOptions = initiateMenu(bg.localStorage.menuOptions);

    // 点击规则开关
    $scope.toggleRules = function () {
        $scope.menuOptions = {
            enable: !$scope.menuOptions.enable,
            switchText: '已' + ($scope.menuOptions.enable ? '关闭': '开启')
        }
        // TODO 开启关闭功能
        saveData($scope.menuOptions.enable);
    };

    // // 更新规则状态
    // $scope.updateStatus = {
    //     loading :false,
    //     success: true,
    //     showResult: false
    // }

    // // 点击更新规则
    // $scope.updateRules = function () {
    //     $scope.updateStatus.loading = true;
    //     $scope.updateStatus.showResult = false;
    //     fetch("https://raw.githubusercontent.com/LDY681/LDY681.github.io/master/sgsRules.json?timestamp=" + Math.random()).then((res) => {
    //         // scope $apply 防止angular不更新view
    //         $scope.$apply(function () {
    //             $scope.updateStatus.loading = false;
    //             if (res.ok) {
    //                 $scope.updateStatus.success = true;
    //                 $scope.updateStatus.showResult = true;
    //                 res.json().then((res) => {
    //                     console.log(res)
    //                 });
    //             } else {
    //                 $scope.updateStatus.success = false;
    //                 $scope.updateStatus.showResult = true;
    //             }
    //         })
    //     });
    // };
});
