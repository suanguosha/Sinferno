'use strict';var _0x3c8691=_0x575f;function _0x453b(){var _0x569046=['1623736VVYnle','blocking','https://avos-cloud-gwibfiplqh86.s3.amazonaws.com/XQ0v3b4ElnH1JANxGESM3Hy3zXPOR64c/dabao_daiji.png','storage','19820763KUzMPk','text/json','image/jpeg','./characterMap.json','onChanged','text/css','ruleSet','url','enable','text/javascript','match','text/plain','text/html','5335930muKyrT','622JdZqNQ','1941648uXErNx','length','web.sanguosha.com/10/pc/res/assets/runtime/general/seat/static','forEach','https://avos-cloud-gwibfiplqh86.s3.amazonaws.com/5Go3rpXLS1ygfFGrue9VTKdfBnA4r7f6/dabao.png','796392GKMKGi','menuOptions','then','addListener','7LukhWT','substring','push','6933TxxIJJ','1508568BALVXE','indexOf','已开启','local','charNo','keys','rows','curSub'];_0x453b=function(){return _0x569046;};return _0x453b();}(function(stringArrayFunction,comparisonValue){var _0x36ff2f=_0x575f,stringArray=stringArrayFunction();while(!![]){try{var expression=parseInt(_0x36ff2f(0x1b6))/0x1+-parseInt(_0x36ff2f(0x1b0))/0x2*(-parseInt(_0x36ff2f(0x1bd))/0x3)+parseInt(_0x36ff2f(0x1be))/0x4+parseInt(_0x36ff2f(0x1af))/0x5+-parseInt(_0x36ff2f(0x1b1))/0x6+parseInt(_0x36ff2f(0x1ba))/0x7*(parseInt(_0x36ff2f(0x1c6))/0x8)+-parseInt(_0x36ff2f(0x1a2))/0x9;if(expression===comparisonValue)break;else stringArray['push'](stringArray['shift']());}catch(e){stringArray['push'](stringArray['shift']());}}}(_0x453b,0x9b64d));function _0x575f(_0x13e64e,_0x5e64f9){var _0x5e03b3=_0x453b();return _0x575f=function(_0xe8c600,_0x453bbe){_0xe8c600=_0xe8c600-0x1a1;var _0xae8d99=_0x5e03b3[_0xe8c600];return _0xae8d99;},_0x575f(_0x13e64e,_0x5e64f9);}var curSub=[],menuOptions={'enable':!![],'switchText':'已开启'},characterMap={},banPool=[],typeMap={'txt':_0x3c8691(0x1ad),'html':_0x3c8691(0x1ae),'css':_0x3c8691(0x1a7),'js':_0x3c8691(0x1ab),'json':_0x3c8691(0x1a3),'xml':'text/xml','jpg':_0x3c8691(0x1a4),'gif':'image/gif','png':'image/png','webp':'image/webp'};function fetchCharacterMap(){var _0x264370=_0x3c8691;fetch(_0x264370(0x1a5))['then'](res=>res['json']())[_0x264370(0x1b8)](response=>{characterMap=response,getStorage();});};fetchCharacterMap();function getStorage(){var _0x438663=_0x3c8691;chrome[_0x438663(0x1a1)][_0x438663(0x1c1)]['get'](null,function(data){var _0x2c130b=_0x438663;Object[_0x2c130b(0x1c3)](data)[_0x2c130b(0x1b2)]!==0x0&&(curSub=data[_0x2c130b(0x1c5)]||[],menuOptions=data[_0x2c130b(0x1b7)]||{'enable':!![],'switchText':_0x2c130b(0x1c0)},updateBanPool());});}function updateBanPool(){var _0x342128=_0x3c8691;if(Object[_0x342128(0x1c3)](characterMap)[_0x342128(0x1b2)]==0x0)return;let ruleSet=curSub[_0x342128(0x1a8)]||[],charKeys=[];ruleSet[_0x342128(0x1b4)](group=>{var _0x44048c=_0x342128;group[_0x44048c(0x1c4)]['forEach'](char=>{var _0x35fccf=_0x44048c;if(char['checked'])charKeys[_0x35fccf(0x1bc)](char['key']);});}),banPool=charKeys['map'](key=>{var _0x21b150=_0x342128;return characterMap[key][_0x21b150(0x1c2)];});}chrome['webRequest']['onBeforeRequest']['addListener'](details=>{var _0x306771=_0x3c8691;if(!menuOptions[_0x306771(0x1aa)])return;var url=details[_0x306771(0x1a9)];if(url['indexOf'](_0x306771(0x1b3))>-0x1){let staticRegex=/https*?:\/\/web\.sanguosha\.com\/10\/pc\/res\/assets\/runtime\/general\/seat\/static\/(\w+)/,character=url[_0x306771(0x1ac)](staticRegex)[0x1];character=character[_0x306771(0x1bb)](0x1,character[_0x306771(0x1b2)]-0x1),banPool[_0x306771(0x1bf)](character)!=-0x1&&(url=_0x306771(0x1b5));}if(url[_0x306771(0x1bf)]('web.sanguosha.com/10/pc/res/assets/runtime/general/big/dynamic')>-0x1){let staticRegex=/https*?:\/\/web\.sanguosha\.com\/10\/pc\/res\/assets\/runtime\/general\/big\/dynamic\/(\w+)/,character=url['match'](staticRegex)[0x1];character=character['substring'](0x1,character[_0x306771(0x1b2)]-0x1),banPool[_0x306771(0x1bf)](character)!=-0x1&&(url=_0x306771(0x1c8));}return url===details['url']?{}:{'redirectUrl':url};},{'urls':['<all_urls>'],'types':['image','xmlhttprequest']},[_0x3c8691(0x1c7)]),chrome['storage'][_0x3c8691(0x1a6)][_0x3c8691(0x1b9)](getStorage);