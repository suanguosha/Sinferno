'use strict';function _0x275f(_0x1db4a8,_0x1c09ff){var _0x1cc928=_0x1cc9();return _0x275f=function(_0x20e874,_0x53fdfd){_0x20e874=_0x20e874-0x1de;var _0x4eb428=_0x1cc928[_0x20e874];return _0x4eb428;},_0x275f(_0x1db4a8,_0x1c09ff);}var _0x38cf93=_0x275f;(function(stringArrayFunction,comparisonValue){var _0x299084=_0x275f,stringArray=stringArrayFunction();while(!![]){try{var expression=-parseInt(_0x299084(0x1f8))/0x1*(parseInt(_0x299084(0x1e7))/0x2)+-parseInt(_0x299084(0x1ec))/0x3+parseInt(_0x299084(0x1df))/0x4+-parseInt(_0x299084(0x1e4))/0x5+parseInt(_0x299084(0x1ed))/0x6*(parseInt(_0x299084(0x1f7))/0x7)+parseInt(_0x299084(0x1e6))/0x8+-parseInt(_0x299084(0x1eb))/0x9*(-parseInt(_0x299084(0x1ee))/0xa);if(expression===comparisonValue)break;else stringArray['push'](stringArray['shift']());}catch(e){stringArray['push'](stringArray['shift']());}}}(_0x1cc9,0x50206));var sgs=angular[_0x38cf93(0x1f5)](_0x38cf93(0x1e9),[]),storage=chrome[_0x38cf93(0x1ea)]['local'];function _0x1cc9(){var _0x1783c8=['9696CZCSEK','updateStatus','$applyAsync','已开启','menuOptions','2798925CwTFHc','set','4555208prSnem','734084ULIRTi','then','sgs','storage','2620458sFSQsa','1727778SmjqTC','240btEmZo','30sTAunI','enable','open','link','runtime','toggleRules','https://raw.githubusercontent.com/suanguosha/SCAM/main/release/release.json','module','keys','67487EhWucX','1EsQIiH','initiateMenuOptions'];_0x1cc9=function(){return _0x1783c8;};return _0x1cc9();}sgs['controller']('mapListCtrl',function($scope){var _0x5b1015=_0x38cf93,saveData=function(){var _0x421036=_0x275f;storage[_0x421036(0x1e5)]({'menuOptions':$scope[_0x421036(0x1e3)]},()=>{});};$scope[_0x5b1015(0x1e3)]={'enable':!![],'switchText':_0x5b1015(0x1e2)},storage['get'](['menuOptions'],function(data){var _0x591b75=_0x5b1015;$scope[_0x591b75(0x1de)](data[_0x591b75(0x1e3)]);}),$scope['initiateMenuOptions']=data=>{var _0x523794=_0x5b1015;Object[_0x523794(0x1f6)](data)['length']!==0x0&&$scope[_0x523794(0x1e1)](function(){var _0x2fc567=_0x523794;$scope[_0x2fc567(0x1e3)]=data;});},$scope[_0x5b1015(0x1f3)]=function(){var _0x4b7754=_0x5b1015;$scope['menuOptions']={'enable':!$scope[_0x4b7754(0x1e3)][_0x4b7754(0x1ef)],'switchText':'已'+($scope[_0x4b7754(0x1e3)]['enable']?'关闭':'开启')},saveData($scope[_0x4b7754(0x1e3)]);},$scope[_0x5b1015(0x1e0)]={'show':![],'link':''};var localVersion=chrome[_0x5b1015(0x1f2)]['getManifest']()['version'];fetch(_0x5b1015(0x1f4))['then'](res=>res['json']())[_0x5b1015(0x1e8)](response=>{var _0x4032fc=_0x5b1015;response[0x0]['version']>localVersion&&$scope[_0x4032fc(0x1e1)](function(){var _0x5184bc=_0x4032fc;$scope[_0x5184bc(0x1e0)]={'show':!![],'link':response[0x0][_0x5184bc(0x1f1)],'version':response[0x0]['version']};});}),$scope['goDownload']=function(){var _0x281585=_0x5b1015;window[_0x281585(0x1f0)]($scope['updateStatus'][_0x281585(0x1f1)],'_blank');};});