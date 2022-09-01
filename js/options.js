'use strict';
var sgs = angular.module('sgs', []);

var initiateRules = function(rules) {
    if (rules) return rules;
    return [{
        url: 'https://raw.githubusercontent.com/LDY681/LDY681.github.io/master/sgsRules.json', // 规则地址
        title: '酸果杀群内规则', // 规则标题
        comment: "每晚7-10点开整, 群号557948691", // 规则备注
        checked: true
    }]
}
sgs.controller('mapListCtrl', function($scope) {
    var bg = chrome.extension.getBackgroundPage();

    //保存规则数据到localStorage
    function saveData() {
        bg.localStorage.SGSRules = angular.toJson($scope.rules);
    }

    //当前编辑的规则
    $scope.curRule = {
        url: 'https://raw.githubusercontent.com/LDY681/LDY681.github.io/master/sgsRules.json', // 规则地址
        title: '酸果杀群内规则', // 规则标题
        comment: "每晚7-10点开整, 群号557948691", // 规则备注
        checked: true
    }
    
    // 规则合集
    $scope.rules = initiateRules(bg.localStorage.SGSRules);

    /**
     * 规则编辑
     */
    //编辑框显示状态
    $scope.editDisplay = 'none';

    //编辑框保存按钮文本 添加/编辑 添加则新增规则 编辑则修改规则
    $scope.editMode = '添加';

    //隐藏编辑框
    $scope.hideEditBox = function () {
        $scope.editDisplay = 'none';
    }

    //输入错误时候的警告
    $scope.inputError = '';

    //验证输入合法性
    $scope.verify = function () {
        if (!$scope.curRule.url) {
            $scope.inputError = '请输入订阅规则！';
            return false;
        }
        $scope.inputError = '';
        return true;
    }

    // 点击添加按钮
    $scope.importRules = function () {
        if ($scope.editDisplay === 'none') {
            $scope.curRule = {
                url: 'https://raw.githubusercontent.com/LDY681/LDY681.github.io/master/sgsRules.json', // 规则地址
                title: "酸果杀群内规则", // 规则标题
                comment: "每晚7-10点开整, 群号557948691" // 规则备注
            };
            $scope.editMode = '添加';
            $scope.editDisplay = 'block';
        } else {
            $scope.editMode === '添加' && ($scope.editDisplay = 'none');
        }
    };

    // 切换当前生效规则 一次只能开启一个
    $scope.changeRules = function (rule) {
        for (var i = 0, len = $scope.rules.length; i< len; i++) {
            if ($scope.rules[i] !== rule) {
                $scope.rules[i].checked = false;
            }
        }
    }

    //点击编辑按钮
    $scope.edit = function (rule) {
        $scope.curRule = rule;
        $scope.editMode = '编辑';
        $scope.editDisplay = 'block';
    }

    //编辑后保存
    $scope.saveRule = function () {
        if ( $scope.verify() ) {
            if ($scope.editMode === '添加') {
                $scope.rules.push($scope.curRule);
            } else {

            }
            saveData();
            $scope.editDisplay = 'none';
        }
    };

    //删除规则
    $scope.removeRules = function (rule) {
        for (var i = 0, len = $scope.rules.length; i< len; i++) {
            if ($scope.rules[i] === rule) {
                $scope.rules.splice(i, 1);
            }
        }
        saveData();
    }

    // 导出
    $scope.exportRules = function (rule) {
        navigator.clipboard.write(data).then(
            () => {
            /* success */
            },
            () => {
            /* failure */
            }
        );
    };

    // TODO 本地导出WIP
    $scope.export = function () {
        function saveAs(blob, filename) {
            var type = blob.type;
            var force_saveable_type = 'application/octet-stream';
            if (type && type != force_saveable_type) { // 强制下载，而非在浏览器中打开
                var slice = blob.slice || blob.webkitSlice;
                blob = slice.call(blob, 0, blob.size, force_saveable_type);
            }

            var url = URL.createObjectURL(blob);
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = url;
            save_link.download = filename;

            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
            URL.revokeObjectURL(url);
        }

        var URL = URL || webkitURL || window;
        var bb = new Blob([JSON.stringify($scope.rules, null, '\t')], {type: 'text/json'});
        saveAs(bb, 'sgsRules.json');
    }

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
