'use strict';
var sgs = angular.module('sgs', []);
var groupBy = function (collects, name) {
    var ret = {}, key;
    collects.forEach(function(elem) {
        var key = elem[name];
        ret[key] = ret[key] || [];
        ret[key].push(elem);
    });
    return ret;
}

sgs.controller('mapListCtrl', function ($scope) {
    // 规则开关状态
    $scope.switch = {
        enable: true, // 是否开启
        switchText : "已开启" // 开关文案
    }

    // 点击规则开关
    $scope.toggleRules = function () {
        $scope.switch = {
            enable: !$scope.switch.enable,
            switchText: '已' + ($scope.switch.enable ? '关闭': '开启')
        }
        // TODO 开启关闭功能
    };

    // 更新规则状态
    $scope.updateStatus = {
        loading :false,
        success: false,
    }

    // 点击更新规则
    $scope.updateRules = function () {
        $scope.updateStatus.loading = true;
        fetch("https://github.com/LDY681/zssanguo_2.0/blob/main/package.json").then((res) => {
            console.log(res.ok);
            if (res.ok) {
                res.json().then((r) => {
                    console.log(r);
                  });
            }
        })
        
        // setTimeout(() => {
        //     $scope.updateStatus.loading = false;
        //     $scope.updateStatus.success = true;
        //     setTimeout(() => {
        //         $scope.updateStatus.success = false;
        //     }, 1000)
        // }, 1000);
    };
});
